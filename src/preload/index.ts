import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // Commands
  getAllCommands: () => ipcRenderer.invoke('commands:get-all'),
  getNoobCommands: () => ipcRenderer.invoke('commands:get-noob'),
  getFixAllOrder: () => ipcRenderer.invoke('commands:get-fix-all'),
  runCommand: (id: string) => ipcRenderer.invoke('commands:run', id),
  runAll: (ids: string[]) => ipcRenderer.invoke('commands:run-all', ids),
  stopCommand: () => ipcRenderer.send('commands:stop'),

  // System
  getSystemStats: () => ipcRenderer.invoke('system:get-stats'),
  getAdminInfo: () => ipcRenderer.invoke('system:admin-info'),

  // Logs
  getLogs: (last?: number) => ipcRenderer.invoke('logs:get', last),

  // Events (main → renderer)
  onOutputData: (cb: (data: { line: string; type: 'stdout' | 'stderr' }) => void) => {
    ipcRenderer.on('output:data', (_e, data) => cb(data))
    return () => ipcRenderer.removeAllListeners('output:data')
  },
  onOutputDone: (cb: (data: { success: boolean; duration: number; exitCode: number }) => void) => {
    ipcRenderer.on('output:done', (_e, data) => cb(data))
    return () => ipcRenderer.removeAllListeners('output:done')
  },
  onOutputProgress: (
    cb: (data: { percent: number; message: string; step: number; total: number; currentId?: string }) => void
  ) => {
    ipcRenderer.on('output:progress', (_e, data) => cb(data))
    return () => ipcRenderer.removeAllListeners('output:progress')
  },

  // Window controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in global context)
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}

export type FreshDeskAPI = typeof api
