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
  },
  {
    id: 'check-smart-status',
    label: 'Santé SMART des disques durs',
    description: 'Vérifie le statut SMART des disques durs/SSD. Détecte les disques défaillants avant la panne.',
    noobLabel: 'Santé du disque dur',
    noobDesc: 'Vérifie l\'état de santé de ton disque dur pour prévenir une panne.',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-PhysicalDisk | Select-Object FriendlyName, MediaType, OperationalStatus, HealthStatus, Size | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-driver-errors',
    label: 'Erreurs de pilotes récentes',
    description: 'Affiche les erreurs de pilotes (drivers) enregistrées dans le journal système des 7 derniers jours.',
    noobLabel: '',
    noobDesc: '',
    category: 'diagnostics',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        '$since = (Get-Date).AddDays(-7); Get-EventLog -LogName System -EntryType Error -Source "*driver*","*disk*","*storage*" -After $since -Newest 20 -ErrorAction SilentlyContinue | Select-Object TimeWritten, Source, Message | Format-List',
        { onData, signal }
      )
  },
  {
    id: 'check-gpu-info',
    label: 'Informations GPU (carte graphique)',
    description: 'Affiche les informations sur la carte graphique : nom, VRAM, pilote, résolution actuelle.',
    noobLabel: 'Infos sur ma carte graphique',
    noobDesc: 'Affiche les caractéristiques de la carte graphique de ton PC.',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion, CurrentHorizontalResolution, CurrentVerticalResolution, VideoModeDescription | Format-List',
        { onData, signal }
      )
  },
  {
    id: 'check-running-services',
    label: 'Services Windows en cours d\'exécution',
    description: 'Liste tous les services Windows actuellement démarrés, triés par nom.',
    noobLabel: '',
    noobDesc: '',
    category: 'diagnostics',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-Service | Where-Object {$_.Status -eq "Running"} | Select-Object Name, DisplayName, StartType | Sort-Object DisplayName | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-failed-services',
    label: 'Services qui ont échoué au démarrage',
    description: 'Liste les services configurés pour démarrer automatiquement mais qui sont actuellement arrêtés.',
    noobLabel: '',
    noobDesc: '',
    category: 'diagnostics',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-Service | Where-Object {$_.StartType -eq "Automatic" -and $_.Status -ne "Running"} | Select-Object Name, DisplayName, Status | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-scheduled-tasks',
    label: 'Tâches planifiées actives',
    description: 'Liste les tâches planifiées activées (non Microsoft) — utile pour détecter des tâches malveillantes persistantes.',
    noobLabel: '',
    noobDesc: '',
    category: 'diagnostics',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-ScheduledTask | Where-Object {$_.State -eq "Ready" -and $_.TaskPath -notlike "\\Microsoft\\*"} | Select-Object TaskName, TaskPath, State | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-application-crashes',
    label: 'Crashs d\'applications récents',
    description: 'Affiche les 20 derniers crashs d\'applications enregistrés dans le journal des applications (EventID 1000).',
    noobLabel: 'Applications qui ont planté',
    noobDesc: 'Voir quelles applications ont planté récemment sur ton PC.',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'wevtutil qe Application /q:"*[System[Provider[@Name=\'Application Error\'] and (EventID=1000)]]" /c:20 /f:text /rd:true 2>nul || echo No application crash events found.',
        { onData, signal }
      )
  },
  {
    id: 'check-missing-drivers',
    label: 'Périphériques sans pilote',
    description: 'Liste les périphériques Windows sans pilote installé ou avec des erreurs de pilote.',
    noobLabel: 'Pilotes manquants',
    noobDesc: 'Détecte les appareils connectés à ton PC qui n\'ont pas de pilote installé.',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-PnpDevice | Where-Object {$_.Status -ne "OK"} | Select-Object Status, Class, FriendlyName, InstanceId | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-installed-programs',
    label: 'Liste des logiciels installés',
    description: 'Affiche tous les logiciels installés avec leur version et date d\'installation.',
    noobLabel: 'Logiciels installés',
    noobDesc: 'Vois tous les programmes installés sur ton PC.',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-ItemProperty "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*","HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*" -ErrorAction SilentlyContinue | Where-Object {$_.DisplayName} | Select-Object DisplayName, DisplayVersion, Publisher, InstallDate | Sort-Object DisplayName | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-disk-health-chkdsk',
    label: 'Analyse CHKDSK du disque système',
    description: 'Lance une vérification rapide du disque C: (CHKDSK en lecture seule) pour détecter les erreurs de système de fichiers.',
    noobLabel: 'Vérifier les erreurs du disque',
    noobDesc: 'Analyse le disque dur pour trouver des erreurs de fichiers.',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('chkdsk C: /scan 2>nul || chkdsk C:', { onData, signal, timeout: 300000 })
  },
  {
    id: 'check-ram-usage',
    label: 'Utilisation mémoire par processus',
    description: 'Affiche les 20 processus qui consomment le plus de RAM en temps réel, triés par usage mémoire.',
    noobLabel: 'Ce qui utilise ma RAM',
    noobDesc: 'Vois quels programmes mangent le plus de mémoire de ton PC.',
    category: 'diagnostics',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 20 Name, @{N="RAM (MB)";E={[math]::Round($_.WorkingSet64/1MB,1)}}, CPU, Id | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-network-stats',
    label: 'Statistiques réseau et erreurs',
    description: 'Affiche les statistiques réseau TCP/IP : paquets envoyés/reçus, erreurs, connexions actives.',
    noobLabel: '',
    noobDesc: '',
    category: 'diagnostics',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('netstat -s -p tcp && netstat -s -p udp', { onData, signal })
  },
  {
    id: 'generate-system-report',
    label: 'Générer un rapport système complet',
    description: 'Lance msinfo32 en export XML pour générer un rapport complet sur le matériel, les pilotes et la configuration.',
    noobLabel: '',
    noobDesc: '',
    category: 'diagnostics',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'msinfo32 /report "%USERPROFILE%\\Desktop\\system-report.txt" && echo System report saved to Desktop.',
        { onData, signal, timeout: 60000 }
      )
  }
]
