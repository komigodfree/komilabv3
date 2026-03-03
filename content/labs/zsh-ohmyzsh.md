---
title: "Installation de Zsh & Oh My Zsh — Interface console style Kali Linux"
date: 2026-02-22
description: "Installation et configuration de Zsh combiné à Oh My Zsh pour obtenir une interface console avancée style Kali Linux. Prompt coloré avec utilisateur, machine hôte et répertoire courant. Valable pour Ubuntu 22.04+, Debian 11+ et Kali Linux."
category: "linux"
level: "Lab"
environment: "KOMI.LAB"
duration: "5 min"
tags: ["Zsh", "Oh My Zsh", "Linux", "Shell", "Ubuntu", "Debian", "Terminal"]
draft: false
---

## Objectif

Ce mode opératoire décrit l'installation et la configuration de Zsh combiné au framework Oh My Zsh afin d'obtenir une interface console avancée similaire à celle de Kali Linux. Le prompt affiche l'utilisateur, la machine hôte et le répertoire courant sous forme arborescente avec une coloration syntaxique claire et lisible.

## Prérequis

| Prérequis | Commande de vérification |
|-----------|--------------------------|
| Accès sudo ou root | `sudo -v` |
| Connexion Internet active | `ping -c 2 google.com` |
| curl installé | `curl --version` |
| git installé (recommandé) | `git --version` |

> **Note** — Si curl ou git ne sont pas présents, les installer via :
> ```bash
> sudo apt install curl git -y
> ```

## Installation pour un utilisateur standard

### 3.1 Installation de Zsh

Mettre à jour les dépôts APT et installer le shell Zsh :
```bash
sudo apt update && sudo apt install zsh -y
```

Vérifier que l'installation s'est correctement effectuée :
```bash
zsh --version
```

Résultat attendu : `zsh 5.x.x (x86_64-ubuntu-linux-gnu)`

### 3.2 Installation de Oh My Zsh

Télécharger et exécuter le script d'installation officiel :
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Le script installe Oh My Zsh dans le répertoire `~/.oh-my-zsh` et génère un fichier `~/.zshrc` de base. À la fin, il propose de définir Zsh comme shell par défaut : répondre **Y**.

> ⚠️ **Attention** — Si la question n'est pas posée automatiquement, définir le shell manuellement à l'étape suivante.

### 3.3 Définir Zsh comme shell par défaut
```bash
chsh -s $(which zsh)
```

La modification prend effet à la prochaine ouverture de session ou reconnexion SSH.

### 3.4 Configuration du prompt style Kali Linux

Ouvrir le fichier de configuration Zsh :
```bash
nano ~/.zshrc
```

Localiser la ligne `ZSH_THEME` et la vider comme suit :
```bash
ZSH_THEME=""
```

Ajouter les lignes suivantes à la fin du fichier :
```bash
PROMPT='%F{blue}┌──(%F{cyan}%n㉿%m%F{blue})-[%F{white}%~%F{blue}]%f └─%F{cyan}$%f '
```

> **Navigation Nano** — `Ctrl+O` pour sauvegarder · `Entrée` pour confirmer · `Ctrl+X` pour quitter

Appliquer les changements sans redémarrer la session :
```bash
source ~/.zshrc
```

Résultat attendu :
```
┌──(user㉿hostname)-[~]
└─$
```

## Installation pour l'utilisateur root

> ⚠️ **Sécurité** — Par convention Unix, le prompt root utilise la couleur rouge et le caractère `#` afin d'identifier immédiatement une session à hauts privilèges. Cette distinction visuelle est une bonne pratique de sécurité.

### 4.1 Passer en root
```bash
sudo -i
```

### 4.2 Installer Oh My Zsh pour root
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### 4.3 Configurer le prompt root

Éditer le fichier de configuration de root :
```bash
nano /root/.zshrc
```

Vider la variable `ZSH_THEME` :
```bash
ZSH_THEME=""
```

Ajouter à la fin du fichier (couleur rouge, symbole `#` pour root) :
```bash
PROMPT='%F{blue}┌──(%F{red}%n㉿%m%F{blue})-[%F{white}%~%F{blue}]%f └─%F{red}#%f '
```

Appliquer la configuration :
```bash
source /root/.zshrc
```

Résultat attendu :
```
┌──(root㉿hostname)-[~]
└─#
```
(affiché en rouge)

## Récapitulatif des fichiers modifiés

| Fichier | Portée | Modification |
|---------|--------|--------------|
| `~/.zshrc` | Utilisateur courant | ZSH_THEME + PROMPT Kali |
| `/root/.zshrc` | Utilisateur root | ZSH_THEME + PROMPT rouge (#) |
| `/etc/shells` | Système | Mis à jour automatiquement par chsh |

## Dépannage

| Problème constaté | Solution |
|-------------------|----------|
| Le prompt ne change pas après `source ~/.zshrc` | Fermer et rouvrir le terminal, ou se déconnecter/reconnecter la session SSH |
| Erreur : `chsh: PAM authentication failed` | Utiliser : `sudo chsh -s $(which zsh) <username>` |
| Caractères spéciaux mal affichés (㉿, └─, ┌──) | Configurer le terminal avec une police compatible : JetBrains Mono, MesloLGS NF ou Fira Code |
| Oh My Zsh ralentit le démarrage du shell | Commenter les plugins inutilisés dans `~/.zshrc`, ligne : `plugins=(...)` |