import { CommandDef } from './types'
import { runCommand } from '../utils/executor'

export const networkCommands: CommandDef[] = [
  {
    id: 'flush-dns',
    label: 'Vider le cache DNS',
    description: 'Efface le cache DNS local (ipconfig /flushdns). Résout les problèmes de résolution de noms de domaine.',
    noobLabel: 'Réparer Internet',
    noobDesc: 'Efface la mémoire des sites web pour régler les problèmes de connexion.',
    category: 'network',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) => runCommand('ipconfig /flushdns', { onData, signal })
  },
  {
    id: 'renew-ip',
    label: 'Renouveler l\'adresse IP',
    description: 'Libère et renouvelle l\'adresse IP (ipconfig /release + /renew). Résout les conflits d\'adresses IP.',
    noobLabel: 'Nouvelle connexion réseau',
    noobDesc: 'Demande une nouvelle adresse réseau à ton routeur pour régler les problèmes de connexion.',
    category: 'network',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('ipconfig /release && timeout /t 2 /nobreak && ipconfig /renew', { onData, signal, timeout: 60000 })
  },
  {
    id: 'clear-proxy',
    label: 'Réinitialiser le proxy Windows',
    description: 'Réinitialise les paramètres proxy WinHTTP (netsh winhttp reset proxy). Résout les problèmes d\'accès réseau via proxy.',
    noobLabel: 'Réinitialiser le proxy',
    noobDesc: 'Supprime les paramètres proxy qui pourraient bloquer ta connexion.',
    category: 'network',
    risk: 'low',
    mode: 'both',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) => runCommand('netsh winhttp reset proxy', { onData, signal })
  },
  {
    id: 'check-network-info',
    label: 'Informations réseau',
    description: 'Affiche la configuration réseau complète (ipconfig /all + netstat).',
    noobLabel: 'Voir ma connexion',
    noobDesc: 'Affiche les détails de ta connexion internet (IP, DNS, etc.).',
    category: 'network',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) => runCommand('ipconfig /all', { onData, signal })
  },
  {
    id: 'reset-network-stack',
    label: 'Réinitialiser la pile réseau',
    description: 'Réinitialise complètement la pile TCP/IP et Winsock (netsh int ip reset + netsh winsock reset). Nécessite un redémarrage.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'netsh int ip reset resetlog.txt && netsh winsock reset && echo Reboot required to complete reset.',
        { onData, signal }
      )
  },
  {
    id: 'purge-ipv6',
    label: 'Purger le cache IPv6',
    description: 'Réinitialise la configuration IPv6 (netsh interface ipv6 reset).',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('netsh interface ipv6 reset && netsh interface ipv6 delete destinationcache', { onData, signal })
  }
]
