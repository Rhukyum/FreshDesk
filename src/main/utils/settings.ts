import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

export interface AppSettings {
  mode: 'noob' | 'expert'
}

function getSettingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

export function loadSettings(): AppSettings {
  try {
    const file = getSettingsPath()
    if (existsSync(file)) {
      return JSON.parse(readFileSync(file, 'utf8'))
    }
  } catch {
    // ignore
  }
  return { mode: 'noob' }
}

export function saveSettings(settings: AppSettings): void {
  try {
    const dir = app.getPath('userData')
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(getSettingsPath(), JSON.stringify(settings), 'utf8')
  } catch {
    // ignore
  }
}
