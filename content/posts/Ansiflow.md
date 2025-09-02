---
title: "Déployer mon moteur graphique"
date: 2025-09-02T01:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://mellaza.tech/img/ascii-engine/main-layout.png'
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

![Un fichier odt basique disséqué|inline](https://mellaza.tech/img/ascii-engine/odt-reveal.png)

Et bien nous allons utiliser ce même principe ici, lorsque l'utilisateur veut sauvegarder son projet, le programme compresse dans un premier temps le dossier de travail dans un fichier zip avant de le renommer avec l'extension `.ansiflow`.

Et pour l'importation d'un ancien projet, vous avez sans doute compris que l'on décompresse la sauvegarde dans le dossier de manipulation et voilà, le logiciel travaille avec les mêmes données que la session enregistrée. (*Bon c'est un peu plus complexe que cela car il faut recharger l'ensemble des objets graphiques avec les propriétés sauvegardés, et par conséquent sauvegarder la position et l'état de ces derniers au préalable*) 

## La page principale
Voici la page principale, une fois que la configuration initiale est passée :

![|inline](https://mellaza.tech/img/ascii-engine/main-layout.png)

Vous constaterez dans un premier temps la barre des menus disponible en haut, c'est un membre typique des applications pour ordinateur. Ensuite, en-dessous, il s'agit d'une grille représentant la carte du jeu. Les cases peuvent prendre différentes couleurs en fonction de lors contenu :
* Mur
* Spawn joueur
* Position ennemi
* Position personnage
* Sortie du labyrinthe

Lorsque l'utilisateur veut définir l'emplacement d'un élément, il peut cliquer directement sur la carte.

Enfin, sur la droite vous avez en quelque sorte *la boîte à outils* avec les différentes sections utiles à la conception du jeu. Chaque section dispose de ces propres attributs et explications. 

## Les dialogues des personnages
Je vais juste me concentrer sur la page de gestion des dialogues car elle est à mon gout très intéressante, et le résultat final correspond bien à ce que je souhaitais obtenir : un système de programmation par blocs.

![|inline](https://mellaza.tech/img/ascii-engine/dialogue.png)

J'ai totalement recodé un tel système pour qu'il fonctionne avec PyQt6, l’utilisateur saisi des blocs dans la zone à droite et il les déposent dans la zone à gauche pour former une suite d'actions. La partie la plus complexe reside sans aucun doute dans la capacité qu'on chaque bloc à connaître leur emplacement par rapport aux autres blocs, cela paraît logique pour nous, mais d'un point de vue informatique c'est assez compliqué de faire comprendre à un bloc que sa première entrée et reliée avec la troisième sortie de tel bloc par exemple.

Enfin chaque bloc dispose de boutons et/ou d'entrées, il doit donc stocker en son sein ses propriétés, à titre informatif, voici le constructeur de mon objet `Bloc` :
```python
class Bloc(QWidget) :
  def __init__(self, main_app, nb_inputs, nb_outputs, content, bloc_color, text_color, id=-1, unicity = False):
    super().__init__()
    self.mainApp = main_app
    self.nb_inputs = nb_inputs
    self.nb_outputs = nb_outputs

    self.used_inputs = [None] * self.nb_inputs
    self.used_outputs = [None] * self.nb_outputs
      
    self.content = content
    self.bloc_color = QColor(bloc_color)
    self.text_color = text_color
    self.id = id
    self.min_width = MIN_WIDTH
    self.width_value = max(self.min_width*self.nb_inputs, self.min_width*self.nb_outputs)
    self.min_height = MIN_HEIGHT
    self.content_padding = 10
    self.content_size = 14
    self.visible = True
    self.unique = unicity
    self.parent_pos = None
    self.new_pos = None
    self.already_moved = False
    self.dragging = False
    self.dragging_position = QPoint()
    
    self.storage = [None, 1, None, None]

    self.initializeUI()
```

Et maintenant rappelez-vous que l'on donne à l'utilisateur la possibilité de sauvegarder sa session en l'état ! Il faut donc replacer chaque bloc au bon endroit avec les bons parents/enfants et les bonnes données dans son stockage. Et pour pimenter un peu le tout, les positions peuvent différer si l'utilisateur utilise un pc avec une taille d'écran différente...

# L'idée d'un émulateur de terminal
Pour revenir sur une des réflexions menées plus haut : comment standardiser l'affichage dans différents terminaux ? Bon c'est une question complexe qui n'a malheureusement pas de réponse simple. Dites-vous que même les librairies Python différent en fonction de votre système d'exploitation, par exemple la librairie `curses` que utilisable à la place des séquences d'échappement ANSI dispose d'une version UNIX et d'une version Windows ! Un même code Python utilisant cette librairie s'exécute différemment sur Linux et Windows. On est donc très loin de la standardisation. 

Mais voilà un jour une idée a germée dans ma tête : plutôt que de s'acharner à trouver une solution commune à tous les types de terminaux, pourquoi ne pas utiliser de terminal tout simplement ! Bon là vous vous demandez ce que je raconte mais enfaîte mon moteur se contente juste d'afficher des caractères à une position x et y avec une certaine couleur, rien de plus au niveau de l'affichage. Alors pourquoi s’embêter à utiliser un terminal machine ? Pourquoi ne pas ouvrir une fenêtre d'interface graphique, mettre un fond noir, définir un axe x et un axe y similaire aux terminaux classiques et voilà. 

Bon pour atteindre ce résultat, j'ai beaucoup cherché et la solution la plus simple consiste à créer une fenêtre PyQt avec un fond noir, attribuer une zone texte HTML prenant tout l'espace de la fenêtre et afficher des caractères colonne par colonne, ligne par ligne, à partir de notre buffer. Tous les caractères utilisent la même police et la même taille, mais on peut faire varier leur couleur via un unique attribut `text-color`. Voilà cela fonctionne à la fin mais gros problème : **C'EST LENT, TRÈS LENT**, sans aucun temps d'attente le système à un temps de rafraîchissent proche de 1FPS, contre 10FPS pour la solution initiale. Le rechargement de l'ensemble de la page HTML en est la cause, donc j'ai assez rapidement abandonné l'idée.

Mais bon avec un peu de recul, je pense qu'un rafraîchissent de 1FPS (mais surtout en ayant à modifié que quelques éléments), cette sorte *d'émulateur de terminal* peut trouver son utilité dans d'autres applications plus classiques que le jeu vidéo. D'ailleurs de telles méthodes doivent être utilisées lorsque l'on voit de petites fenêtre ayant la présentation la mise en forme d'un terminal standard. A suivre son mon github donc... 

# Déploiement
Finalement, j'ai mis en place un script qui détecte le système d'exploitation de l'utilisateur et qui adapte les instructions d'affichage en conséquence.

Si vous souhaitez créer vos propres jeux avec le moteur, rendez-vous ici : [https://ansiflow.netlify.app/](https://ansiflow.netlify.app/)
