import { CommandDef } from './types'
import { runCommand } from '../utils/executor'

export const systemCommands: CommandDef[] = [
  {
    id: 'reset-icon-cache',
    label: 'Réinitialiser le cache d\'icônes',
    description: 'Supprime le cache d\'icônes Windows et le reconstruit. Résout les icônes manquantes ou corrompues.',
    noobLabel: 'Réparer les icônes',
    noobDesc: 'Corrige les icônes manquantes ou qui s\'affichent mal sur le bureau.',
    category: 'system',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'taskkill /f /im explorer.exe && del /f /q "%LOCALAPPDATA%\\IconCache.db" 2>nul && del /f /q "%LOCALAPPDATA%\\Microsoft\\Windows\\Explorer\\iconcache*.db" 2>nul && start explorer.exe && echo Icon cache rebuilt.',
        { onData, signal }
      )
  },
  {
    id: 'reset-taskbar',
    label: 'Réinitialiser la barre des tâches',
    description: 'Réinitialise les épingles de la barre des tâches en redémarrant explorer.exe.',
    noobLabel: 'Réparer la barre des tâches',
    noobDesc: 'Corrige les problèmes d\'affichage de la barre des tâches Windows.',
    category: 'system',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'taskkill /f /im explorer.exe && timeout /t 2 /nobreak && start explorer.exe && echo Taskbar reset complete.',
        { onData, signal }
      )
  },
  {
    id: 'reset-wmi',
    label: 'Réparer WMI (Windows Management)',
    description: 'Réinitialise le dépôt WMI (winmgmt /resetrepository). Résout les erreurs WMI persistantes. Opération risquée.',
    noobLabel: '',
    noobDesc: '',
    category: 'system',
    risk: 'critical',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'net stop winmgmt /y && winmgmt /resetrepository && net start winmgmt && echo WMI repository reset.',
        { onData, signal, timeout: 60000 }
      )
  },
  {
    id: 'disable-onedrive',
    label: 'Désactiver OneDrive au démarrage',
    description: 'Arrête OneDrive et le supprime du démarrage automatique via le registre.',
    noobLabel: '',
    noobDesc: '',
    category: 'system',
    risk: 'medium',
    mode: 'expert',
    adminRequired: false,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'taskkill /f /im OneDrive.exe 2>nul && reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v OneDrive /t REG_SZ /d "" /f && echo OneDrive disabled from startup.',
        { onData, signal }
      )
  },
  {
    id: 'check-updates',
    label: 'Vérifier les mises à jour Windows',
    description: 'Vérifie le statut des mises à jour Windows (wuauclt).',
    noobLabel: 'Mises à jour Windows',
    noobDesc: 'Vérifie si des mises à jour importantes sont disponibles pour ton PC.',
    category: 'system',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\WindowsUpdate\\Auto Update\\Results\\Install" /v LastSuccessTime 2>nul && wmic qfe list brief /format:table | more +1',
        { onData, signal }
      )
  }
]
