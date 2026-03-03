---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: "Description courte du lab (2-3 lignes pour le catalogue)."
category: "infrastructure"
level: "Lab"
environment: "KOMI.LAB"
duration: "1h"
tags: ["Tag1", "Tag2", "Tag3"]
draft: false
---

## Contexte & Problématique

Décris ici le contexte du lab...

## Architecture cible
```
Topologie ASCII ici
```

## Prérequis

| Composant | Version | Rôle |
|-----------|---------|------|
| Proxmox VE | 8.x | Hyperviseur |

## Étapes de déploiement

### 1. Première étape
```bash
# Commandes ici
```

### 2. Deuxième étape
```bash
# Commandes ici
```

## Points critiques & Erreurs rencontrées

> ⚠️ **Point d'attention** — Description du problème et solution.

## Résultats & Métriques

- Résultat 1
- Résultat 2

## Recommandations production

- Recommandation 1
- Recommandation 2

## Références

- [Titre](URL) — Description