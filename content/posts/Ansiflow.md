---
title: "Déployer mon moteur graphique"
date: 2025-09-02T01:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://mellaza.tech/img/ascii-engine/pres1.gif'
tags: ["Python", "Linux", "Software"]
theme: "light"
---

## Contexte
Avant toute chose, je vous conseille de lire attentivement l'article précédent pour comprendre l'essence du projet : [https://mellaza.tech/posts/ascii-3d-gameengine/](https://mellaza.tech/posts/ascii-3d-gameengine/).

# Introduction
Bon maintenant que nous sommes au clair sur le sujet abordé, vous devez sans doute avoir un reproche assez clair à faire vis-à-vis de mon projet : **La dépendance**. En effet, un utilisateur externe doit prendre beaucoup de précautions avant de pouvoir exécuter en toute sérénité le jeu que je propose. On constate plusieurs niveaux de prérequis sur lesquels reposent une grande partie du système. Le premier et sans doute le plus évident est celui du langage de programmation en lui-même, *difficile d'exécuter un programme Python, sans avoir d'instance Python installée sur sa machine...* mais ici c'est un problème mineur, car je désire rendre accessible à un plus grand nombre mon moteur graphique, et pas forcément aux mordus de code. Par ailleurs, pour les lecteurs ayant déjà manipulé des outils tels que *Unreal Engine* ou encore *Unity* vous acquiescerez sans doute sur le fait que les entreprises derrière ces outils cherchent à réduire au maximum les compétences requises en programmation textuelle, en proposant des systèmes pas blocs par exemple.

![Le système Blueprint dans Unreal Engine|inline](static\img\ascii-engine\blueprint.png)
