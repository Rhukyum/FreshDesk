import { CommandDef } from './types'
import { runCommand, runPowerShell } from '../utils/executor'

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
  },
  {
    id: 'check-ram-details',
    label: 'Informations détaillées sur la RAM',
    description: 'Affiche la capacité, la vitesse, le type (DDR4/DDR5), le fabricant et les slots utilisés pour chaque barrette.',
    noobLabel: 'Infos sur ma mémoire RAM',
    noobDesc: 'Affiche les détails de la mémoire de ton PC (capacité, vitesse).',
    category: 'performance',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-CimInstance Win32_PhysicalMemory | Select-Object BankLabel, Capacity, Speed, MemoryType, SMBIOSMemoryType, Manufacturer, PartNumber | ForEach-Object { Write-Output "--- Barrette ---"; Write-Output "Slot    : $($_.BankLabel)"; Write-Output "Capacite: $([math]::Round($_.Capacity/1GB,1)) GB"; Write-Output "Vitesse : $($_.Speed) MHz"; Write-Output "Fabricant: $($_.Manufacturer)"; Write-Output "Ref     : $($_.PartNumber)" }',
        { onData, signal }
      )
  },
  {
    id: 'check-cpu-info',
    label: 'Informations processeur détaillées',
    description: 'Affiche le nom, la fréquence, le nombre de cœurs/threads et la charge actuelle du processeur.',
    noobLabel: 'Infos sur mon processeur',
    noobDesc: 'Affiche les caractéristiques du processeur de ton PC.',
    category: 'performance',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-CimInstance Win32_Processor | Select-Object Name, MaxClockSpeed, NumberOfCores, NumberOfLogicalProcessors, LoadPercentage | Format-List',
        { onData, signal }
      )
  },
  {
    id: 'disable-superfetch',
    label: 'Désactiver SysMain (Superfetch)',
    description: 'Désactive SysMain (anciennement Superfetch) qui précharge des apps en RAM. Peut réduire les pics de disque sur HDD/RAM limité.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'sc stop SysMain && sc config SysMain start=disabled && echo SysMain (Superfetch) disabled.',
        { onData, signal }
      )
  },
  {
    id: 'enable-game-mode',
    label: 'Activer le mode Jeu Windows',
    description: 'Active le Game Mode Windows pour prioriser les ressources CPU/GPU lors des jeux.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKCU\\Software\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 1 /f && reg add "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f && echo Game Mode enabled.',
        { onData, signal }
      )
  },
  {
    id: 'disable-transparency',
    label: 'Désactiver la transparence Windows',
    description: 'Désactive les effets de transparence de l\'interface. Améliore la réactivité sur GPU faible.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 0 /f && echo Transparency effects disabled.',
        { onData, signal }
      )
  },
  {
    id: 'set-high-performance-plan',
    label: 'Activer le plan Haute Performance',
    description: 'Active le plan d\'alimentation Haute Performance Windows. Empêche le throttling CPU en usage normal.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c && echo High Performance power plan activated.',
        { onData, signal }
      )
  },
  {
    id: 'disable-startup-delay',
    label: 'Supprimer le délai de démarrage des apps',
    description: 'Supprime le délai artificiel (StartupDelayInMSec) imposé aux programmes au démarrage de Windows.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Serialize" /v StartupDelayInMSec /t REG_DWORD /d 0 /f && echo Startup delay removed.',
        { onData, signal }
      )
  },
  {
    id: 'check-pagefile',
    label: 'Informations sur le fichier d\'échange (pagefile)',
    description: 'Affiche la configuration et la taille actuelle du fichier de pagination (pagefile.sys).',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-CimInstance Win32_PageFileUsage | Select-Object Name, CurrentUsage, AllocatedBaseSize, PeakUsage | Format-List; Get-CimInstance Win32_PageFileSetting | Select-Object Name, InitialSize, MaximumSize | Format-List',
        { onData, signal }
      )
  },
  {
    id: 'check-battery-report',
    label: 'Rapport de santé de la batterie',
    description: 'Génère un rapport HTML complet de la batterie (powercfg /batteryreport). Ouvre le fichier dans le répertoire courant.',
    noobLabel: 'Santé de ma batterie',
    noobDesc: 'Génère un rapport sur l\'état de santé de la batterie de ton PC portable.',
    category: 'performance',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'powercfg /batteryreport /output "%USERPROFILE%\\Desktop\\battery-report.html" && echo Battery report saved to Desktop.',
        { onData, signal }
      )
  },
  {
    id: 'check-power-efficiency',
    label: 'Rapport d\'efficacité énergétique',
    description: 'Génère un rapport d\'efficacité énergétique du PC (powercfg /energy). Identifie les processus gourmands.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'low',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'powercfg /energy /output "%USERPROFILE%\\Desktop\\energy-report.html" /duration 10 && echo Energy efficiency report saved to Desktop.',
        { onData, signal, timeout: 60000 }
      )
  },
  {
    id: 'list-autostart-impact',
    label: 'Impact des programmes au démarrage',
    description: 'Liste les programmes au démarrage avec leur impact mesuré (bas, moyen, élevé) sur le temps de boot.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, User | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'disable-cortana',
    label: 'Désactiver Cortana',
    description: 'Désactive Cortana via le registre pour réduire la consommation CPU/RAM en arrière-plan.',
    noobLabel: '',
    noobDesc: '',
    category: 'performance',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f && echo Cortana disabled via Group Policy.',
        { onData, signal }
      )
  }
]
