import { CommandDef, CommandDefMeta } from './types'
import { networkCommands } from './network'
import { maintenanceCommands } from './maintenance'
import { performanceCommands } from './performance'
import { securityCommands } from './security'
import { diagnosticsCommands } from './diagnostics'
import { systemCommands } from './system'

export * from './types'

export const allCommands: CommandDef[] = [
  ...networkCommands,
  ...maintenanceCommands,
  ...performanceCommands,
  ...securityCommands,
  ...diagnosticsCommands,
  ...systemCommands
]

export function getCommandById(id: string): CommandDef | undefined {
  return allCommands.find((c) => c.id === id)
}

export function getCommandsMeta(): CommandDefMeta[] {
  return allCommands.map(({ execute: _execute, ...meta }) => meta)
}

export function getNoobCommands(): CommandDefMeta[] {
  return getCommandsMeta().filter(
    (c) => (c.mode === 'noob' || c.mode === 'both') && (c.risk === 'low' || c.risk === 'medium')
  )
}

export function getFixEverythingOrder(): string[] {
  return [
    'flush-dns',
    'clean-temp',
    'clean-prefetch',
    'reset-print-queue',
    'check-defender',
    'check-uac'
  ]
}
