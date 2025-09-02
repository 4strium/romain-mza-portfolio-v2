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
Le coeur même du projet repose sur une certaine modularité : on utilise des modules et des fichiers externes tels que `data.json` qui contient la carte et les références vers les éléments . En fin de compte il ne s'agit pas d'un jeu mais bien d'un moteur graphique. Cependant, vous devez sans doute avoir un reproche assez clair à faire vis-à-vis de mon projet : **La dépendance**. 

En effet, un utilisateur externe doit prendre beaucoup de précautions avant de pouvoir exécuter en toute sérénité un jeu réalisé par le logiciel. On constate plusieurs niveaux de prérequis sur lesquels reposent une grande partie du système. Le premier et sans doute le plus évident est celui du langage de programmation en lui-même, *difficile d'exécuter un programme Python, sans avoir d'instance Python installée sur sa machine...* mais ici c'est un problème mineur, car je désire rendre accessible à un plus grand nombre mon moteur graphique, et pas forcément aux mordus de code. Par ailleurs, pour les lecteurs ayant déjà manipulé des outils tels que *Unreal Engine* ou encore *Unity* vous acquiescerez sans doute sur le fait que les entreprises derrière ces outils cherchent à réduire au maximum les compétences requises en programmation textuelle, en proposant des systèmes par blocs par exemple.

![Le système Blueprint dans Unreal Engine|inline](https://mellaza.tech/img/ascii-engine/blueprint.png)

Le second niveau de dépendance repose sur les librairies adjacentes, qui sont indispensables au bon fonctionnement général du système, de l'affichage jusqu'à la gestion des combats. Enfin, le dernier niveau et sans doute le plus *pénible*, celui du terminal, en effet les terminaux Windows CMD/Powershell/UNIX/MacOS ne fonctionnent pas de la même manière, et je rappelle que nous utilisons les séquences d'échappement ANSI qui ne sont utilisables que sous certaines conditions.

# L'interface graphique
La première étape consiste à fournir une interface graphique claire et concise, on veut que l'utilisateur appuie sur des boutons, saisisse ses entrées dans des cases préconçues, et non pas qu'il bidouille dans le code principal. Ici mon choix s'est tourné vers la bibliothèque `PyQt`, mais j'ai par le passé utilisé `Tkinter` pour des interfaces graphiques (et je vous conseille cette librairie si votre projet est simple, avec une unique page statique comportant du texte et des boutons par exemple).

Je ne vais pas détailler les instructions utiles pour la confection d'une interface via `PyQt6` (je vous conseille d'ailleurs le livre que j'ai pris en main comme introduction : *Beginning PyQt, A Hands-on Approach to GUI Programming with PyQt6 — Second Edition — Joshua M Willman*).

Je vais tout de même passer en revue les différentes fenêtres du logiciel, que j'ai développée les unes après les autres.

## Le démarrage
Au démarrage, l'utilisateur se voit demander la langue d'affichage de l'interface, à l'heure actuelle le français et l'anglais sont disponibles mais avec la modularité du système linguistique, on peut tout à fait imaginer l'ajout de langues supplémentaires dans le futur.

![|inline](https://mellaza.tech/img/ascii-engine/starting.png)

Mais ce qui nous intéresse ici ce sont les deux boutons en dessous : appuyer sur *Nouveau Projet* ouvre une fenêtre modale qui permet à l'utilisateur de saisir les données requises à la création du fichier source `data.json`.

A l'inverse ouvrir un ancien projet permet à l’utilisateur de sélectionner le fichier de projet. Attention ce fichier est différent de `data.json`, car on doit aussi sauvegarder les représentations ASCII et dialogues des différents personnages/ennemis (qui sont écrits dans des fichiers textes à part). Mais alors comment faire pour sauvegarder tout ça en dur d'une session à l'autre ? Enfaîte vous ne savez peut-être pas mais beaucoup de logiciels que vous utilisez tous les jours utilisent des archives ZIP pour sauvegarder les différents fichiers à recharger d'une utilisation à l'autre. Il suffit juste de remplacer l'extension `.zip` par l'extension qu l'on désire et tada l'archive contenant tous les fichiers se cachent derrière une extension tout autre. 

J'ai fait l'expérience avec un fichier `.odt`, en le renommant avec l'extension `.zip` on voit se révéler tous les fichiers indispensables pour importer correctement un précédent projet.

<p align="center">
    <img src="https://mellaza.tech/img/ascii-engine/odt-reveal.png" width="50%" height="auto">
</p>

Et bien nous allons utiliser ce même principe ici, lorsque l'utilisateur veut sauvegarder son projet, le programme compresse dans un premier temps le dossier de travail dans un fichier zip avant de le renommer avec l'extension `.ansiflow`.

Et pour l'importation d'un ancien projet, vous avez sans doute compris que l'on décompresse la sauvegarde dans le dossier de manipulation et voilà, le logiciel travaille avec les mêmes données que la session enregistrée. (*Bon c'est un peu plus complexe que cela car il faut recharger l'ensemble des objets graphiques avec les propriétés sauvegardés et par conséquent sauvegardé la position et l'état de ces derniers*) 
