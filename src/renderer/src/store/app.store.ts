import { create } from 'zustand'

export type AppMode = 'noob' | 'expert'
export type Category = 'all' | 'network' | 'maintenance' | 'performance' | 'security' | 'diagnostics' | 'system'
export type Risk = 'low' | 'medium' | 'high' | 'critical'

export interface CommandMeta {
  id: string
  label: string
  description: string
  noobLabel: string
  noobDesc: string
  category: Exclude<Category, 'all'>
  risk: Risk
  mode: 'noob' | 'expert' | 'both'
  adminRequired: boolean
  hasRollback: boolean
}

export interface OutputLine {
  text: string
  type: 'stdout' | 'stderr' | 'system'
  timestamp: number
}

export interface SystemStats {
  cpu: number
  ram: number
  ramTotal: number
  disk: number
  diskFreeGB: number
  uptime: string
}

export interface AdminInfo {
  isAdmin: boolean
  username: string
  hostname: string
  os: string
}

export interface LogEntry {
  timestamp: string
  level: string
  commandId: string
  message: string
  duration?: number
}

export interface ProgressInfo {
  percent: number
  message: string
  step: number
  total: number
  currentId?: string
}

interface AppStore {
  // Mode
  mode: AppMode
  setMode: (mode: AppMode) => void

  // Commands
  commands: CommandMeta[]
  setCommands: (cmds: CommandMeta[]) => void
  activeCategory: Category
  setActiveCategory: (cat: Category) => void
  searchQuery: string
  setSearchQuery: (q: string) => void

  // Execution
  isRunning: boolean
  setIsRunning: (v: boolean) => void
  currentCommandId: string | null
  setCurrentCommandId: (id: string | null) => void
  output: OutputLine[]
  appendOutput: (line: string, type: 'stdout' | 'stderr' | 'system') => void
  clearOutput: () => void
  progress: ProgressInfo | null
  setProgress: (p: ProgressInfo | null) => void

  // System
  adminInfo: AdminInfo | null
  setAdminInfo: (info: AdminInfo) => void
  systemStats: SystemStats | null
  setSystemStats: (stats: SystemStats) => void

  // Logs
  logs: LogEntry[]
  setLogs: (logs: LogEntry[]) => void

  // Last result
  lastSuccess: boolean | null
  setLastSuccess: (v: boolean | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  mode: 'noob',
  setMode: (mode) => set({ mode }),

  commands: [],
  setCommands: (commands) => set({ commands }),
  activeCategory: 'all',
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  isRunning: false,
  setIsRunning: (isRunning) => set({ isRunning }),
  currentCommandId: null,
  setCurrentCommandId: (currentCommandId) => set({ currentCommandId }),
  output: [],
  appendOutput: (text, type) =>
    set((state) => ({
      output: [...state.output.slice(-500), { text, type, timestamp: Date.now() }]
    })),
  clearOutput: () => set({ output: [] }),
  progress: null,
  setProgress: (progress) => set({ progress }),

  adminInfo: null,
  setAdminInfo: (adminInfo) => set({ adminInfo }),
  systemStats: null,
  setSystemStats: (systemStats) => set({ systemStats }),

  logs: [],
  setLogs: (logs) => set({ logs }),

  lastSuccess: null,
  setLastSuccess: (lastSuccess) => set({ lastSuccess })
}))
