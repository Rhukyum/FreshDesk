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
  }
]
