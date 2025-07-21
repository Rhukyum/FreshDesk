# 💡 FreshDesk - PowerShell pour la maintenance Windows

**FreshDesk** est une suite modulaire en PowerShell conçue pour diagnostiquer, réparer et optimiser un système Windows en quelques commandes. Pensée pour les administrateurs, techniciens et utilisateurs avancés.

---

![PowerShell](https://img.shields.io/badge/PowerShell-7+-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Windows-lightgrey.svg)
![CI](https://img.shields.io/github/actions/workflow/status/Rhukyum/FreshDesk/tests.yml?branch=main)
![License](https://img.shields.io/github/license/Rhukyum/FreshDesk)

---

## 🎯 Objectif du projet

FreshDesk vise à offrir un **outil de réparation intelligent** pour Windows, capable de :

- Identifier rapidement des dysfonctionnements (réseau, BSOD, performances)
- Exécuter automatiquement les bonnes corrections
- Logger chaque action de manière centralisée
- Fournir des outils de rollback sur les actions critiques
- Fournir une base modulaire facilement extensible

---

## 🧬 Fonctionnalités principales

### ⚙️ Moteur dynamique

- Chargement automatique de tous les scripts du dossier `/scripts`
- Exécution directe avec `-RunScript "nom"`
- Journalisation détaillée via `logger.psm1`

### 🧭 Interface CLI interactive

- Menu `menu.ps1` avec sélection numérotée
- Navigation par catégorie (à venir)
- Affichage des métadonnées des scripts (.SYNOPSIS, .DESCRIPTION)
- Retour menu / quitter / info / exécuter

### 📂 Organisation des scripts

- **Diagnostics** : vérifie les crashs, services, drivers
- **Network** : corrige les problèmes de connectivité
- **Maintenance** : nettoie, réinitialise, désactive
- **Performance** : accélère le démarrage, supprime les lenteurs
- **Security** : vérifie l’UAC, BitLocker, Defender
- **Undo** : rollback sur les scripts critiques

### ✅ Validation et qualité

- Tous les scripts doivent respecter un template strict :
  - `.SYNOPSIS`, `.DESCRIPTION`, `.AUTHOR`, `.REQUIRES`, `.DEPENDENCIES`, `.RESTART`
- Validation automatique (`validate-all.ps1` + `validator-strict.ps1`)
- Tests automatisés :
  - Unitaire : syntaxe, métadonnées, duplications
  - Intégration : exécution réelle, logs, erreurs simulées

### 📈 Logs & rapports

- `execution-log.csv` : log d'exécution brut (script, date, succès)
- `errors.log` : erreurs critiques
- `execution-summary.html` : rapport interactif

---

## 🧱 Arborescence du projet

```
FreshDesk/
├── engine/               # Moteur principal (engine.ps1)
├── cli/                  # Menu interactif CLI
├── scripts/              # Tous les scripts classés par thème
├── modules/              # Logger, autoload
├── validator/            # Validateurs stricts
├── tests/                # Unitaires + intégration + rollback
├── logs/                 # Logs et rapports
├── settings.json         # Paramètres du moteur
├── CHANGELOG.md          # Historique manuel
├── LICENSE               # Licence MIT
└── README.md             # Ce fichier
```

---

## 🚀 Démarrage rapide

### 1. Cloner le dépôt

```bash
git clone https://github.com/Rhukyum/FreshDesk.git
cd FreshDesk
```

### 2. Lancer le moteur

```powershell
.\engine\engine.ps1
```

### 3. Lancer un script directement

```powershell
.\engine\engine.ps1 -RunScript "reset-network"
```

### 4. Menu interactif CLI

```powershell
.\cli\menu.ps1
```

---

## 🧪 Tests automatisés

### Lancer tous les scripts (test d’intégration)

```powershell
.	ests\integration	est-run-all-scripts.ps1
```

### Tester la validité des scripts de rollback

```powershell
.	ests\integration	est-undo-validity.ps1
```

### Vérifier la structure des logs HTML

```powershell
.	ests\integration	est-log-html-refresh.ps1
```

---

## ✅ Validation qualité

```powershell
.alidatoralidator-strict.ps1
```

Ce script vérifie que tous les scripts PowerShell possèdent :

- .SYNOPSIS
- .DESCRIPTION
- .AUTHOR
- .REQUIRES
- .DEPENDENCIES
- .RESTART

---

## 📎 Bonnes pratiques de contribution

Tu veux contribuer ? Super 🎉 Voici les règles :

1. Forke ce dépôt
2. Crée une branche (`feature/ma-fonction`)
3. Utilise le générateur `tools/new-script.ps1` si disponible
4. Respecte la structure des métadonnées
5. Teste avec `validate-all.ps1` avant pull request

---

## 📅 Roadmap

- [x] CLI interactive
- [x] Logger centralisé
- [x] Tests automatisés
- [ ] Interface graphique (WinForms ou PS2EXE)
- [ ] Système de mise à jour automatique
- [ ] Catégorisation dynamique
- [ ] Génération automatique de documentation

---

## 📝 Licence

Distribué sous licence MIT.

---

## 🔗 Liens utiles

- [PowerShell Documentation](https://learn.microsoft.com/powershell/)
- [Markdown Cheatsheet](https://www.markdownguide.org/cheat-sheet/)
