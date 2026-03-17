import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

export interface AppSettings {
  mode: 'noob' | 'expert'
}

function getSettingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

const VALID_MODES: AppSettings['mode'][] = ['noob', 'expert']

export function loadSettings(): AppSettings {
  try {
    const file = getSettingsPath()
    if (existsSync(file)) {
      const parsed = JSON.parse(readFileSync(file, 'utf8'))
      const mode = VALID_MODES.includes(parsed?.mode) ? parsed.mode : 'noob'
      return { mode }
    }
  } catch {
    // ignore
  }
  return { mode: 'noob' }
}

export function saveSettings(settings: AppSettings): void {
  if (!VALID_MODES.includes(settings?.mode)) return
  try {
    const dir = app.getPath('userData')
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(getSettingsPath(), JSON.stringify({ mode: settings.mode }), 'utf8')
  } catch {
    // ignore
  }
}
