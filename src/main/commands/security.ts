import { CommandDef } from './types'
import { runCommand, runPowerShell } from '../utils/executor'

export const securityCommands: CommandDef[] = [
  {
    id: 'check-defender',
    label: 'Statut Windows Defender',
    description: 'Vérifie le statut de Windows Defender : protection en temps réel, signatures, etc.',
    noobLabel: 'Vérifier mon antivirus',
    noobDesc: 'Vérifie que ton antivirus Windows est bien actif et à jour.',
    category: 'security',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell('Get-MpComputerStatus | Format-List', { onData, signal })
  },
  {
    id: 'check-uac',
    label: 'Statut du Contrôle de Compte (UAC)',
    description: 'Vérifie si le Contrôle de Compte Utilisateur est activé (recommandé).',
    noobLabel: 'Vérifier la sécurité',
    noobDesc: 'Vérifie que les protections de sécurité de base sont bien activées.',
    category: 'security',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v EnableLUA',
        { onData, signal }
      )
  },
  {
    id: 'list-admins',
    label: 'Lister les administrateurs',
    description: 'Affiche tous les comptes ayant des droits administrateur sur ce PC.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('net localgroup Administrators', { onData, signal })
  },
  {
    id: 'scan-defender',
    label: 'Scanner avec Windows Defender',
    description: 'Lance un scan rapide de l\'antivirus Windows Defender.',
    noobLabel: 'Scanner les virus',
    noobDesc: 'Lance une analyse rapide de ton PC pour détecter les virus.',
    category: 'security',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell('Start-MpScan -ScanType QuickScan; Write-Output "Scan complete."', {
        onData,
        signal,
        timeout: 300000
      })
  },
  {
    id: 'list-startup-registry',
    label: 'Programmes au démarrage (Registre)',
    description: 'Affiche les entrées Run/RunOnce du registre (HKLM + HKCU) — vecteurs courants de malwares.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'echo === HKCU Run === && reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" && echo === HKLM Run === && reg query "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"',
        { onData, signal }
      )
  },
  {
    id: 'check-bitlocker',
    label: 'Statut BitLocker (chiffrement disque)',
    description: 'Vérifie si BitLocker est activé sur les disques. Indique le niveau de protection des données au repos.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'low',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('manage-bde -status 2>nul || echo BitLocker not available or not configured.', { onData, signal })
  },
  {
    id: 'disable-smb1',
    label: 'Désactiver SMBv1 (EternalBlue)',
    description: 'Désactive le protocole SMBv1 vulnérable (exploit EternalBlue / WannaCry). Fortement recommandé sur tous les PC.',
    noobLabel: 'Bloquer une faille réseau connue',
    noobDesc: 'Désactive un protocole réseau dangereux exploité par les ransomwares comme WannaCry.',
    category: 'security',
    risk: 'medium',
    mode: 'both',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runPowerShell(
        'Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force; Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol -NoRestart -ErrorAction SilentlyContinue; Write-Output "SMBv1 disabled. System more secure against EternalBlue/WannaCry."',
        { onData, signal }
      )
  },
  {
    id: 'check-rdp-status',
    label: 'Vérifier l\'état du Bureau à Distance (RDP)',
    description: 'Vérifie si le Bureau à Distance est activé. Un RDP ouvert non nécessaire est une surface d\'attaque.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections',
        { onData, signal }
      )
  },
  {
    id: 'disable-rdp',
    label: 'Désactiver le Bureau à Distance (RDP)',
    description: 'Désactive RDP pour réduire la surface d\'attaque. À utiliser si le Bureau à Distance n\'est pas nécessaire.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f && netsh advfirewall firewall set rule group="Remote Desktop" new enable=No && echo RDP disabled.',
        { onData, signal }
      )
  },
  {
    id: 'disable-autorun',
    label: 'Désactiver l\'AutoRun / AutoPlay USB',
    description: 'Désactive l\'exécution automatique des supports amovibles (USB, CD). Empêche les infections par clé USB.',
    noobLabel: 'Bloquer les virus USB',
    noobDesc: 'Empêche les virus de se lancer automatiquement depuis une clé USB.',
    category: 'security',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v NoDriveTypeAutoRun /t REG_DWORD /d 0xFF /f && reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\IniFileMapping\\Autorun.inf" /ve /t REG_SZ /d "@SYS:DoesNotExist" /f && echo AutoRun disabled for all drive types.',
        { onData, signal }
      )
  },
  {
    id: 'audit-user-accounts',
    label: 'Audit des comptes utilisateurs',
    description: 'Liste tous les comptes utilisateurs locaux avec leur état (actif/désactivé), date de création et dernière connexion.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-LocalUser | Select-Object Name, Enabled, LastLogon, PasswordLastSet, PasswordRequired, PasswordNeverExpires, Description | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-password-policy',
    label: 'Politique de mots de passe',
    description: 'Affiche la politique de mots de passe locale : longueur minimale, expiration, historique, complexité.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('net accounts', { onData, signal })
  },
  {
    id: 'check-open-shares',
    label: 'Partages réseau ouverts',
    description: 'Liste tous les dossiers partagés sur ce PC. Les partages ouverts peuvent être un vecteur d\'attaque.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('net share', { onData, signal })
  },
  {
    id: 'update-defender-signatures',
    label: 'Mettre à jour les signatures Defender',
    description: 'Force la mise à jour immédiate des définitions de virus Windows Defender.',
    noobLabel: 'Mettre à jour l\'antivirus',
    noobDesc: 'Télécharge les dernières définitions de virus pour ton antivirus Windows.',
    category: 'security',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Update-MpSignature; Write-Output "Defender signatures updated."; (Get-MpComputerStatus).AntivirusSignatureLastUpdated',
        { onData, signal, timeout: 120000 }
      )
  },
  {
    id: 'check-firewall-rules',
    label: 'Règles actives du pare-feu',
    description: 'Liste les 30 premières règles entrantes actives du pare-feu Windows Defender.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-NetFirewallRule | Where-Object {$_.Enabled -eq "True" -and $_.Direction -eq "Inbound"} | Select-Object DisplayName, Action, Profile | Select-Object -First 30 | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-suspicious-processes',
    label: 'Processus suspects (ports réseau)',
    description: 'Croise les connexions réseau actives avec les processus pour détecter des communications suspectes.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'low',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-NetTCPConnection -State Established | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, @{Name="Process";Expression={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Name}} | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'check-defender-exclusions',
    label: 'Exclusions Windows Defender',
    description: 'Affiche les fichiers, dossiers, extensions et processus exclus du scan Defender. Potentiel vecteur d\'attaque.',
    noobLabel: '',
    noobDesc: '',
    category: 'security',
    risk: 'low',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        '$prefs = Get-MpPreference; Write-Output "=== Dossiers exclus ==="; $prefs.ExclusionPath; Write-Output "=== Extensions exclues ==="; $prefs.ExclusionExtension; Write-Output "=== Processus exclus ==="; $prefs.ExclusionProcess',
        { onData, signal }
      )
  },
  {
    id: 'enable-controlled-folder-access',
    label: 'Activer la protection des dossiers (Anti-ransomware)',
    description: 'Active l\'accès contrôlé aux dossiers Windows Defender — protection anti-ransomware pour Documents, Bureau, etc.',
    noobLabel: 'Protection anti-ransomware',
    noobDesc: 'Active la protection qui empêche les ransomwares de chiffrer tes fichiers.',
    category: 'security',
    risk: 'medium',
    mode: 'both',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runPowerShell(
        'Set-MpPreference -EnableControlledFolderAccess Enabled; Write-Output "Controlled Folder Access (anti-ransomware) enabled."',
        { onData, signal }
      )
  }
]
