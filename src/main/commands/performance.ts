import { CommandDef } from './types'
import { runCommand } from '../utils/executor'

export const performanceCommands: CommandDef[] = [
  {
    id: 'check-ssd',
    label: 'Détecter les disques SSD',
    description: 'Détecte si le système utilise un SSD ou un HDD (wmic diskdrive).',
    noobLabel: 'Type de disque dur',
    noobDesc: 'Vérifie si ton ordinateur a un disque moderne (SSD) ou ancien (HDD).',
    category: 'performance',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('wmic diskdrive get model,mediatype,size /format:list', { onData, signal })
  },
  {
    id: 'top-processes',
    label: 'Processus qui consomment le plus',
    description: 'Liste les processus triés par consommation mémoire (tasklist).',
    noobLabel: 'Ce qui ralentit mon PC',
    noobDesc: 'Montre les programmes qui utilisent le plus de ressources de ton PC.',
    category: 'performance',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('tasklist /fo table | sort /R', { onData, signal })
  },
  {
    id: 'enable-fast-boot',
    label: 'Activer le démarrage rapide',
    description: 'Active HiberbootEnabled dans le registre pour accélérer le démarrage Windows.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f && echo Fast boot enabled.',
        { onData, signal }
      )
  },
  {
    id: 'enable-ultimate-performance',
    label: 'Activer le mode Performances Maximales',
    description: 'Duplique et active le plan d\'alimentation Performances Maximales. Utilise plus d\'énergie.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'powercfg /duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 && powercfg /setactive e9a42b02-d5df-448d-aa00-03f14749eb61 && echo Ultimate performance plan activated.',
        { onData, signal }
      )
  },
  {
    id: 'disable-indexing',
    label: 'Désactiver l\'indexation Windows Search',
    description: 'Arrête et désactive le service WSearch. Réduit l\'utilisation CPU/disque en arrière-plan.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'high',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'sc stop WSearch && sc config WSearch start=disabled && echo Windows Search indexing disabled.',
        { onData, signal }
      )
  },
  {
    id: 'disable-animations',
    label: 'Désactiver les animations Windows',
    description: 'Réduit les effets visuels pour améliorer la réactivité sur les machines peu puissantes.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'medium',
    mode: 'expert',
    adminRequired: false,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 2 /f && echo Animations disabled. Log out and back in for full effect.',
        { onData, signal }
      )
  }
]
