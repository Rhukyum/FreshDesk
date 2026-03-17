import { CommandDef } from './types'
import { runCommand, runPowerShell } from '../utils/executor'

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
    label: 'Informations réseau complètes',
    description: 'Affiche la configuration réseau complète (ipconfig /all) : IP, DNS, passerelle, MAC.',
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
    label: 'Réinitialiser la pile réseau complète',
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
  },
  {
    id: 'ping-test',
    label: 'Test de connectivité réseau',
    description: 'Ping Google DNS (8.8.8.8), Cloudflare (1.1.1.1) et google.com pour vérifier la connectivité locale et Internet.',
    noobLabel: 'Tester ma connexion',
    noobDesc: 'Vérifie si ton PC communique bien avec Internet.',
    category: 'network',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'echo === Test DNS Google (8.8.8.8) === && ping -n 4 8.8.8.8 && echo === Test Cloudflare (1.1.1.1) === && ping -n 4 1.1.1.1 && echo === Test nom de domaine (google.com) === && ping -n 4 google.com',
        { onData, signal, timeout: 60000 }
      )
  },
  {
    id: 'traceroute',
    label: 'Tracer la route réseau',
    description: 'Trace le chemin réseau vers google.com (tracert) pour identifier les goulots d\'étranglement ou pannes de routage.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('tracert -d -h 20 8.8.8.8', { onData, signal, timeout: 120000 })
  },
  {
    id: 'check-open-ports',
    label: 'Ports réseau actifs et connexions',
    description: 'Liste tous les ports TCP/UDP en écoute et les connexions actives avec les PID associés (netstat -ano).',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'echo === Ports en ecoute === && netstat -ano | findstr "LISTENING" && echo === Connexions etablies === && netstat -ano | findstr "ESTABLISHED"',
        { onData, signal }
      )
  },
  {
    id: 'set-dns-google',
    label: 'Changer DNS vers Google (8.8.8.8)',
    description: 'Configure les serveurs DNS de l\'adaptateur actif sur les DNS Google (8.8.8.8 / 8.8.4.4). Améliore la résolution DNS.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runPowerShell(
        '$adapter = Get-NetAdapter | Where-Object {$_.Status -eq "Up"} | Select-Object -First 1; if ($adapter) { Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ServerAddresses ("8.8.8.8","8.8.4.4"); Write-Output "DNS Google configure sur : $($adapter.Name)" } else { Write-Output "Aucun adaptateur actif trouve" }',
        { onData, signal }
      )
  },
  {
    id: 'set-dns-cloudflare',
    label: 'Changer DNS vers Cloudflare (1.1.1.1)',
    description: 'Configure les serveurs DNS sur Cloudflare (1.1.1.1 / 1.0.0.1). DNS rapide et respectueux de la vie privée.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runPowerShell(
        '$adapter = Get-NetAdapter | Where-Object {$_.Status -eq "Up"} | Select-Object -First 1; if ($adapter) { Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ServerAddresses ("1.1.1.1","1.0.0.1"); Write-Output "DNS Cloudflare configure sur : $($adapter.Name)" } else { Write-Output "Aucun adaptateur actif trouve" }',
        { onData, signal }
      )
  },
  {
    id: 'reset-dns-auto',
    label: 'Remettre le DNS en automatique (DHCP)',
    description: 'Remet les DNS en obtention automatique via DHCP sur tous les adaptateurs réseau actifs.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-NetAdapter | Where-Object {$_.Status -eq "Up"} | ForEach-Object { Set-DnsClientServerAddress -InterfaceIndex $_.InterfaceIndex -ResetServerAddresses; Write-Output "DNS remis en auto pour : $($_.Name)" }',
        { onData, signal }
      )
  },
  {
    id: 'check-wifi-profiles',
    label: 'Profils Wi-Fi enregistrés',
    description: 'Liste tous les réseaux Wi-Fi mémorisés sur ce PC (netsh wlan show profiles).',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('netsh wlan show profiles', { onData, signal })
  },
  {
    id: 'show-wifi-passwords',
    label: 'Afficher les mots de passe Wi-Fi',
    description: 'Affiche les mots de passe de tous les réseaux Wi-Fi enregistrés (netsh wlan show profile key=clear).',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        '(netsh wlan show profiles) | Select-String "Profil Tous les utilisateurs" | ForEach-Object { $name = ($_ -split ":")[1].Trim(); $details = netsh wlan show profile name=$name key=clear; $pwd = ($details | Select-String "Contenu de la cle").ToString().Trim(); Write-Output "Reseau: $name | $pwd" }',
        { onData, signal }
      )
  },
  {
    id: 'check-arp-table',
    label: 'Table ARP (appareils sur le réseau)',
    description: 'Affiche la table ARP : liste des appareils détectés sur le réseau local avec leur adresse MAC.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('arp -a', { onData, signal })
  },
  {
    id: 'firewall-status',
    label: 'Statut du pare-feu Windows',
    description: 'Affiche l\'état du pare-feu Windows pour les profils Domaine, Privé et Public.',
    noobLabel: 'Vérifier le pare-feu',
    noobDesc: 'Vérifie que le pare-feu Windows est bien actif pour te protéger.',
    category: 'network',
    risk: 'low',
    mode: 'both',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('netsh advfirewall show allprofiles state', { onData, signal })
  },
  {
    id: 'reset-firewall',
    label: 'Réinitialiser le pare-feu Windows',
    description: 'Remet le pare-feu Windows à sa configuration par défaut. Supprime toutes les règles personnalisées.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'high',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand('netsh advfirewall reset && echo Firewall reset to default policy.', { onData, signal })
  },
  {
    id: 'check-hosts-file',
    label: 'Vérifier le fichier HOSTS',
    description: 'Affiche le contenu du fichier HOSTS (C:\\Windows\\System32\\drivers\\etc\\hosts). Détecte les redirections malveillantes.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'echo === Contenu du fichier HOSTS === && type "C:\\Windows\\System32\\drivers\\etc\\hosts"',
        { onData, signal }
      )
  },
  {
    id: 'disable-ipv6',
    label: 'Désactiver IPv6 sur tous les adaptateurs',
    description: 'Désactive le protocole IPv6 sur tous les adaptateurs réseau. Peut résoudre certains problèmes de routage.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'medium',
    mode: 'expert',
    adminRequired: true,
    hasRollback: true,
    execute: (onData, signal) =>
      runCommand(
        'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip6\\Parameters" /v DisabledComponents /t REG_DWORD /d 0xFF /f && echo IPv6 disabled. Reboot required.',
        { onData, signal }
      )
  },
  {
    id: 'check-smb-status',
    label: 'Vérifier les partages SMB actifs',
    description: 'Liste les partages réseau SMB actifs et les connexions en cours sur ce PC.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand('net share && echo === Sessions actives === && net session 2>nul', { onData, signal })
  },
  {
    id: 'list-network-adapters',
    label: 'Liste des adaptateurs réseau',
    description: 'Affiche tous les adaptateurs réseau (physiques et virtuels) avec leur état, vitesse et adresse MAC.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runPowerShell(
        'Get-NetAdapter | Select-Object Name, Status, LinkSpeed, MacAddress, InterfaceDescription | Format-Table -AutoSize',
        { onData, signal }
      )
  },
  {
    id: 'test-dns-resolution',
    label: 'Tester la résolution DNS',
    description: 'Résout plusieurs noms de domaine populaires pour vérifier le bon fonctionnement du DNS.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) =>
      runCommand(
        'echo Test google.com && nslookup google.com && echo Test cloudflare.com && nslookup cloudflare.com && echo Test microsoft.com && nslookup microsoft.com',
        { onData, signal, timeout: 30000 }
      )
  },
  {
    id: 'check-routing-table',
    label: 'Table de routage IP',
    description: 'Affiche la table de routage IP complète (route print). Utile pour diagnostiquer les problèmes de passerelle.',
    noobLabel: '',
    noobDesc: '',
    category: 'network',
    risk: 'low',
    mode: 'expert',
    adminRequired: false,
    hasRollback: false,
    execute: (onData, signal) => runCommand('route print', { onData, signal })
  }
]
