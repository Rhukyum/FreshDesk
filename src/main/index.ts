import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import { registerIpcHandlers } from './ipc-handlers'
import { setupLogger } from './utils/logger'
import { loadSettings, saveSettings } from './utils/settings'
import log from 'electron-log'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 780,
    minWidth: 900,
    minHeight: 650,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function setupAutoUpdater(): void {
  autoUpdater.logger = log
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true


  autoUpdater.on('update-available', (info) => {
    log.info(`Update available: v${info.version}`)
    const win = BrowserWindow.getAllWindows()[0]
    win?.webContents.send('update:available', {
      version: info.version,
      releaseNotes: typeof info.releaseNotes === 'string' ? info.releaseNotes : null
    })
  })

  autoUpdater.on('download-progress', (progress) => {
    const win = BrowserWindow.getAllWindows()[0]
    win?.webContents.send('update:download-progress', {
      percent: Math.round(progress.percent),
      transferred: progress.transferred,
      total: progress.total
    })
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded, installing...')
    autoUpdater.quitAndInstall(false, true)
  })

  autoUpdater.on('error', (err) => {
    log.warn('Auto-updater error:', err.message)
  })

  autoUpdater.on('update-not-available', () => {
    log.info('App is up to date.')
  })

  // Check on every launch (silently, errors are caught)
  autoUpdater.checkForUpdates().catch((err) => {
    log.warn('Update check failed (no internet?):', err.message)
  })

  // IPC: user accepted the update → start download
  ipcMain.handle('update:start-download', () => {
    autoUpdater.downloadUpdate().catch((err) => {
      log.warn('Download failed:', err.message)
    })
  })

  // IPC: user skipped the update → do nothing, app continues
  ipcMain.handle('update:skip', () => {
    log.info('User skipped update')
  })
}

app.whenReady().then(() => {
  setupLogger()
  electronApp.setAppUserModelId('com.freshdesk.repair')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Window control IPC
  ipcMain.on('window:minimize', (e) => BrowserWindow.fromWebContents(e.sender)?.minimize())
  ipcMain.on('window:maximize', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (win?.isMaximized()) win.unmaximize()
    else win?.maximize()
  })
  ipcMain.on('window:close', (e) => BrowserWindow.fromWebContents(e.sender)?.close())

  registerIpcHandlers()

  // Settings IPC
  ipcMain.handle('settings:get', () => loadSettings())
  ipcMain.handle('settings:set', (_e, s: { mode: string }) => saveSettings(s))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Auto-updater (production only) — checks on every launch, asks user before installing
  if (!is.dev) {
    setupAutoUpdater()
  }

  log.info('FreshDesk v2.1.0 started')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
