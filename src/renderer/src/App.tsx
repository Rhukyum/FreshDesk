import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './store/app.store'
import TopBar from './components/layout/TopBar'
import StatusBar from './components/layout/StatusBar'
import NoobView from './components/noob/NoobView'
import ExpertView from './components/expert/ExpertView'
import UpdateDialog from './components/UpdateDialog'
import TestReportModal from './components/shared/TestReportModal'

declare global {
  interface Window {
    api: {
      getAllCommands: () => Promise<import('./store/app.store').CommandMeta[]>
      getNoobCommands: () => Promise<import('./store/app.store').CommandMeta[]>
      getFixAllOrder: () => Promise<string[]>
      runCommand: (id: string) => Promise<{ success: boolean; exitCode: number; duration: number }>
      runAll: (ids: string[]) => Promise<Array<{ id: string; success: boolean }>>
      stopCommand: () => void
      getSystemStats: () => Promise<import('./store/app.store').SystemStats>
      getAdminInfo: () => Promise<import('./store/app.store').AdminInfo>
      getLogs: (last?: number) => Promise<import('./store/app.store').LogEntry[]>
      exportLogs: () => Promise<boolean>
      getSettings: () => Promise<{ mode: string }>
      saveSettings: (s: { mode: string }) => Promise<void>
      onOutputData: (cb: (data: { line: string; type: 'stdout' | 'stderr' }) => void) => () => void
      onOutputDone: (cb: (data: { success: boolean; duration: number; exitCode: number }) => void) => () => void
      onOutputProgress: (cb: (data: { percent: number; message: string; step: number; total: number; currentId?: string }) => void) => () => void
      onUpdateAvailable: (cb: (info: { version: string; releaseNotes: string | null }) => void) => () => void
      onUpdateDownloadProgress: (cb: (data: { percent: number }) => void) => () => void
      startUpdateDownload: () => Promise<void>
      skipUpdate: () => Promise<void>
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
      getVersion: () => Promise<string>
    }
  }
}

export default function App() {
  const { mode, setMode, setCommands, setAdminInfo, appendOutput, setIsRunning, setCurrentCommandId, setProgress, setLastSuccess, clearOutput, commands, setLastTestReport, lastTestReport } = useAppStore()

  const [appVersion, setAppVersion] = useState<string>('')
  const [updateInfo, setUpdateInfo] = useState<{ version: string; releaseNotes: string | null } | null>(null)
  const [updateDownloadPercent, setUpdateDownloadPercent] = useState<number | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)

  useEffect(() => {
    // Load app version from main process
    window.api.getVersion().then(setAppVersion)

    // Load saved mode preference
    window.api.getSettings().then(({ mode }) => {
      if (mode === 'expert' || mode === 'noob') setMode(mode)
    })

    // Load all commands
    window.api.getAllCommands().then(setCommands)

    // Load admin info
    window.api.getAdminInfo().then(setAdminInfo)

    // Listen for output
    const unsubData = window.api.onOutputData(({ line, type }) => {
      appendOutput(line, type)
    })

    const unsubDone = window.api.onOutputDone(({ success, duration }) => {
      setIsRunning(false)
      setCurrentCommandId(null)
      setLastSuccess(success)
      setProgress(null)
      appendOutput(
        success
          ? `\n✓ Completed in ${duration < 1000 ? duration + 'ms' : (duration / 1000).toFixed(1) + 's'}`
          : '\n✗ Command failed',
        'system'
      )
    })

    const unsubProgress = window.api.onOutputProgress((data) => {
      setProgress(data)
      if (data.currentId) setCurrentCommandId(data.currentId)
    })

    // Listen for update events
    const unsubUpdate = window.api.onUpdateAvailable((info) => {
      setUpdateInfo(info)
      setUpdateDialogOpen(true)
    })

    const unsubDownload = window.api.onUpdateDownloadProgress(({ percent }) => {
      setUpdateDownloadPercent(percent)
    })

    return () => {
      unsubData()
      unsubDone()
      unsubProgress()
      unsubUpdate()
      unsubDownload()
    }
  }, [])

  const runCommand = async (id: string) => {
    clearOutput()
    setIsRunning(true)
    setCurrentCommandId(id)
    setLastSuccess(null)
    appendOutput(`> Running: ${id}`, 'system')
    const result = await window.api.runCommand(id)
    const cmd = commands.find((c) => c.id === id)
    if (cmd) {
      setLastTestReport({
        items: [{
          id,
          label: cmd.label,
          noobLabel: cmd.noobLabel,
          success: result?.success ?? false,
          duration: result?.duration
        }],
        totalSuccess: result?.success ? 1 : 0,
        totalFailed: result?.success ? 0 : 1,
        completedAt: Date.now(),
        isBatch: false
      })
    }
  }

  const runAll = async (ids: string[]) => {
    clearOutput()
    setIsRunning(true)
    setCurrentCommandId(null)
    setLastSuccess(null)
    setProgress({ percent: 0, message: 'Démarrage...', step: 0, total: ids.length })
    const results = await window.api.runAll(ids)
    setProgress(null)
    const items = results.map((r) => {
      const cmd = commands.find((c) => c.id === r.id)
      return {
        id: r.id,
        label: cmd?.label ?? r.id,
        noobLabel: cmd?.noobLabel ?? '',
        success: r.success
      }
    })
    setLastTestReport({
      items,
      totalSuccess: items.filter((i) => i.success).length,
      totalFailed: items.filter((i) => !i.success).length,
      completedAt: Date.now(),
      isBatch: true
    })
  }

  const handleUpdateStart = async () => {
    await window.api.startUpdateDownload()
  }

  const handleUpdateSkip = async () => {
    await window.api.skipUpdate()
    setUpdateDialogOpen(false)
    setUpdateInfo(null)
    setUpdateDownloadPercent(null)
  }

  return (
    <div className={`flex flex-col h-screen ${mode === 'noob' ? 'noob-mode' : 'expert-mode'}`}>
      <TopBar />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === 'noob' ? (
            <motion.div
              key="noob"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <NoobView onRun={runCommand} onRunAll={runAll} />
            </motion.div>
          ) : (
            <motion.div
              key="expert"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ExpertView onRun={runCommand} onRunAll={runAll} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <StatusBar version={appVersion} />

      {/* Auto-update dialog */}
      <UpdateDialog
        open={updateDialogOpen}
        version={updateInfo?.version ?? ''}
        downloadPercent={updateDownloadPercent}
        onUpdate={handleUpdateStart}
        onSkip={handleUpdateSkip}
      />

      {/* Test report */}
      <TestReportModal
        report={lastTestReport}
        onClose={() => setLastTestReport(null)}
      />
    </div>
  )
}
