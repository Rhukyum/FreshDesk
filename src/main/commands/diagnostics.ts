import { CommandDef } from './types'
import { runCommand, runPowerShell } from '../utils/executor'

export const diagnosticsCommands: CommandDef[] = [
  {
    id: 'bsod-history',
    label: 'Historique des Écrans Bleus (BSOD)',
    description: 'Affiche les derniers écrans bleus enregistrés dans les journaux Windows (EventID 41 = kernel power).',
    noobLabel: 'Voir les crashs récents',
    noobDesc: 'Vérifie si ton PC a eu des plantages récents (écrans bleus).',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'wevtutil qe System /q:"*[System[Provider[@Name=\'Microsoft-Windows-Kernel-Power\'] and (EventID=41)]]" /c:10 /f:text /rd:true 2>nul || echo No kernel power events found.',
        { onData, signal }
      )
  },
  {
    id: 'event-log-errors',
    label: 'Erreurs récentes dans les journaux',
    description: 'Affiche les 20 dernières erreurs critiques du journal Système.',
    noobLabel: 'Détecter les problèmes',
    noobDesc: 'Analyse les erreurs récentes pour détecter les problèmes sur ton PC.',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'wevtutil qe System /q:"*[System[Level=2]]" /c:20 /f:text /rd:true 2>nul',
        { onData, signal }
      )
  },
  {
    id: 'reboot-history',
    label: 'Historique des redémarrages',
    description: 'Affiche les derniers arrêts et démarrages du système (EventID 6005/6006).',
    noobLabel: '',
    noobDesc: '',
    category: 'diagnostics',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'wevtutil qe System /q:"*[System[(EventID=6005 or EventID=6006 or EventID=6009)]]" /c:20 /f:text /rd:true',
        { onData, signal }
      )
  },
  {
    id: 'startup-programs',
    label: 'Programmes au démarrage',
    description: 'Liste tous les programmes configurés pour démarrer avec Windows (registre + dossier Startup).',
    noobLabel: 'Programmes qui démarrent avec Windows',
    noobDesc: 'Vois quels programmes se lancent automatiquement (peut ralentir le démarrage).',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'system-info',
    label: 'Informations système complètes',
    description: 'Affiche les informations détaillées sur le matériel et le système d\'exploitation.',
    noobLabel: 'Infos sur mon PC',
    noobDesc: 'Affiche les caractéristiques de ton PC (processeur, RAM, Windows version, etc.).',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('systeminfo', { onData, signal, timeout: 30000 })
  },
  {
    id: 'check-disk',
    label: 'Vérifier l\'état des disques',
    description: 'Vérifie l\'espace disque disponible sur toutes les partitions.',
    noobLabel: 'Espace disque disponible',
    noobDesc: 'Vérifie combien d\'espace libre il reste sur ton disque dur.',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('wmic logicaldisk get name,size,freespace,filesystem /format:list', { onData, signal })
  }
]
