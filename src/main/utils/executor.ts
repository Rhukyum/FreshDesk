import { spawn } from 'child_process'
import { createInterface } from 'readline'
import log from 'electron-log'

export interface ExecutorResult {
  exitCode: number
  duration: number
  success: boolean
}

export interface ExecutorOptions {
  onData: (line: string, type: 'stdout' | 'stderr') => void
  signal?: AbortSignal
  timeout?: number
}

export function runCommand(cmd: string, opts: ExecutorOptions): Promise<ExecutorResult> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    log.info(`Executing: ${cmd}`)

    // Prepend chcp 65001 to force UTF-8 output from Windows commands.
    // Use && so the command only runs after chcp succeeds.
    const child = spawn('cmd.exe', ['/c', `chcp 65001 >nul 2>&1 && ${cmd}`], {
      shell: false,
      windowsHide: true,
      env: { ...process.env, TERM: 'dumb', PYTHONIOENCODING: 'utf-8' }
    })

    let aborted = false
    let timedOut = false

    // Setup abort
    if (opts.signal) {
      opts.signal.addEventListener('abort', () => {
        aborted = true
        child.kill('SIGTERM')
        setTimeout(() => child.kill('SIGKILL'), 1000)
      })
    }

    // Setup timeout
    const timeoutMs = opts.timeout || 120000
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGTERM')
      setTimeout(() => child.kill('SIGKILL'), 1000)
    }, timeoutMs)

    // Force UTF-8 on Node.js streams so that accented characters (é, è, à…)
    // are decoded correctly even though chcp 65001 already set the console codepage.
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')

    // Stream stdout
    const stdoutRL = createInterface({ input: child.stdout })
    stdoutRL.on('line', (line) => {
      opts.onData(line, 'stdout')
    })

    // Stream stderr
    const stderrRL = createInterface({ input: child.stderr })
    stderrRL.on('line', (line) => {
      if (line.trim()) opts.onData(line, 'stderr')
    })

    child.on('close', (code) => {
      clearTimeout(timer)
      const duration = Date.now() - startTime
      const exitCode = code ?? 1

      if (aborted) {
        opts.onData('[Stopped by user]', 'stderr')
      } else if (timedOut) {
        opts.onData('[Timeout: command took too long]', 'stderr')
      }

      log.info(`Command finished: exitCode=${exitCode}, duration=${duration}ms`)
      resolve({ exitCode, duration, success: exitCode === 0 })
    })

    child.on('error', (err) => {
      clearTimeout(timer)
      log.error(`Spawn error: ${err.message}`)
      opts.onData(`[Error: ${err.message}]`, 'stderr')
      reject(err)
    })
  })
}

export function runPowerShell(script: string, opts: ExecutorOptions): Promise<ExecutorResult> {
  // Set output encoding to UTF-8 so accented characters display correctly
  const fullScript = `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8\n${script}`
  const encoded = Buffer.from(fullScript, 'utf16le').toString('base64')
  return runCommand(`powershell.exe -NoProfile -NonInteractive -EncodedCommand ${encoded}`, opts)
}
