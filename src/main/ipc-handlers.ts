import { ipcMain, BrowserWindow, dialog, app } from 'electron'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { allCommands, getCommandById, getCommandsMeta, getNoobCommands, getFixEverythingOrder } from './commands'
import { addLog, getLogs } from './utils/logger'
import { isAdmin, getSystemInfo } from './utils/admin'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

let currentAbortController: AbortController | null = null

function getMainWindow(): BrowserWindow | null {
  return BrowserWindow.getAllWindows()[0] ?? null
}

function sendOutput(line: string, type: 'stdout' | 'stderr'): void {
  getMainWindow()?.webContents.send('output:data', { line, type })
}

export function registerIpcHandlers(): void {
  // --- Commands ---

  ipcMain.handle('commands:get-all', () => getCommandsMeta())
  ipcMain.handle('commands:get-noob', () => getNoobCommands())
  ipcMain.handle('commands:get-fix-all', () => getFixEverythingOrder())

  ipcMain.handle('commands:run', async (_event, id: string) => {
    const command = getCommandById(id)
    if (!command) return { success: false, error: `Command not found: ${id}` }

    // Check admin if required
    if (command.adminRequired) {
      const admin = await isAdmin()
      if (!admin) {
        sendOutput('[Error: This command requires administrator privileges]', 'stderr')
        return { success: false, error: 'Admin required' }
      }
    }

    // Send initial progress so NoobProgressView shows activity
    getMainWindow()?.webContents.send('output:progress', {
      percent: 0,
      message: command.noobLabel || command.label,
      currentId: id,
      step: 1,
      total: 1
    })

    currentAbortController = new AbortController()
    const startTime = Date.now()

    try {
      const result = await command.execute(sendOutput, currentAbortController.signal)
      const duration = Date.now() - startTime

      // Send final progress
      getMainWindow()?.webContents.send('output:progress', {
        percent: 100,
        message: result.success ? 'Terminé !' : 'Erreur lors de l\'exécution',
        currentId: id,
        step: 1,
        total: 1
      })

      addLog({
        timestamp: new Date().toISOString(),
        level: result.success ? 'SUCCESS' : 'ERROR',
        commandId: id,
        message: result.success ? 'Completed successfully' : `Failed with exit code ${result.exitCode}`,
        duration
      })

      getMainWindow()?.webContents.send('output:done', {
        success: result.success,
        duration,
        exitCode: result.exitCode
      })

      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      addLog({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        commandId: id,
        message: msg
      })
      getMainWindow()?.webContents.send('output:done', { success: false, duration: 0, exitCode: -1 })
      return { success: false, error: msg }
    } finally {
      currentAbortController = null
    }
  })

  ipcMain.handle('commands:run-all', async (_event, ids: string[]) => {
    currentAbortController = new AbortController()
    const results: Array<{ id: string; success: boolean }> = []

    for (let i = 0; i < ids.length; i++) {
      if (currentAbortController.signal.aborted) break

      const id = ids[i]
      const command = getCommandById(id)
      if (!command) continue

      const percent = Math.round(((i) / ids.length) * 100)
      getMainWindow()?.webContents.send('output:progress', {
        percent,
        message: `Running: ${command.label}`,
        currentId: id,
        step: i + 1,
        total: ids.length
      })

      sendOutput(`\n▶ ${command.label}`, 'stdout')

      try {
        const result = await command.execute(sendOutput, currentAbortController.signal)
        results.push({ id, success: result.success })
        sendOutput(result.success ? `✓ Done (${result.duration}ms)` : `✗ Failed`, 'stdout')

        addLog({
          timestamp: new Date().toISOString(),
          level: result.success ? 'SUCCESS' : 'ERROR',
          commandId: id,
          message: result.success ? 'OK' : `Exit code ${result.exitCode}`,
          duration: result.duration
        })
      } catch (err) {
        results.push({ id, success: false })
        sendOutput(`✗ Error: ${err}`, 'stderr')
      }
    }

    getMainWindow()?.webContents.send('output:progress', {
      percent: 100,
      message: 'All done!',
      step: ids.length,
      total: ids.length
    })

    getMainWindow()?.webContents.send('output:done', {
      success: results.every((r) => r.success),
      duration: 0,
      exitCode: 0
    })

    currentAbortController = null
    return results
  })

  ipcMain.on('commands:stop', () => {
    currentAbortController?.abort()
  })

  // --- System Stats ---

  ipcMain.handle('system:get-stats', async () => {
    try {
      // CPU usage via wmic
      const { stdout: cpuOut } = await execAsync(
        'wmic cpu get loadpercentage /value',
        { timeout: 5000 }
      ).catch(() => ({ stdout: '' }))
      const cpuMatch = cpuOut.match(/LoadPercentage=(\d+)/)
      const cpu = cpuMatch ? parseInt(cpuMatch[1]) : 0

      // RAM via wmic
      const { stdout: memOut } = await execAsync(
        'wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /value',
        { timeout: 5000 }
      ).catch(() => ({ stdout: '' }))
      const freeMatch = memOut.match(/FreePhysicalMemory=(\d+)/)
      const totalMatch = memOut.match(/TotalVisibleMemorySize=(\d+)/)
      const freeKb = freeMatch ? parseInt(freeMatch[1]) : 0
      const totalKb = totalMatch ? parseInt(totalMatch[1]) : 1
      const ram = Math.round(((totalKb - freeKb) / totalKb) * 100)
      const ramTotal = Math.round(totalKb / 1024 / 1024)

      // Disk via wmic
      const { stdout: diskOut } = await execAsync(
        'wmic logicaldisk where "DeviceID=\'C:\'" get FreeSpace,Size /value',
        { timeout: 5000 }
      ).catch(() => ({ stdout: '' }))
      const diskFreeMatch = diskOut.match(/FreeSpace=(\d+)/)
      const diskSizeMatch = diskOut.match(/Size=(\d+)/)
      const diskFree = diskFreeMatch ? parseInt(diskFreeMatch[1]) : 0
      const diskSize = diskSizeMatch ? parseInt(diskSizeMatch[1]) : 1
      const disk = Math.round(((diskSize - diskFree) / diskSize) * 100)
      const diskFreeGB = Math.round(diskFree / 1024 / 1024 / 1024)

      // Uptime
      const { stdout: uptimeOut } = await execAsync(
        'wmic os get lastbootuptime /value',
        { timeout: 5000 }
      ).catch(() => ({ stdout: '' }))
      let uptime = 'Unknown'
      const bootMatch = uptimeOut.match(/LastBootUpTime=(\d{14})/)
      if (bootMatch) {
        const bootStr = bootMatch[1]
        const bootDate = new Date(
          parseInt(bootStr.substring(0, 4)),
          parseInt(bootStr.substring(4, 6)) - 1,
          parseInt(bootStr.substring(6, 8)),
          parseInt(bootStr.substring(8, 10)),
          parseInt(bootStr.substring(10, 12))
        )
        const diffMs = Date.now() - bootDate.getTime()
        const days = Math.floor(diffMs / 86400000)
        const hours = Math.floor((diffMs % 86400000) / 3600000)
        const mins = Math.floor((diffMs % 3600000) / 60000)
        uptime = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
      }

      return { cpu, ram, ramTotal, disk, diskFreeGB, uptime }
    } catch {
      return { cpu: 0, ram: 0, ramTotal: 0, disk: 0, diskFreeGB: 0, uptime: 'N/A' }
    }
  })

  // --- Admin info ---
  ipcMain.handle('system:admin-info', () => getSystemInfo())

  // --- Logs ---
  ipcMain.handle('logs:get', (_event, last = 100) => getLogs(last))
  ipcMain.handle('logs:clear', () => { /* clear implemented in logger */ })

  ipcMain.handle('logs:export-csv', async () => {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Exporter les logs',
      defaultPath: join(app.getPath('desktop'), `freshdesk-logs-${Date.now()}.csv`),
      filters: [{ name: 'CSV', extensions: ['csv'] }]
    })
    if (!filePath) return false
    const logs = getLogs(500)
    const rows = ['Timestamp,Level,Command,Message,Duration(ms)']
      .concat(logs.map(l =>
        `"${l.timestamp}","${l.level}","${l.commandId}","${l.message.replace(/"/g, '""')}","${l.duration ?? ''}"`
      ))
    writeFileSync(filePath, rows.join('\n'), 'utf8')
    return true
  })
}
