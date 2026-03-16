export type Category = 'network' | 'maintenance' | 'performance' | 'security' | 'diagnostics' | 'system'
export type Risk = 'low' | 'medium' | 'high' | 'critical'
export type Mode = 'noob' | 'expert' | 'both'

export interface CommandDef {
  id: string
  label: string
  description: string
  noobLabel: string
  noobDesc: string
  category: Category
  risk: Risk
  mode: Mode
  adminRequired: boolean
  hasRollback: boolean
  execute: (onData: (line: string, type: 'stdout' | 'stderr') => void, signal?: AbortSignal) => Promise<{ exitCode: number; duration: number; success: boolean }>
}

export type CommandDefMeta = Omit<CommandDef, 'execute'>
