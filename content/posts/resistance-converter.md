---
title: "Un convertisseur simple et efficace pour l'électronique"
date: 2022-04-23T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://mellaza.tech/img/resistance_converter/cover_multimeter.jpg'
tags: ["Electronic", "Python", "Software"]
theme: "light"
---

# ⚡ Electrical Resistance Converter
 
Ce convertisseur permet aux initiés de même qu'aux experts en électronique de connaître simplement et efficacement la valeur d'une résistance électrique en fonction des anneaux qui enrobent sa surface, et inversement, ils peuvent savoir à quoi ressemble la résistance qu'ils recherchent en connaîssant sa valeur exacte. Il n'est plus nécessaire de se procurer un multimètre pour effectuer ce type de mesure.

Il y a par conséquent deux modes d'utilisation :
## Valeur → Couleur 
![|inline](https://github.com/4strium/Electrical-Resistance-Converter/blob/main/pres/mode1.png?raw=true)

Comme vous pouvez le voir ci-dessus, l'utilisateur saisit les trois chiffres significatifs, le multiplicateur, la tolérance ainsi que le coefficient de température afin d'obtenir in fine la représentation de la résistance qui dipose des anneaux de couleurs correspondantes.

## Couleur → Valeur
![|inline](https://github.com/4strium/Electrical-Resistance-Converter/blob/main/pres/mode2.png?raw=true)

Dans ce mode d'utilisation, l'utilisateur qui dispose d'une résistance en main peut renseigner anneau par anneau sa couleur afin d'obtenir la valeur totale correspondante.

![|inline](https://github.com/4strium/Electrical-Resistance-Converter/blob/main/pres/mode2_bis.png?raw=true)

# Utilisation
Le logiciel est complètement portable, en effet il s'agit d'un unique exécutable que vous pouvez télécharger : [**EN CLIQUANT ICI**](https://github.com/4strium/Electrical-Resistance-Converter/releases/download/v1.0.0/Convertisseur.Resistances.exe). 

*Aucune dépendance et aucun pré-requis : vous pouvez l'exécuter où bon vous semble !*

# Conception
Cet outil a été réalisé en [Python](https://www.python.org/), mis en forme grâce à la bibliothèque graphique [Tkinter](https://fr.wikipedia.org/wiki/Tkinter) et empaqueté au moyen de [PyInstaller](https://pyinstaller.org/en/stable/).