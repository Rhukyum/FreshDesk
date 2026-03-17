import { CommandDef } from './types'
import { runCommand, runPowerShell } from '../utils/executor'

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
  },
  {
    id: 'clean-windows-update-cache',
    label: 'Vider le cache Windows Update',
    description: 'Arrête Windows Update, supprime le cache SoftwareDistribution, redémarre. Résout les téléchargements bloqués.',
    noobLabel: 'Réparer les mises à jour',
    noobDesc: 'Efface le cache des mises à jour pour corriger les téléchargements bloqués.',
    category: 'maintenance',
    risk: 'medium',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'net stop wuauserv && net stop bits && net stop cryptsvc && del /f /s /q "C:\\Windows\\SoftwareDistribution\\*" 2>nul && net start cryptsvc && net start bits && net start wuauserv && echo Windows Update cache cleared.',
        { onData, signal, timeout: 60000 }
      )
  },
  {
    id: 'clean-thumbnail-cache',
    label: 'Supprimer le cache des miniatures',
    description: 'Efface le cache des miniatures (thumbcache_*.db) dans %LOCALAPPDATA%\\Microsoft\\Windows\\Explorer. Les miniatures se recréent.',
    noobLabel: '',
    noobDesc: '',
    category: 'maintenance',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'taskkill /f /im explorer.exe && del /f /q "%LOCALAPPDATA%\\Microsoft\\Windows\\Explorer\\thumbcache_*.db" 2>nul && start explorer.exe && echo Thumbnail cache cleared.',
        { onData, signal }
      )
  },
  {
    id: 'clean-recycle-bin',
    label: 'Vider la corbeille',
    description: 'Vide la corbeille de tous les utilisateurs sans confirmation.',
    noobLabel: 'Vider la corbeille',
    noobDesc: 'Vide définitivement la corbeille pour libérer de l\'espace disque.',
    category: 'maintenance',
    risk: 'medium',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Clear-RecycleBin -Force -ErrorAction SilentlyContinue; Write-Output "Recycle Bin emptied."',
        { onData, signal }
      )
  },
  {
    id: 'clean-event-logs',
    label: 'Effacer les journaux d\'événements Windows',
    description: 'Vide les journaux Système, Application et Sécurité. Utile avant un audit ou pour libérer de l\'espace.',
    noobLabel: '',
    noobDesc: '',
    category: 'maintenance',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'wevtutil cl System && echo System log cleared. && wevtutil cl Application && echo Application log cleared. && wevtutil cl Security && echo Security log cleared.',
        { onData, signal }
      )
  },
  {
    id: 'clean-crash-dumps',
    label: 'Supprimer les fichiers de crash dump',
    description: 'Supprime les fichiers de vidage mémoire (minidump, memory.dmp) pour libérer de l\'espace disque.',
    noobLabel: '',
    noobDesc: '',
    category: 'maintenance',
    risk: 'low',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'del /f /q "C:\\Windows\\Minidump\\*" 2>nul && del /f /q "C:\\Windows\\memory.dmp" 2>nul && del /f /s /q "%LOCALAPPDATA%\\CrashDumps\\*" 2>nul && echo Crash dumps deleted.',
        { onData, signal }
      )
  },
  {
    id: 'clean-winsxs',
    label: 'Nettoyer le composant WinSXS',
    description: 'Lance DISM pour nettoyer les anciens composants Windows (WinSXS). Peut libérer plusieurs Go.',
    noobLabel: '',
    noobDesc: '',
    category: 'maintenance',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'dism /online /cleanup-image /startcomponentcleanup /resetbase && echo WinSXS cleanup complete.',
        { onData, signal, timeout: 600000 }
      )
  },
  {
    id: 'optimize-drive',
    label: 'Optimiser / Défragmenter le disque',
    description: 'Lance l\'optimisation du disque système (defrag C: pour HDD, TRIM pour SSD). Améliore les performances I/O.',
    noobLabel: 'Optimiser mon disque dur',
    noobDesc: 'Optimise le disque pour que ton PC accède plus vite aux fichiers.',
    category: 'maintenance',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('defrag C: /U /V /O', { onData, signal, timeout: 3600000 })
  },
  {
    id: 'reset-audio-service',
    label: 'Redémarrer le service Audio Windows',
    description: 'Arrête et redémarre le service Windows Audio. Résout les problèmes de son sans redémarrer le PC.',
    noobLabel: 'Réparer le son',
    noobDesc: 'Redémarre le système audio Windows pour corriger les problèmes de son.',
    category: 'maintenance',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'net stop audiosrv && net stop AudioEndpointBuilder && timeout /t 2 /nobreak && net start AudioEndpointBuilder && net start audiosrv && echo Audio service restarted.',
        { onData, signal }
      )
  },
  {
    id: 'clean-font-cache',
    label: 'Reconstruire le cache des polices',
    description: 'Supprime et reconstruit le cache des polices Windows. Résout les problèmes d\'affichage de texte.',
    noobLabel: '',
    noobDesc: '',
    category: 'maintenance',
    risk: 'low',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'net stop FontCache && net stop "FontCache3.0.0.0" 2>nul && del /f /q "%WinDir%\\ServiceProfiles\\LocalService\\AppData\\Local\\FontCache\\*" 2>nul && del /f /q "%WinDir%\\ServiceProfiles\\LocalService\\AppData\\Local\\FontCache-System\\*" 2>nul && net start FontCache && echo Font cache rebuilt.',
        { onData, signal }
      )
  },
  {
    id: 'clean-old-installers',
    label: 'Nettoyer le cache des installeurs Windows',
    description: 'Identifie l\'espace occupé par le dossier Windows\\Installer (souvent plusieurs Go de patchs orphelins).',
    noobLabel: '',
    noobDesc: '',
    category: 'maintenance',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        '$path = "C:\\Windows\\Installer"; $size = (Get-ChildItem $path -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum; Write-Output "Taille du dossier Installer: $([math]::Round($size/1GB,2)) GB ($([math]::Round($size/1MB,0)) MB)"',
        { onData, signal }
      )
  },
  {
    id: 'disk-cleanup-silent',
    label: 'Nettoyage de disque automatique (cleanmgr)',
    description: 'Lance le nettoyage de disque Windows en mode silencieux avec les options maximales.',
    noobLabel: 'Nettoyage automatique du disque',
    noobDesc: 'Lance l\'outil de nettoyage Windows pour supprimer les fichiers inutiles.',
    category: 'maintenance',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) => {
      onData('Configuring disk cleanup with maximum options...', 'stdout')
      return runCommand(
        'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VolumeCaches\\Temporary Files" /v StateFlags0001 /t REG_DWORD /d 2 /f 2>nul && cleanmgr /sagerun:1 /d C: && echo Disk cleanup started (running in background).',
        { onData, signal, timeout: 300000 }
      )
    }
  }
]
