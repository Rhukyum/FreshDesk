# 🧼 FreshDesk — Windows Maintenance & Optimization Toolkit

**FreshDesk** est une suite modulaire PowerShell pour diagnostiquer, entretenir, réparer et optimiser les systèmes Windows.  
Chaque script est auto-documenté, validé automatiquement et exécutable via un moteur CLI ou ligne de commande.

---

## 🔧 Fonctionnement

- Chaque script possède un en-tête `.SYNOPSIS`, `.DESCRIPTION`, `.AUTHOR`, `.METADATA`, `.REQUIRES`, etc.
- Le moteur lit dynamiquement les scripts depuis le dossier `/scripts/`, sans codage manuel
- Un menu CLI interactif permet de naviguer dans toutes les options
- Chaque exécution est journalisée (logs standards et logs d’erreurs)
- Des tests unitaires et d’intégration valident la stabilité de l’outil
- Une documentation HTML (`docs/index.html`) est générée automatiquement

---

## 📁 Arborescence des scripts

### 📂 Diagnostics
- **analyze-eventlog.ps1** : (aucun résumé)
  - (aucune description)
- **check-bsod-history.ps1** : (aucun résumé)
  - (aucune description)
- **check-updates-status.ps1** : (aucun résumé)
  - (aucune description)
- **export-system-summary.ps1** : (aucun résumé)
  - (aucune description)
- **frequent-crashes.ps1** : (aucun résumé)
  - (aucune description)
- **generate-performance-report.ps1** : (aucun résumé)
  - (aucune description)
- **list-app-crashes.ps1** : (aucun résumé)
  - (aucune description)
- **memory-diagnostics.ps1** : (aucun résumé)
  - (aucune description)
- **reboot-history.ps1** : (aucun résumé)
  - (aucune description)
- **startup-programs.ps1** : (aucun résumé)
  - (aucune description)

### 📂 Example
- **example-ko.ps1** : (aucun résumé)
  - (aucune description)
- **example-valid.ps1** : (aucun résumé)
  - (aucune description)

### 📂 Maintenance
- **clean-prefetch.ps1** : (aucun résumé)
  - (aucune description)
- **clean-shell-extensions.ps1** : (aucun résumé)
  - (aucune description)
- **clean-temp-deep.ps1** : (aucun résumé)
  - (aucune description)
- **clean-temp.ps1** : (aucun résumé)
  - (aucune description)
- **cleanmgr-automated.ps1** : (aucun résumé)
  - (aucune description)
- **disable-animations.ps1** : (aucun résumé)
  - (aucune description)
- **disable-onedrive.ps1** : (aucun résumé)
  - (aucune description)
- **reset-explorer.ps1** : (aucun résumé)
  - (aucune description)
- **reset-windows-store.ps1** : (aucun résumé)
  - (aucune description)
- **upgrade-all-apps.ps1** : (aucun résumé)
  - (aucune description)

### 📂 Network
- **clear-proxy-settings.ps1** : (aucun résumé)
  - (aucune description)
- **export-network-info.ps1** : (aucun résumé)
  - (aucune description)
- **flush-dns.ps1** : (aucun résumé)
  - (aucune description)
- **network-diagnose.ps1** : (aucun résumé)
  - (aucune description)
- **network-profile-public.ps1** : (aucun résumé)
  - (aucune description)
- **purge-ipv6-cache.ps1** : (aucun résumé)
  - (aucune description)
- **renew-ip.ps1** : (aucun résumé)
  - (aucune description)
- **reset-firewall-rules.ps1** : (aucun résumé)
  - (aucune description)
- **reset-network-stack.ps1** : (aucun résumé)
  - (aucune description)

### 📂 Performance
- **check-ssd-optimizations.ps1** : (aucun résumé)
  - (aucune description)
- **clean-directx-cache.ps1** : (aucun résumé)
  - (aucune description)
- **clean-xbox-cache.ps1** : (aucun résumé)
  - (aucune description)
- **disable-indexing.ps1** : (aucun résumé)
  - (aucune description)
- **disable-startup-services.ps1** : (aucun résumé)
  - (aucune description)
- **enable-fastboot.ps1** : (aucun résumé)
  - (aucune description)
- **enable-ultimate-performance.ps1** : (aucun résumé)
  - (aucune description)
- **is-disk-ssd.ps1** : (aucun résumé)
  - (aucune description)
- **top-processes.ps1** : (aucun résumé)
  - (aucune description)

### 📂 Security
- **check-defender-status.ps1** : (aucun résumé)
  - (aucune description)
- **check-uac-status.ps1** : (aucun résumé)
  - (aucune description)
- **list-admin-users.ps1** : (aucun résumé)
  - (aucune description)
- **list-runonce-keys.ps1** : (aucun résumé)
  - (aucune description)
- **reset-bitlocker-services.ps1** : (aucun résumé)
  - (aucune description)
- **reset-security-policies.ps1** : (aucun résumé)
  - (aucune description)
- **scan-defender.ps1** : (aucun résumé)
  - (aucune description)
- **scan-hidden-tasks.ps1** : (aucun résumé)
  - (aucune description)

### 📂 System
- **clear-icon-cache.ps1** : (aucun résumé)
  - (aucune description)
- **reset-color-profiles.ps1** : (aucun résumé)
  - (aucune description)
- **reset-display.ps1** : (aucun résumé)
  - (aucune description)
- **reset-file-associations.ps1** : (aucun résumé)
  - (aucune description)
- **reset-print-queue.ps1** : (aucun résumé)
  - (aucune description)
- **reset-taskbar.ps1** : (aucun résumé)
  - (aucune description)
- **reset-wmi.ps1** : (aucun résumé)
  - (aucune description)
- **rollback-example.ps1** : (aucun résumé)
  - (aucune description)
- **shutdown-restart.ps1** : (aucun résumé)
  - (aucune description)

### 📂 Test
- **simulate-script-failure.ps1** : (aucun résumé)
  - (aucune description)
- **simulate-script-long.ps1** : (aucun résumé)
  - (aucune description)

### 📂 Undo
- **undo-reset-network.ps1** : (aucun résumé)
  - (aucune description)