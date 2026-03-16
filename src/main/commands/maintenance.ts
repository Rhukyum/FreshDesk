import { CommandDef } from './types'
import { runCommand } from '../utils/executor'

export const maintenanceCommands: CommandDef[] = [
  {
    id: 'clean-temp',
    label: 'Nettoyer les fichiers temporaires',
    description: 'Supprime les fichiers dans %TEMP% et C:\\Windows\\Temp. Libère de l\'espace disque.',
    noobLabel: 'Libérer de l\'espace',
    noobDesc: 'Supprime les fichiers inutiles accumulés sur ton PC pour libérer de la place.',
    category: 'maintenance',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'echo Cleaning user temp... && del /f /s /q "%TEMP%\\*" 2>nul && echo Cleaning system temp... && del /f /s /q "C:\\Windows\\Temp\\*" 2>nul && echo Temp files cleaned.',
        { onData, signal }
      )
  },
  {
    id: 'clean-prefetch',
    label: 'Nettoyer le dossier Prefetch',
    description: 'Supprime les fichiers .pf du dossier Prefetch (C:\\Windows\\Prefetch). Windows les recrée automatiquement.',
    noobLabel: 'Nettoyer le cache système',
    noobDesc: 'Efface des fichiers de démarrage obsolètes. Windows les recrée tout seul.',
    category: 'maintenance',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'del /f /q "C:\\Windows\\Prefetch\\*.pf" 2>nul && echo Prefetch cleaned.',
        { onData, signal }
      )
  },
  {
    id: 'reset-print-queue',
    label: 'Réinitialiser la file d\'impression',
    description: 'Arrête le spooler, vide la file d\'impression bloquée, redémarre le service.',
    noobLabel: 'Réparer l\'imprimante',
    noobDesc: 'Débloquer les impressions en attente qui ne se lancent plus.',
    category: 'maintenance',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'net stop spooler && del /f /q "C:\\Windows\\System32\\spool\\PRINTERS\\*" 2>nul && net start spooler && echo Print queue cleared.',
        { onData, signal }
      )
  },
  {
    id: 'clean-directx-cache',
    label: 'Nettoyer le cache DirectX',
    description: 'Supprime le cache de shader DirectX dans %LOCALAPPDATA%\\D3DSCache.',
    noobLabel: '',
    noobDesc: '',
    category: 'maintenance',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'del /f /s /q "%LOCALAPPDATA%\\D3DSCache\\*" 2>nul && echo DirectX cache cleaned.',
        { onData, signal }
      )
  },
  {
    id: 'reset-windows-store',
    label: 'Réinitialiser le Windows Store',
    description: 'Lance wsreset.exe pour réinitialiser le cache du Microsoft Store.',
    noobLabel: 'Réparer le Store Windows',
    noobDesc: 'Répare le Microsoft Store si les applications ne se téléchargent plus.',
    category: 'maintenance',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) => {
      onData('Resetting Windows Store cache...', 'stdout')
      return runCommand('wsreset.exe', { onData, signal, timeout: 30000 })
    }
  },
  {
    id: 'reset-explorer',
    label: 'Redémarrer l\'Explorateur Windows',
    description: 'Tue et redémarre explorer.exe. Résout les problèmes de barre des tâches et d\'interface.',
    noobLabel: 'Réparer la barre des tâches',
    noobDesc: 'Redémarre l\'interface Windows pour résoudre les problèmes visuels.',
    category: 'maintenance',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) => {
      onData('Restarting Windows Explorer...', 'stdout')
      return runCommand(
        'taskkill /f /im explorer.exe && timeout /t 2 /nobreak && start explorer.exe && echo Explorer restarted.',
        { onData, signal }
      )
    }
  },
  {
    id: 'clean-temp-deep',
    label: 'Nettoyage approfondi des fichiers temp',
    description: 'Nettoyage étendu incluant les dossiers temp AppData de tous les utilisateurs.',
    noobLabel: '',
    noobDesc: '',
    category: 'maintenance',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'del /f /s /q "%TEMP%\\*" 2>nul && del /f /s /q "C:\\Windows\\Temp\\*" 2>nul && del /f /s /q "%LOCALAPPDATA%\\Temp\\*" 2>nul && del /f /s /q "C:\\Windows\\Prefetch\\*.pf" 2>nul && echo Deep clean complete.',
        { onData, signal }
      )
  }
]
