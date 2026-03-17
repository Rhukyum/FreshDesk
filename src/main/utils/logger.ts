import log from 'electron-log'
import { app } from 'electron'
import { join } from 'path'

export function setupLogger(): void {
  log.transports.file.resolvePathFn = () =>
    join(app.getPath('userData'), 'logs', 'freshdesk.log')
  log.transports.file.level = 'debug'
  log.transports.console.level = 'debug'
  log.transports.file.maxSize = 5 * 1024 * 1024 // 5MB rotation
  log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'
  log.info('Logger initialized')
}

export interface LogEntry {
  timestamp: string
  level: string
  commandId: string
  message: string
  duration?: number
}

const inMemoryLogs: LogEntry[] = []

export function addLog(entry: LogEntry): void {
  inMemoryLogs.push(entry)
  if (inMemoryLogs.length > 500) inMemoryLogs.shift()
  log.info(`[${entry.commandId}] ${entry.message}`)
}

export function getLogs(last = 100): LogEntry[] {
  return inMemoryLogs.slice(-last).reverse()
}

export function clearLogs(): void {
  inMemoryLogs.splice(0, inMemoryLogs.length)
}
