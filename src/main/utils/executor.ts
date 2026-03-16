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

    const child = spawn('cmd.exe', ['/c', cmd], {
      shell: false,
      windowsHide: true,
      env: { ...process.env, TERM: 'dumb' }
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
  const escaped = script.replace(/"/g, '\\"')
  const cmd = `powershell.exe -NoProfile -NonInteractive -Command "${escaped}"`
  return runCommand(cmd, opts)
}
