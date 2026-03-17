import { CommandDef } from './types'
import { runCommand, runPowerShell } from '../utils/executor'

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
  },
  {
    id: 'sfc-scan',
    label: 'Vérification des fichiers système (SFC)',
    description: 'Lance sfc /scannow pour analyser et réparer les fichiers système Windows corrompus. Peut prendre 10-15 min.',
    noobLabel: 'Réparer les fichiers Windows',
    noobDesc: 'Analyse et répare les fichiers système Windows endommagés.',
    category: 'system',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('sfc /scannow', { onData, signal, timeout: 1800000 })
  },
  {
    id: 'dism-repair',
    label: 'Réparer l\'image Windows (DISM)',
    description: 'DISM /RestoreHealth — télécharge et restaure les fichiers système Windows corrompus depuis Windows Update. À lancer après SFC.',
    noobLabel: '',
    noobDesc: '',
    category: 'system',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'dism /online /cleanup-image /restorehealth',
        { onData, signal, timeout: 3600000 }
      )
  },
  {
    id: 'create-restore-point',
    label: 'Créer un point de restauration système',
    description: 'Crée un point de restauration système immédiatement. Permet de revenir en arrière en cas de problème.',
    noobLabel: 'Créer une sauvegarde système',
    noobDesc: 'Crée un point de sauvegarde pour pouvoir restaurer Windows si quelque chose tourne mal.',
    category: 'system',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Enable-ComputerRestore -Drive "C:\\" -ErrorAction SilentlyContinue; Checkpoint-Computer -Description "FreshDesk - Point de restauration manuel" -RestorePointType "MODIFY_SETTINGS"; Write-Output "Restore point created successfully."',
        { onData, signal, timeout: 120000 }
      )
  },
  {
    id: 'list-restore-points',
    label: 'Lister les points de restauration',
    description: 'Affiche tous les points de restauration système disponibles avec leur date et description.',
    noobLabel: '',
    noobDesc: '',
    category: 'system',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-ComputerRestorePoint | Select-Object Description, CreationTime, RestorePointType | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-activation',
    label: 'Vérifier l\'activation Windows',
    description: 'Vérifie le statut d\'activation de Windows (licence valide, expirée ou non activée).',
    noobLabel: 'Statut de Windows',
    noobDesc: 'Vérifie si ta version de Windows est correctement activée.',
    category: 'system',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('slmgr /xpr', { onData, signal })
  },
  {
    id: 'check-windows-version',
    label: 'Version Windows et numéro de build',
    description: 'Affiche la version exacte de Windows, le numéro de build et la date d\'installation.',
    noobLabel: 'Version de Windows',
    noobDesc: 'Affiche quelle version de Windows est installée sur ton PC.',
    category: 'system',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'winver 2>nul & reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v ProductName && reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v DisplayVersion && reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v CurrentBuildNumber',
        { onData, signal }
      )
  },
  {
    id: 'reset-windows-update-agent',
    label: 'Réinitialiser l\'agent Windows Update',
    description: 'Réinitialise complètement les composants Windows Update (services, dossiers cache, DLLs). Résout les erreurs de mise à jour persistantes.',
    noobLabel: 'Réparer les mises à jour',
    noobDesc: 'Réinitialise le système de mise à jour Windows pour corriger les erreurs de téléchargement.',
    category: 'system',
    risk: 'medium',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'net stop wuauserv && net stop cryptsvc && net stop bits && net stop msiserver && ren "C:\\Windows\\SoftwareDistribution" SoftwareDistribution.old 2>nul && ren "C:\\Windows\\System32\\catroot2" catroot2.old 2>nul && net start wuauserv && net start cryptsvc && net start bits && net start msiserver && echo Windows Update components reset.',
        { onData, signal, timeout: 120000 }
      )
  },
  {
    id: 'enable-dark-mode',
    label: 'Activer le mode sombre Windows',
    description: 'Active le thème sombre pour les applications Windows et l\'interface système.',
    noobLabel: 'Mode sombre',
    noobDesc: 'Active le thème sombre sur Windows pour réduire la fatigue oculaire.',
    category: 'system',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d 0 /f && reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v SystemUsesLightTheme /t REG_DWORD /d 0 /f && echo Dark mode enabled.',
        { onData, signal }
      )
  },
  {
    id: 'enable-light-mode',
    label: 'Activer le mode clair Windows',
    description: 'Active le thème clair pour les applications Windows et l\'interface système.',
    noobLabel: '',
    noobDesc: '',
    category: 'system',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d 1 /f && reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v SystemUsesLightTheme /t REG_DWORD /d 1 /f && echo Light mode enabled.',
        { onData, signal }
      )
  },
  {
    id: 'rebuild-bcd',
    label: 'Vérifier le BCD (Boot Configuration Data)',
    description: 'Affiche la configuration de démarrage Windows (BCD). Utile pour diagnostiquer les problèmes de boot.',
    noobLabel: '',
    noobDesc: '',
    category: 'system',
    risk: 'low',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('bcdedit /enum all', { onData, signal })
  },
  {
    id: 'disable-telemetry',
    label: 'Réduire la télémétrie Windows',
    description: 'Réduit le niveau de collecte de données Windows au minimum (niveau 1 - Sécurité uniquement).',
    noobLabel: '',
    noobDesc: '',
    category: 'system',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 1 /f && sc config DiagTrack start=disabled && sc stop DiagTrack && echo Telemetry reduced to minimum level.',
        { onData, signal }
      )
  },
  {
    id: 'disable-unnecessary-services',
    label: 'Désactiver les services inutiles',
    description: 'Désactive les services Windows rarement utilisés : Fax, Bluetooth (si absent), RemoteRegistry, XBox services.',
    noobLabel: '',
    noobDesc: '',
    category: 'system',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'sc config Fax start=disabled 2>nul && sc stop Fax 2>nul && sc config RemoteRegistry start=disabled 2>nul && sc stop RemoteRegistry 2>nul && sc config XblAuthManager start=disabled 2>nul && sc stop XblAuthManager 2>nul && sc config XblGameSave start=disabled 2>nul && sc stop XblGameSave 2>nul && echo Unnecessary services disabled.',
        { onData, signal }
      )
  },
  {
    id: 'check-environment-variables',
    label: 'Variables d\'environnement système',
    description: 'Affiche les variables d\'environnement système (PATH, TEMP, WINDIR, etc.).',
    noobLabel: '',
    noobDesc: '',
    category: 'system',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('set', { onData, signal })
  },
  {
    id: 'fix-clock-sync',
    label: 'Synchroniser l\'horloge Windows',
    description: 'Force la synchronisation de l\'heure Windows avec les serveurs NTP. Résout les problèmes de certificats et d\'authentification liés au décalage horaire.',
    noobLabel: 'Corriger l\'heure du PC',
    noobDesc: 'Synchronise l\'horloge de ton PC avec les serveurs de temps officiels.',
    category: 'system',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'w32tm /resync /force && w32tm /query /status && echo Clock synchronized.',
        { onData, signal }
      )
  },
  {
    id: 'list-installed-drivers',
    label: 'Liste des pilotes installés',
    description: 'Affiche tous les pilotes de périphériques installés avec leur version et état.',
    noobLabel: '',
    noobDesc: '',
    category: 'system',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-WmiObject Win32_PnPSignedDriver | Where-Object {$_.DeviceName} | Select-Object DeviceName, DriverVersion, DriverDate, Manufacturer | Sort-Object DeviceName | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'repair-office',
    label: 'Réparer Microsoft Office',
    description: 'Lance la réparation rapide de Microsoft Office (si installé) pour corriger les crashs et problèmes d\'ouverture de fichiers.',
    noobLabel: 'Réparer Microsoft Office',
    noobDesc: 'Répare Microsoft Office si Word, Excel ou PowerPoint ne fonctionnent plus.',
    category: 'system',
    risk: 'medium',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        '$officeKey = Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*","HKLM:\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*" -ErrorAction SilentlyContinue | Where-Object {$_.DisplayName -like "*Microsoft Office*" -or $_.DisplayName -like "*Microsoft 365*"} | Select-Object -First 1; if ($officeKey) { Write-Output "Office found: $($officeKey.DisplayName)"; Write-Output "Use Control Panel > Programs > Change > Quick Repair to fix Office." } else { Write-Output "Microsoft Office not found on this system." }',
        { onData, signal }
      )
  }
]
