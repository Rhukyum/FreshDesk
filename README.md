# 💡 FreshDesk — Répare et optimise ton PC Windows

**FreshDesk** est une application gratuite pour Windows qui répare et optimise ton PC en quelques clics. Pas besoin d'être informaticien.

---

![Platform](https://img.shields.io/badge/Windows-10%2F11-blue.svg)
![Version](https://img.shields.io/badge/Version-2.0.0-green.svg)
![License](https://img.shields.io/github/license/Rhukyum/FreshDesk)

---

## 📥 Installation

### 1. Télécharger l'installateur

Rends-toi sur la page [**Releases**](https://github.com/Rhukyum/FreshDesk/releases/latest) et télécharge le fichier `FreshDesk-Setup.exe`.

### 2. Lancer l'installateur

Double-clique sur `FreshDesk-Setup.exe` et suis les étapes de l'assistant d'installation.

> Windows peut afficher un avertissement "Cette application est inconnue". Clique sur **Plus d'infos** puis **Exécuter quand même**.

### 3. C'est prêt !

FreshDesk se lance depuis ton bureau ou le menu Démarrer. L'application se met à jour automatiquement dès qu'une nouvelle version est disponible.

---

## 🖥️ Comment ça marche

FreshDesk propose deux interfaces selon ton niveau :

### 👶 Mode Simple (par défaut)

- Un bouton **"Réparer et optimiser mon PC"** qui lance 6 corrections en un clic
- Des catégories claires : Réseau, Maintenance, Performances, Sécurité, Diagnostics, Système
- Les actions sont expliquées en langage courant ("Réparer Internet", "Libérer de l'espace"...)
- Confirmation avant chaque action, progression animée en temps réel

### 🧑‍💻 Mode Expert

Accessible depuis le bouton en haut à droite. Ce mode donne accès à toutes les commandes avec leur sortie terminal en direct, leur niveau de risque et leurs détails techniques.

---

## 🔧 Ce que FreshDesk peut faire

| Catégorie | Exemples d'actions |
|-----------|-------------------|
| 🌐 Réseau | Vider le cache DNS, renouveler l'adresse IP, réinitialiser le proxy |
| 🔧 Maintenance | Nettoyer les fichiers temporaires, réparer l'imprimante, reset du Store Windows |
| ⚡ Performances | Voir ce qui ralentit le PC, activer le démarrage rapide |
| 🔒 Sécurité | Vérifier l'antivirus, scanner les virus, contrôler l'UAC |
| 🩺 Diagnostics | Voir les crashs récents (BSOD), analyser les erreurs système, infos PC |
| 🖥️ Système | Réparer les icônes, reset de la barre des tâches, mises à jour Windows |

---

## ❓ Questions fréquentes

**Pourquoi Windows dit "application inconnue" ?**
C'est normal pour les applications qui ne sont pas signées numériquement. FreshDesk est open-source et sans malware.

**Faut-il lancer FreshDesk en administrateur ?**
L'application le fait automatiquement au démarrage. Certaines commandes nécessitent des droits admin (un badge vert "Admin" apparaît en haut à droite quand c'est le cas).

**Est-ce que FreshDesk peut casser mon PC ?**
Toutes les actions affichent leur niveau de risque (faible / moyen / élevé / critique). Les actions critiques sont réservées au mode Expert.

**Mes préférences sont-elles sauvegardées ?**
Oui. FreshDesk mémorise ton mode (Simple ou Expert) entre les sessions.

---

## 📝 Licence

FreshDesk est distribué sous licence **MIT** — gratuit, open-source, pour toujours.

Voir le fichier [LICENSE](LICENSE) pour les détails.

---

> Pour les développeurs qui veulent contribuer ou comprendre l'architecture du projet, voir le [README développeur](README-DEV.md).
