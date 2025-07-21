# FreshDesk

**FreshDesk** est une application PowerShell modulaire pour la maintenance, le diagnostic et la réparation de systèmes Windows.

![PowerShell](https://img.shields.io/badge/PowerShell-7+-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Windows-lightgrey.svg)
![CI](https://img.shields.io/github/actions/workflow/status/<your-username>/FreshDesk/tests.yml?branch=main)
![License](https://img.shields.io/github/license/<your-username>/FreshDesk)

---

## 🚀 Fonctionnalités principales

- 🎯 Exécution dynamique des scripts via CLI ou ligne de commande
- 📋 Menu interactif avec sélection de script, affichage `.SYNOPSIS`
- 🧩 Scripts organisés par catégories : `diagnostics`, `network`, `maintenance`, `performance`, `security`, etc.
- ✅ Validation automatique des métadonnées de chaque script
- 🧪 Tests unitaires et d’intégration
- 📊 Rapport HTML/CSV des exécutions
- 🗂️ Support des rollbacks (`scripts/undo/`)
- 📦 Prêt pour CI/CD GitHub (tests, validation)

---

## 🧱 Structure du projet

```
.
├── engine/                 # Moteur principal
├── cli/                   # Menu CLI interactif
├── modules/               # Logger, autoload
├── scripts/               # Scripts organisés par thème
├── tests/                 # Unit & integration tests
├── validator/             # Scripts de validation
├── logs/                  # Fichiers log & HTML
├── settings.json          # Configuration centrale
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## 💻 Installation

1. **Cloner le dépôt :**

```bash
git clone https://github.com/<your-username>/FreshDesk.git
cd FreshDesk
```

2. **Lancer le moteur :**

```powershell
.\engine\engine.ps1
```

3. **Ou exécuter un script spécifique :**

```powershell
.\engine\engine.ps1 -RunScript "flush-dns"
```

---

## 📋 Menu interactif

```powershell
.\cli\menu.ps1
```

- `[i]` : voir la description d’un script
- `[q]` : quitter
- `[1,2,...]` : lancer un script

---

## ✅ Validation des scripts

```powershell
.alidatoralidator-strict.ps1
```

Valide que chaque script contient :
`.SYNOPSIS`, `.DESCRIPTION`, `.AUTHOR`, `.REQUIRES`, `.DEPENDENCIES`, `.RESTART`

---

## 🧪 Lancer les tests

- Tous les tests :

```powershell
.	ests\integration	est-run-all-scripts.ps1
```

- Test rollback :

```powershell
.	ests\integration	est-undo-validity.ps1
```

---

## 📈 Logs et rapports

- CSV : `logs/execution-log.csv`
- HTML : `logs/execution-summary.html`

---

## 🛠️ Contribuer

1. Forker ce dépôt
2. Créer une branche : `feature/ma-fonction`
3. Ajouter/modifier les scripts avec les métadonnées complètes
4. Faire un `Pull Request`

---

## 📝 License

Distribué sous licence MIT.

---

## 📎 À venir

- Interface graphique (WinForms / PS2EXE)
- Système de mise à jour automatique
- Documentation HTML interactive
