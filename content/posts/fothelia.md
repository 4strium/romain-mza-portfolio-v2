---
title: "Réutiliser une chute de ruban LED"
date: 2025-07-30T01:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://raw.githubusercontent.com/4strium/Fothelia/refs/heads/main/images/assembly.jpg'
tags: ["Electronic", "Python", "Software"]
theme: "light"
---

# Introduction
Cela faisait maintenant plusieurs mois que j'avais un bout de ruban LED coupé dans un de mes tiroirs, il s'agit d'un ruban Philips Hue, qui en temps normal se contrôle exclusivement via un bridge de la même marque. Un boîtier positionné en amont du ruban permet de retranscrire les commandes utilisateur de manière électrique afin d'injecter la tension équivalente à l'affichage désirée. Voici l'aspect extérieur de ce système :

![Module de contrôle électronique|inline](https://mellaza.tech/img/Fothelia/hue_module.jpg)

Le but recherché est de contrôler le ruban LED en faisant totalement abstraction de ces systèmes préconçus, nous allons, par conséquent, concevoir un module réalisant les mêmes actions.

# Principe de fonctionnement 
La première étape consiste à comprendre comment fonctionne exactement un tel ruban LED, en se penchant sur l'une de ses deux extrémités, on constate la présence de six entrées. 

<p align="center">
    <img src="https://mellaza.tech/img/Fothelia/inputs.jpg" width="20%" height="auto">
</p>

Voici la correspondance des différentes entrées du ruban :

- **C** : LED blanches froides (Cold White)
- **B** : composant bleu des LED RGB (Blue)
- **G** : composant vert des LED RGB (Green)
- **R** : composant rouge des LED RGB (Red)
- **F** : LED blanches chaudes (Warm White)
- **Vcc** : alimentation +24V

Chaque broche permet donc de piloter indépendamment une couleur ou une température de blanc, en modulant la tension appliquée.

# Moduler une tension
Vous avez sans-doute compris que la différence entre la tension d'entrée et l'alimentation 24V du ruban correspond au pourcentage d'éclairage de la composante reliée à l'entrée. En d'autres termes, plus la tension d'entrée est proche de 0V, plus la différence avec l'alimentation 24V est proche de... 24V, et donc la composante traduite par l'entrée est allumée à son maximum sur le ruban.

Nous utilisons la technologie PWM pour transmettre des valeurs comprises entre 0 et 255. La question qui se pose à présent est de savoir comment faire en sorte que lorsque l'utilisateur saisit une valeur entre 0 et 255 pour le rouge des modules RGB par exemple, alors 255 correspond à 0V en sortie et 0 correspond à 24V en sortie (une interpolation linéaire est effectuée pour les valeurs entre ces deux extrémités : *je pense que vous avez compris qu’avec une valeur PWM de 128, la différence de tension entre la source d’alimentation et la broche est de 24 V − 12 V = 12 V, donc les LED sont allumées à la moitié de leur puissance maximale.*).

La réponse à ce cahier des charges est simple : **des transistors**. Mais pas n'importe lesquels ! En effet, il ne faut surtout pas se précipiter pour utiliser des transistors de micro-électronique, car ces derniers sont conçus pour fonctionner avec des tensions/courants faibles ce qui n'est pas notre cas ici, en effet on travaille avec des tensions comprises entre 0 et 24 volts. Notre choix se porte donc sur des modules MOSFET capables de travailler avec un tel environnement. Voici ceux que j'ai choisi :

<p align="center">
    <img src="https://mellaza.tech/img/Fothelia/MOSFET.png" width="20%" height="auto">
</p>

# Micro-contrôleur
De part mon aisance avec les MCU ESP32, j'ai choisi de me tourner une nouvelle fois vers cette carte, qui m'a prouvé de nombreuses fois par le passé son aisance dans des projets de ce type. Mais vous pouvez tout aussi bien utiliser une carte Arduino par exemple, en fin de compte n'importe quelle carte fera l'affaire du moment quelle dispose d'assez de sorties PWM.

# Alimentation
Nous devons donc intégrer une alimentation 24V dans notre montage. Pour ma part, j'ai choisi de booster la sortie 5V de l'ESP32 afin d'obtenir les 24V nécessaires (mais il existe de nombreuses autres solutions pour y parvenir, je pense d'ailleurs que la mienne n'est pas la meilleure pour conserver l'intégrité du micro-contrôleur). J'utilise un module élévateur de tension DC appelé MT3608, qui fonctionne parfaitement et ne m'a posé aucun souci jusqu'à présent !

![Assemblage final|inline](https://raw.githubusercontent.com/4strium/Fothelia/refs/heads/main/images/assembly.jpg)

# Utiliser le logiciel de contrôle 
Si tout est correctement câblé et que le programme est bien flashé sur votre module, il vous suffit d’alimenter votre carte (via USB, jack, etc...). Le programme devrait s’initialiser normalement sans problème, prêt à recevoir les instructions envoyées par le logiciel, que nous détaillerons dans la section suivante.

## Utilisation du script Python
**Cette section s'adresse uniquement aux utilisateurs souhaitant exécuter le script Python plutôt que la version exécutable portable que je vous conseille vivement (disponible [ici](https://github.com/4strium/Fothelia/releases/tag/v1.0)).**

Avant la première utilisation, assurez-vous d'avoir effectué et vérifié les étapes suivantes :

1. **Installation de Python**  
  Une installation correcte de Python est nécessaire pour exécuter le script `app.py`.

2. **Installation des dépendances**  
  Installez toutes les dépendances requises avec la commande suivante :
```bash
    pip install PyQt6 pybluez librosa scipy numpy sounddevice
```

## Fonctionnalités

### Mode Basique
- **Mode RGB** : contrôlez les LED RGB en spécifiant la quantité de rouge, vert et bleu.
- **Mode Blanc Froid** : contrôlez les LED blanches froides en définissant leur puissance (de 0 à 255).
- **Mode Blanc Chaud** : contrôlez les LED blanches chaudes en définissant leur puissance (de 0 à 255).

### Mode Disco
- **Dégradé de Couleurs** : un dégradé infini de couleurs parcourant tout le spectre.
- **Synchronisation Musicale** : fournissez un fichier .mp3 de votre musique préférée, et le ruban affichera la couleur dominante (ou clignotera en blanc) correspondant à la fréquence dominante toutes les 100ms. L'application joue la musique en arrière-plan sur vos enceintes.

# Vidéo de démonstration
<p align="center">
  <iframe width="846" height="501" src="https://www.youtube.com/embed/iqZ9ig5bKA8" title="I created a complete system for reusing your LED strip leftovers" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>
