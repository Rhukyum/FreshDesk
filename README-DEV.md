# 🛠️ FreshDesk — Documentation Développeur

Ce document couvre l'architecture, le code, le développement local, les builds et la contribution au projet.

> Pour l'installation et l'utilisation en tant qu'utilisateur final, voir [README.md](README.md).

---

![Electron](https://img.shields.io/badge/Electron-31-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Windows-lightgrey.svg)

---

## 🧬 Stack technique

| Couche | Technologie |
|--------|-------------|
| Application desktop | Electron 31 |
| Framework UI | React 18 + TypeScript 5.5 |
| Bundler | Vite 5 via electron-vite |
| Styles | Tailwind CSS 3 |
| Animations | Framer Motion |
| State management | Zustand |
| Icônes | Lucide React |
| Logging | electron-log |
| Auto-update | electron-updater |
| Build/Distribution | electron-builder (NSIS) |

---

## 🧱 Architecture du projet

```
FreshDesk/
├── src/
│   ├── main/                        # Processus principal Electron (Node.js)
│   │   ├── index.ts                 # Point d'entrée : fenêtre, IPC window, auto-updater
│   │   ├── ipc-handlers.ts          # Tous les handlers IPC (commandes, stats, logs, export)
│   │   ├── commands/
│   │   │   ├── types.ts             # Types TypeScript (CommandDef, Risk, Mode, Category)
│   │   │   ├── index.ts             # Agrégation + helpers (getCommandById, getNoobCommands…)
│   │   │   ├── network.ts           # Commandes réseau
│   │   │   ├── maintenance.ts       # Commandes de nettoyage
│   │   │   ├── performance.ts       # Commandes de performances
│   │   │   ├── security.ts          # Commandes de sécurité
│   │   │   ├── diagnostics.ts       # Commandes de diagnostics
│   │   │   └── system.ts            # Commandes système
│   │   └── utils/
│   │       ├── executor.ts          # runCommand() + runPowerShell()
│   │       ├── logger.ts            # Logger centralisé (electron-log + in-memory)
│   │       ├── admin.ts             # isAdmin() + getSystemInfo()
│   │       └── settings.ts          # loadSettings() + saveSettings() (mode persistence)
│   ├── preload/
│   │   └── index.ts                 # contextBridge : expose window.api au renderer
│   └── renderer/
│       └── src/
│           ├── App.tsx              # Racine React : routing Noob/Expert, IPC listeners
│           ├── store/
│           │   └── app.store.ts     # Store Zustand global
│           ├── components/
│           │   ├── layout/
│           │   │   ├── TopBar.tsx   # Titre, switch mode, badge Admin, contrôles fenêtre
│           │   │   └── StatusBar.tsx # Stats CPU/RAM/Disk/Uptime en temps réel
│           │   ├── noob/
│           │   │   ├── NoobView.tsx        # Écran d'accueil + grille catégories
│           │   │   ├── CategoryCard.tsx    # Carte cliquable par catégorie
│           │   │   ├── NoobCommandList.tsx # Liste commandes d'une catégorie
│           │   │   ├── NoobProgressView.tsx # Vue de progression pendant exécution
│           │   │   └── ConfirmDialog.tsx   # Modale de confirmation
│           │   ├── expert/
│           │   │   ├── ExpertView.tsx   # Layout : sidebar + tableau + terminal
│           │   │   ├── Sidebar.tsx      # Filtres catégories + recherche
│           │   │   ├── CommandTable.tsx # Tableau de toutes les commandes
│           │   │   ├── OutputPanel.tsx  # Terminal temps réel
│           │   │   └── LogViewer.tsx    # Historique + export CSV
│           │   └── shared/
│           │       └── RiskBadge.tsx    # Badge coloré de niveau de risque
│           └── styles/
│               └── globals.css         # Styles Tailwind + variables thèmes noob/expert
├── electron.vite.config.ts      # Config Vite (main/preload/renderer)
├── electron-builder.json        # Config build : NSIS, icône, GitHub publish
├── tailwind.config.js
└── package.json
```

---

## 🔄 Flux de communication Electron (IPC)

```
Renderer (React) ──► Preload (contextBridge) ──► Main (Node.js)
    window.api                                    ipc-handlers.ts
```

1. Le **Renderer** appelle `window.api.runCommand(id)` (exposé par `preload/index.ts`)
2. Le **Preload** transfère via `ipcRenderer.invoke('commands:run', id)`
3. Le **Main** reçoit, vérifie les droits admin, exécute la commande
4. La sortie est streamée ligne par ligne vers le renderer via `webContents.send('output:data', ...)`
5. Le renderer reçoit chaque ligne via `window.api.onOutputData(cb)`

### Channels IPC disponibles

| Channel | Direction | Description |
|---------|-----------|-------------|
| `commands:get-all` | invoke | Retourne toutes les commandes (meta) |
| `commands:get-noob` | invoke | Retourne les commandes mode noob |
| `commands:get-fix-all` | invoke | Retourne la liste "Fix Everything" |
| `commands:run` | invoke | Exécute une commande par ID |
| `commands:run-all` | invoke | Exécute une liste de commandes en séquence |
| `commands:stop` | send | Annule la commande en cours |
| `system:get-stats` | invoke | Retourne CPU/RAM/Disk/Uptime |
| `system:admin-info` | invoke | Retourne username/hostname/OS/isAdmin |
| `logs:get` | invoke | Retourne les N derniers logs |
| `logs:export-csv` | invoke | Ouvre un dialog, écrit un CSV sur le bureau |
| `settings:get` | invoke | Charge les préférences (mode) |
| `settings:set` | invoke | Sauvegarde les préférences |
| `output:data` | main→renderer | Ligne de sortie de commande |
| `output:done` | main→renderer | Fin d'exécution (succès/échec) |
| `output:progress` | main→renderer | Progression (run-all) |
| `window:minimize` | send | Minimise la fenêtre |
| `window:maximize` | send | Maximise / restaure la fenêtre |
| `window:close` | send | Ferme la fenêtre |

---

## ⚙️ Moteur d'exécution (`executor.ts`)

```typescript
runCommand(cmd: string, opts: ExecutorOptions): Promise<ExecutorResult>
runPowerShell(script: string, opts: ExecutorOptions): Promise<ExecutorResult>
```

- Spawn `cmd.exe /c <commande>` (ou wrappé dans `powershell.exe -Command "..."`)
- Lecture ligne par ligne via `readline` sur stdout/stderr
- **Timeout** configurable (défaut 120s), **annulation** via `AbortSignal`
- Résultat : `{ exitCode, duration, success }` (success = exitCode === 0)
- Log automatique dans `electron-log`

---

## 📋 Modèle d'une commande (`CommandDef`)

```typescript
export interface CommandDef {
  id: string              // identifiant unique, ex: 'flush-dns'
  label: string           // label en mode Expert
  description: string     // description technique complète
  noobLabel: string       // label simplifié (mode Noob)
  noobDesc: string        // description simplifiée (mode Noob)
  category: Category      // 'network' | 'maintenance' | 'performance' | 'security' | 'diagnostics' | 'system'
  risk: Risk              // 'low' | 'medium' | 'high' | 'critical'
  mode: Mode              // 'noob' | 'expert' | 'both'
  adminRequired: boolean
  hasRollback: boolean
  execute: (
    onData: (line: string, type: 'stdout' | 'stderr') => void,
    signal?: AbortSignal
  ) => Promise<{ exitCode: number; duration: number; success: boolean }>
}
```

---

## 🗄️ Store global Zustand (`app.store.ts`)

| État | Type | Description |
|------|------|-------------|
| `mode` | `'noob' \| 'expert'` | Mode d'interface actif |
| `commands` | `CommandMeta[]` | Liste de toutes les commandes (sans `execute`) |
| `activeCategory` | `Category` | Filtre de catégorie (mode Expert) |
| `searchQuery` | `string` | Recherche de commandes |
| `isRunning` | `boolean` | Commande en cours d'exécution |
| `currentCommandId` | `string \| null` | ID de la commande en cours |
| `output` | `OutputLine[]` | Buffer terminal (500 lignes max) |
| `progress` | `ProgressInfo \| null` | Progression du run-all |
| `adminInfo` | `AdminInfo \| null` | Infos système (username, isAdmin…) |
| `systemStats` | `SystemStats \| null` | CPU/RAM/Disk/Uptime |
| `logs` | `LogEntry[]` | Historique des exécutions |
| `lastSuccess` | `boolean \| null` | Résultat de la dernière commande |

---

## 🚀 Démarrage en développement

### Prérequis

- **Node.js** 20+
- **Windows 10/11** (obligatoire — les commandes sont Windows-only)
- Droits administrateur recommandés

### Installation

```bash
git clone https://github.com/Rhukyum/FreshDesk.git
cd FreshDesk
npm install
```

### Lancer en mode dev

```bash
npm run dev
```

Hot-reload actif sur le renderer (Vite). Les modifications du main nécessitent un redémarrage.

---

## 📦 Build & Distribution

### Compiler

```bash
npm run build
```

Génère les fichiers compilés dans `out/`.

### Créer l'installateur Windows (.exe)

```bash
npx electron-builder
```

Produit un installateur NSIS dans `release/` :
- Installation graphique avec choix du dossier
- Raccourci bureau "FreshDesk"
- Désinstallation propre via Paramètres Windows
- Demande les droits admin au lancement (`requireAdministrator`)

### Scripts npm

```bash
npm run dev      # Dev avec hot-reload
npm run build    # Compile (main + preload + renderer)
npm run preview  # Preview du build
npm run lint     # ESLint
```

---

## 🔁 Système de mise à jour automatique

Utilise **electron-updater** avec GitHub Releases comme provider.

- En production, `autoUpdater.checkForUpdatesAndNotify()` est appelé au démarrage
- Si une nouvelle version est détectée sur GitHub Releases, l'utilisateur reçoit une notification système et le téléchargement se fait en arrière-plan
- L'installation se fait au prochain redémarrage de l'application

**Pour publier une release :**
1. Incrémenter `version` dans `package.json`
2. `npx electron-builder --publish always` (nécessite `GH_TOKEN` en variable d'environnement)

---

## ➕ Ajouter une nouvelle commande

1. Ouvrir le fichier de catégorie dans `src/main/commands/`
2. Ajouter un objet `CommandDef` :

```typescript
{
  id: 'mon-id-unique',
  label: 'Label technique',
  description: 'Ce que fait la commande exactement.',
  noobLabel: 'Label simplifié',          // laisser '' si mode: 'expert' seulement
  noobDesc: 'Explication en clair.',     // laisser '' si mode: 'expert' seulement
  category: 'maintenance',
  risk: 'low',                           // low | medium | high | critical
  mode: 'both',                          // noob | expert | both
  adminRequired: false,
  hasRollback: false,
  execute: (onData, signal) => runCommand('ma commande', { onData, signal })
}
```

3. La commande apparaît automatiquement dans l'interface :
   - Mode Expert : toujours visible
   - Mode Noob : uniquement si `mode: 'both'` ou `'noob'` ET risque `low` ou `medium`

---

## 🎨 Système de thèmes

Le CSS utilise deux ensembles de variables Tailwind custom dans `tailwind.config.js` :

- **Noob** : fond blanc, couleurs bleues (`noob-primary`, `noob-text`, `noob-border`…)
- **Expert** : fond sombre (`expert-bg`, `expert-surface`, `expert-accent`…)

Le mode est stocké comme classe CSS sur l'élément racine (`noob-mode` / `expert-mode`) et comme état dans le store Zustand.

---

## 📎 Contribution

1. Fork le dépôt
2. Crée une branche (`feature/ma-fonction`)
3. Ajoute ta commande ou ta fonctionnalité
4. Lance `npm run lint` pour vérifier la syntaxe
5. Ouvre une Pull Request

---

## Nouveautés v2.0.0

- Logo FreshDesk personnalisé (SVG, composant React `FreshDeskLogo`)
- Correction du badge Admin qui chevauchait les boutons de fenêtre (suppression du `titleBarOverlay` natif)
- Boutons de fenêtre (min/max/close) redessinés avec hover coloré
- Avertissement affiché lors du passage en mode Expert
- Correction du compteur d'actions par catégorie (bug : affichait le total au lieu du compte par catégorie)
- Mode Expert : bouton **"Tout lancer"** avec sélection multiple (cocher/décocher chaque commande)
- Mode Expert : panneau Terminal/Logs réductible via bouton de collapse
- Version 2.0.0

## Icône de l'application

Le logo source est disponible en SVG dans `resources/icon.svg` et `src/renderer/src/assets/logo.svg`.

Pour générer le fichier `resources/icon.ico` requis pour le build Windows :
```bash
# Via ImageMagick :
magick resources/icon.svg -resize 256x256 resources/icon.ico

# Ou via un outil en ligne (ICO Convert, etc.)
```

## Roadmap

- [x] Application Electron + React v2
- [x] Mode Simple / Expert
- [x] Logo et identité visuelle FreshDesk
- [x] Stats système temps réel
- [x] Terminal intégré avec output streamé
- [x] Historique des logs
- [x] Export des logs en CSV
- [x] Système de mise à jour automatique (electron-updater)
- [x] Persistance de la préférence de mode
- [x] Build + installateur NSIS
- [x] Bouton "Tout lancer" avec sélection multiple (mode Expert)
- [x] Panneau terminal réductible (mode Expert)
- [x] Avertissement mode Expert
- [ ] Profils de commandes personnalisés
- [ ] Support macOS / Linux (commandes adaptées)
