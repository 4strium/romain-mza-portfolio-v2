---
title: "Le codage de Huffman, un algorithme de compression de données sans perte"
date: 2022-12-04T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/cover-images/hdd_cover.jpg'
tags: ["Algorithm", "Python", "Data"]
theme: "light"
---

![Photographie d’un disque dur ouvert|inline](https://romainmellaza.fr/img/cover-images/hdd_cover.jpg)

# Introduction
Le codage de Huffman, proposé par [**David Huffman**](https://fr.wikipedia.org/wiki/David_Albert_Huffman) (1925 – 1999) en 1952, est une **méthode de compression de données sans perte** utilisée pour les textes, les images (fichiers JPEG) ou les sons (fichiers MP3). Dans les textes longs, les lettres n’apparaissent pas avec la même fréquence. Ces fréquences varient suivant la langue utilisée. Le codage de Huffman consiste à **attribuer un mot binaire de longueur variable aux différents symboles du document à compresser.** Les symboles les plus fréquents sont codés avec des mots courts, tandis que les symboles les plus rares sont encodés avec des mots plus longs (rappelant ainsi le principe de l’alphabet Morse). Le code construit a la particularité de ne posséder **aucun mot ayant pour préfixe un autre mot.**

# Représentation
*Un exemple d'arbre de Huffman, généré avec la phrase « **this is an example of a huffman tree** ».*
![](https://romainmellaza.fr/img/huffman_coding/example_tree.jpg)

On recherche tout d'abord le **nombre d'occurrences de chaque caractère.** Dans l'exemple ci-dessus, la phrase contient 2 fois le caractère h et 7 espaces. Chaque caractère constitue une des feuilles de l'arbre à laquelle on associe **un poids égal à son nombre d'occurrences.**

L'arbre est créé de la manière suivante : on associe chaque fois les deux noeuds de plus faibles poids, pour donner un nouveau noeud dont le poids équivaut à la somme des poids de ses fils. On réitère ce processus jusqu'à n'en avoir plus qu'un seul noeud : la racine. **On associe ensuite par exemple le code 0 à chaque embranchement partant vers la gauche et le code 1 vers la droite.**

Pour obtenir le code binaire de chaque caractère, on remonte l'arbre à partir de la racine jusqu'aux feuilles en rajoutant à chaque fois au code un 0 ou un 1 selon la branche suivie. La phrase « this is an example of a huffman tree » se code alors sur **135 bits au lieu de 288 bits** (si le codage initial des caractères tient sur 8 bits).

# Logiciel 
J'ai conçu un logiciel simple et portable qui met en pratique ces notions pour compresser/décompresser des fichiers TXT conséquents.

Il est téléchargeable en [**cliquant ici !**](https://github.com/4strium/Huffman-Software/releases/download/v1.0.0/Utilitaire.Huffman.exe)