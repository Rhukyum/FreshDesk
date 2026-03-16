# 💡 FreshDesk - PC Repair & Optimizer pour Windows

**FreshDesk** est une application de bureau Windows (Electron + React) conçue pour diagnostiquer, réparer et optimiser un PC en quelques clics. Elle propose deux modes d'interface : **Noob** (simplifié, en langage courant) et **Expert** (tableau complet avec terminal intégré).

---

![Electron](https://img.shields.io/badge/Electron-31-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Windows-lightgrey.svg)
![License](https://img.shields.io/github/license/Rhukyum/FreshDesk)

---

## 🎯 Objectif du projet

FreshDesk v2 est une **application de bureau native** pour Windows qui permet à n'importe quel utilisateur de :

- Réparer les problèmes courants en un clic (réseau, imprimante, cache, etc.)
- Exécuter des commandes système avancées avec un terminal intégré
- Visualiser les stats système en temps réel (CPU, RAM, disque, uptime)
- Consulter l'historique de toutes les commandes exécutées
- Fonctionner en mode Administrateur pour les opérations sensibles

---

## 🧬 Fonctionnalités principales

### 👶 Mode Noob

- Interface simple avec boutons en **langage courant** ("Réparer Internet", "Libérer de l'espace")
- Bouton **"Réparer et optimiser mon PC"** qui lance 6 corrections sûres automatiquement
- Navigation par **catégories visuelles** (Réseau, Maintenance, Performances, Sécurité, Diagnostics, Système)
- Confirmations avant chaque action sensible
- Vue de progression animée pendant l'exécution

### 🧑‍💻 Mode Expert

- **Tableau complet** de toutes les commandes avec filtres par catégorie et recherche
- **Panneau de détails** par commande : description technique, niveau de risque, rollback disponible, admin requis
- **Terminal intégré** avec sortie en temps réel (stdout/stderr colorés)
- **Viewer de logs** : historique de toutes les exécutions avec durée et statut
- Possibilité d'**arrêter** une commande en cours

### ⚙️ Moteur de commandes

- Toutes les commandes sont définies sous forme d'objets TypeScript typés (`CommandDef`)
- Chaque commande a : un ID unique, un label (expert + noob), une catégorie, un niveau de risque (`low / medium / high / critical`), un mode (`noob / expert / both`), et un flag `adminRequired`
- Exécution via `cmd.exe` ou `powershell.exe` avec timeout et signal d'annulation
- Sortie streamée ligne par ligne vers l'interface via IPC Electron

### 📊 Stats système en temps réel

- CPU (%), RAM (% + total Go), Disque C: (% utilisé + Go libres), Uptime
- Récupéré via `wmic` dans la barre de statut

---

## 🧱 Architecture du projet

```
FreshDesk/
├── src/
│   ├── main/                    # Processus principal Electron (Node.js)
│   │   ├── index.ts             # Point d'entrée : création fenêtre, IPC window controls
│   │   ├── ipc-handlers.ts      # Tous les handlers IPC (commandes, stats, logs)
│   │   ├── commands/
│   │   │   ├── types.ts         # Types TypeScript (CommandDef, Risk, Mode, Category)
│   │   │   ├── index.ts         # Agrégation + helpers (getCommandById, getNoobCommands…)
│   │   │   ├── network.ts       # Commandes réseau (DNS, IP, proxy, TCP/IP stack…)
│   │   │   ├── maintenance.ts   # Nettoyage (temp, prefetch, imprimante, Store, Explorer…)
│   │   │   ├── performance.ts   # Performances (SSD, processus, fast boot, animations…)
│   │   │   ├── security.ts      # Sécurité (Defender, UAC, admins, scan virus…)
│   │   │   ├── diagnostics.ts   # Diagnostics (BSOD, logs erreurs, démarrage, infos PC…)
│   │   │   └── system.ts        # Système (icônes, barre des tâches, WMI, OneDrive…)
│   │   └── utils/
│   │       ├── executor.ts      # runCommand() + runPowerShell() avec stream + timeout
│   │       ├── logger.ts        # Logger centralisé (electron-log + in-memory logs)
│   │       └── admin.ts         # isAdmin() + getSystemInfo()
│   ├── preload/
│   │   └── index.ts             # Pont sécurisé (contextBridge) : expose window.api
│   └── renderer/
│       └── src/
│           ├── App.tsx           # Racine React : routing Noob/Expert, IPC listeners
│           ├── store/
│           │   └── app.store.ts  # Store Zustand global (mode, commandes, output, stats…)
│           ├── components/
│           │   ├── layout/
│           │   │   ├── TopBar.tsx      # Barre de titre + switch mode + contrôles fenêtre
│           │   │   └── StatusBar.tsx   # Stats CPU/RAM/Disk/Uptime en temps réel
│           │   ├── noob/
│           │   │   ├── NoobView.tsx        # Écran d'accueil noob + grille catégories
│           │   │   ├── CategoryCard.tsx    # Carte de catégorie cliquable
│           │   │   ├── NoobCommandList.tsx # Liste des commandes d'une catégorie
│           │   │   ├── NoobProgressView.tsx # Vue de progression pendant exécution
│           │   │   └── ConfirmDialog.tsx   # Modale de confirmation
│           │   ├── expert/
│           │   │   ├── ExpertView.tsx   # Layout expert : sidebar + tableau + terminal
│           │   │   ├── Sidebar.tsx      # Filtres catégories + recherche
│           │   │   ├── CommandTable.tsx # Tableau de toutes les commandes
│           │   │   ├── OutputPanel.tsx  # Terminal (sortie en temps réel)
│           │   │   └── LogViewer.tsx    # Historique des logs
│           │   └── shared/
│           │       └── RiskBadge.tsx    # Badge coloré de niveau de risque
│           └── styles/
│               └── globals.css          # Styles Tailwind + variables thèmes noob/expert
├── electron.vite.config.ts      # Config Vite pour les 3 processus (main/preload/renderer)
├── electron-builder.json        # Config build : NSIS installer, icône, appId
├── tailwind.config.js           # Config Tailwind avec couleurs custom noob/expert
├── package.json                 # Dépendances et scripts npm
└── tsconfig.json                # Config TypeScript racine
```

---

## 🔄 Comment ça fonctionne

### Communication Electron (IPC)

FreshDesk utilise le modèle Electron à 3 couches :

```
Renderer (React) ──► Preload (contextBridge) ──► Main (Node.js)
                           window.api
```

1. **Renderer** appelle `window.api.runCommand(id)` (défini dans `preload/index.ts`)
2. **Preload** transfère via `ipcRenderer.invoke('commands:run', id)`
3. **Main** (`ipc-handlers.ts`) reçoit, exécute la commande, streame la sortie avec `webContents.send('output:data', ...)`
4. **Renderer** reçoit les lignes en temps réel via `window.api.onOutputData(cb)`

### Exécution des commandes (`executor.ts`)

```typescript
runCommand(cmd, { onData, signal, timeout })
```

- Spawn `cmd.exe /c <commande>` (ou `powershell.exe` pour `runPowerShell`)
- Lecture ligne par ligne via `readline` sur stdout/stderr
- Timeout configurable (défaut 120s), annulation via `AbortSignal`
- Log automatique dans `electron-log`

### Catalogue de commandes (`commands/`)

Chaque commande est un objet `CommandDef` :

```typescript
{
  id: 'flush-dns',
  label: 'Vider le cache DNS',          // affiché en mode Expert
  noobLabel: 'Réparer Internet',         // affiché en mode Noob
  description: '...',                    // description technique
  noobDesc: '...',                       // description simplifiée
  category: 'network',
  risk: 'low',                           // low | medium | high | critical
  mode: 'both',                          // noob | expert | both
  adminRequired: true,
  hasRollback: false,
  execute: (onData, signal) => runCommand('ipconfig /flushdns', { onData, signal })
}
```

### Store global (`app.store.ts`)

Géré avec **Zustand**, le store contient :
- `mode` : `'noob'` ou `'expert'`
- `commands` : liste de toutes les commandes (métadonnées uniquement, sans `execute`)
- `output` : buffer de 500 lignes de terminal
- `isRunning`, `currentCommandId`, `progress` : état d'exécution
- `adminInfo` : username, hostname, OS, isAdmin
- `systemStats` : CPU, RAM, disque, uptime
- `logs` : historique des exécutions

---

## 📋 Catalogue des commandes

### 🌐 Réseau (`network`)

| ID | Label | Mode | Risque | Admin |
|----|-------|------|--------|-------|
| `flush-dns` | Vider le cache DNS | both | low | oui |
| `renew-ip` | Renouveler l'adresse IP | both | low | oui |
| `clear-proxy` | Réinitialiser le proxy Windows | both | low | oui |
| `check-network-info` | Informations réseau | both | low | non |
| `reset-network-stack` | Réinitialiser la pile réseau (TCP/IP + Winsock) | expert | medium | oui |
| `purge-ipv6` | Purger le cache IPv6 | expert | medium | oui |

### 🔧 Maintenance (`maintenance`)

| ID | Label | Mode | Risque | Admin |
|----|-------|------|--------|-------|
| `clean-temp` | Nettoyer les fichiers temporaires | both | low | oui |
| `clean-prefetch` | Nettoyer le dossier Prefetch | both | low | oui |
| `reset-print-queue` | Réinitialiser la file d'impression | both | low | oui |
| `clean-directx-cache` | Nettoyer le cache DirectX | expert | low | non |
| `reset-windows-store` | Réinitialiser le Windows Store | both | low | non |
| `reset-explorer` | Redémarrer l'Explorateur Windows | both | low | non |
| `clean-temp-deep` | Nettoyage approfondi des fichiers temp | expert | medium | oui |

### ⚡ Performances (`performance`)

| ID | Label | Mode | Risque | Admin |
|----|-------|------|--------|-------|
| `check-ssd` | Détecter les disques SSD | both | low | non |
| `top-processes` | Processus qui consomment le plus | both | low | non |
| `enable-fast-boot` | Activer le démarrage rapide | expert | medium | oui |
| `enable-ultimate-performance` | Activer le mode Performances Maximales | expert | medium | oui |
| `disable-indexing` | Désactiver l'indexation Windows Search | expert | high | oui |
| `disable-animations` | Désactiver les animations Windows | expert | medium | non |

### 🔒 Sécurité (`security`)

| ID | Label | Mode | Risque | Admin |
|----|-------|------|--------|-------|
| `check-defender` | Statut Windows Defender | both | low | non |
| `check-uac` | Statut du Contrôle de Compte (UAC) | both | low | non |
| `list-admins` | Lister les administrateurs | expert | low | non |
| `scan-defender` | Scanner avec Windows Defender | both | low | oui |
| `list-startup-registry` | Programmes au démarrage (Registre) | expert | low | non |

### 🩺 Diagnostics (`diagnostics`)

| ID | Label | Mode | Risque | Admin |
|----|-------|------|--------|-------|
| `bsod-history` | Historique des Écrans Bleus (BSOD) | both | low | non |
| `event-log-errors` | Erreurs récentes dans les journaux | both | low | non |
| `reboot-history` | Historique des redémarrages | expert | low | non |
| `startup-programs` | Programmes au démarrage | both | low | non |
| `system-info` | Informations système complètes | both | low | non |
| `check-disk` | Vérifier l'état des disques | both | low | non |

### 🖥️ Système (`system`)

| ID | Label | Mode | Risque | Admin |
|----|-------|------|--------|-------|
| `reset-icon-cache` | Réinitialiser le cache d'icônes | both | low | non |
| `reset-taskbar` | Réinitialiser la barre des tâches | both | low | non |
| `reset-wmi` | Réparer WMI (Windows Management) | expert | critical | oui |
| `disable-onedrive` | Désactiver OneDrive au démarrage | expert | medium | non |
| `check-updates` | Vérifier les mises à jour Windows | both | low | non |

---

## 🚀 Installation & Démarrage

### Prérequis

- **Node.js** 20+ et **npm**
- **Windows 10/11** (requis pour exécuter les commandes système)
- Droits **Administrateur** recommandés (obligatoires pour certaines commandes)

### 1. Cloner le dépôt

```bash
git clone https://github.com/Rhukyum/FreshDesk.git
cd FreshDesk
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer en mode développement

```bash
npm run dev
```

L'application Electron s'ouvre avec le hot-reload actif (Vite).

---

## 📦 Build & Distribution

### Compiler l'application

```bash
npm run build
```

Génère les fichiers dans `out/` (processus main, preload et renderer).

### Créer l'installateur Windows

```bash
npx electron-builder
```

Génère un installateur NSIS dans `release/` :

- Installateur graphique (non one-click)
- Choix du dossier d'installation
- Raccourci bureau "FreshDesk"
- L'application demande les droits administrateur au lancement (`requireAdministrator`)

---

## 🛠️ Scripts disponibles

```bash
npm run dev      # Lance l'application en mode développement (Vite + Electron)
npm run build    # Compile TypeScript + bundle Vite pour les 3 processus
npm run preview  # Prévisualise le build sans Electron
npm run lint     # ESLint sur tout le dossier src/
```

---

## 🧪 Ajouter une nouvelle commande

1. Ouvrir le fichier de la catégorie correspondante dans `src/main/commands/`
2. Ajouter un objet `CommandDef` :

```typescript
{
  id: 'mon-id-unique',
  label: 'Label technique',
  description: 'Ce que fait cette commande exactement.',
  noobLabel: 'Label simplifié',
  noobDesc: 'Explication en langage courant.',
  category: 'maintenance',    // network | maintenance | performance | security | diagnostics | system
  risk: 'low',                // low | medium | high | critical
  mode: 'both',               // noob | expert | both
  adminRequired: false,
  hasRollback: false,
  execute: (onData, signal) => runCommand('ma commande windows', { onData, signal })
}
```

3. La commande apparaît automatiquement dans l'interface (mode Expert toujours, mode Noob si `mode: 'both'` ou `'noob'` et risque `low`/`medium`)

---

## 🎨 Stack technique

| Composant | Technologie |
|-----------|-------------|
| Application desktop | Electron 31 |
| Framework UI | React 18 + TypeScript 5.5 |
| Bundler | Vite 5 via electron-vite |
| Styles | Tailwind CSS 3 |
| Animations | Framer Motion |
| State management | Zustand |
| Icônes | Lucide React |
| Logging | electron-log |
| Build/Distribution | electron-builder (NSIS) |

---

## 📎 Bonnes pratiques de contribution

Tu veux contribuer ? Super ! Voici les règles :

1. Forke ce dépôt
2. Crée une branche (`feature/ma-fonction`)
3. Ajoute ta commande dans le fichier de catégorie approprié
4. Respecte la structure `CommandDef` complète (tous les champs obligatoires)
5. Teste avec `npm run dev` avant de soumettre ta pull request

---

## 📅 Roadmap

- [x] Application Electron + React v2
- [x] Mode Noob / Expert
- [x] Stats système temps réel
- [x] Terminal intégré avec output streamé
- [x] Historique des logs
- [x] Build + installateur NSIS
- [ ] Thème sombre / clair personnalisable
- [ ] Système de mise à jour automatique (electron-updater)
- [ ] Export des logs (CSV, HTML)
- [ ] Profils de commandes (ensemble de corrections personnalisé)
- [ ] Support macOS / Linux (commandes adaptées)

---

## 📝 Licence

Distribué sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🔗 Liens utiles

- [Documentation Electron](https://www.electronjs.org/docs)
- [Documentation React](https://react.dev)
- [electron-vite](https://electron-vite.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
