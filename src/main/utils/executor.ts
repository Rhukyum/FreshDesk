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

/**
 * Internal helper: spawns powershell.exe with an EncodedCommand and streams
 * output line-by-line to opts.onData.  Both runCommand and runPowerShell
 * funnel through here so that encoding handling lives in one place.
 *
 * extraEnv is merged into the child process environment and is used by
 * runCommand to pass the CMD string via FRESHDESK_CMD, avoiding any need
 * to escape special characters inside a PowerShell string literal.
 */
function spawnPowerShell(
  encoded: string,
  opts: ExecutorOptions,
  extraEnv?: Record<string, string>
): Promise<ExecutorResult> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const child = spawn(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-EncodedCommand', encoded],
      {
        shell: false,
        windowsHide: true,
        env: { ...process.env, TERM: 'dumb', PYTHONIOENCODING: 'utf-8', ...extraEnv }
      }
    )

    let aborted = false
    let timedOut = false

    if (opts.signal) {
      opts.signal.addEventListener('abort', () => {
        aborted = true
        child.kill('SIGTERM')
        setTimeout(() => child.kill('SIGKILL'), 1000)
      })
    }

    const timeoutMs = opts.timeout || 120000
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGTERM')
      setTimeout(() => child.kill('SIGKILL'), 1000)
    }, timeoutMs)

    // PowerShell outputs UTF-8 when [Console]::OutputEncoding is set to UTF8
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')

    const stdoutRL = createInterface({ input: child.stdout })
    stdoutRL.on('line', (line) => {
      opts.onData(line, 'stdout')
    })

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

/**
 * Run a CMD command with guaranteed UTF-8 output.
 *
 * The command is injected via the FRESHDESK_CMD environment variable so that
 * no escaping of quotes, ampersands, pipes, etc. is needed inside the
 * PowerShell script.  PowerShell forces its own console output encoding to
 * UTF-8 before handing off to cmd.exe, which means even tools that ignore
 * `chcp 65001` (e.g. ipconfig on French Windows) produce correctly-encoded
 * output.
 */
export function runCommand(cmd: string, opts: ExecutorOptions): Promise<ExecutorResult> {
  log.info(`Executing: ${cmd}`)

  // The PowerShell script reads the command from an env var, avoiding any
  // need to embed and escape the command string inside the script itself.
  const script = [
    '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
    '[Console]::InputEncoding  = [System.Text.Encoding]::UTF8',
    '$OutputEncoding = [System.Text.Encoding]::UTF8',
    '& cmd.exe /c "chcp 65001 >nul 2>&1 & $env:FRESHDESK_CMD"'
  ].join('\n')

  const encoded = Buffer.from(script, 'utf16le').toString('base64')
  return spawnPowerShell(encoded, opts, { FRESHDESK_CMD: cmd })
}

/**
 * Run a PowerShell script with UTF-8 output encoding enforced.
 */
export function runPowerShell(script: string, opts: ExecutorOptions): Promise<ExecutorResult> {
  const fullScript = [
    '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
    '[Console]::InputEncoding  = [System.Text.Encoding]::UTF8',
    '$OutputEncoding = [System.Text.Encoding]::UTF8',
    '& cmd.exe /c "chcp 65001 >nul" 2>$null',
    script
  ].join('\n')

  const encoded = Buffer.from(fullScript, 'utf16le').toString('base64')
  return spawnPowerShell(encoded, opts)
}
