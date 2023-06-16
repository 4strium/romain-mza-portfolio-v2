---
title: "Comprendre le principe de la recherche dichotomique"
date: 2022-09-09T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/Dichotomie_images/dichotomie_cover.jpg'
tags: ["Python", "algorithm", "Maths"]
theme: "dark"
---

![](https://romainmellaza.fr/img/Dichotomie_images/dichotomie_cover.jpg)

# Introduction
La [méthode dichotomique](https://fr.wikipedia.org/wiki/Recherche_dichotomique), est une méthode qui consiste simplement à couper en deux parties une base de données, on ne garde que la partie susceptible de contenir l’information recherchée. Ainsi, en réitérant plusieurs fois cette action, on est certain que la base finale contiendra l’information recherchée !

Cette méthode est bien plus efficace que de simplement inspecter les éléments un par un, en effet cela réduit considérablement le nombre d’étapes dans notre algorithme.

Pour rendre cela un peu plus évident, voici un **exemple simple** :
* Je prends un dictionnaire français classique
* Je cherche le mot « *Numérique* » par exemple, la méthode la plus efficace n’est évidemment pas de tourner pages après pages.
* Je déchire donc mon dictionnaire en deux au niveau de la 13ème lettre (m) étant donné que l’alphabet français est composé de 26 lettres (*et 26/2 = 13…*)
* Cela signifie que j’aurai un « demi-dictionnaire » contenant les mots de a à m, ainsi qu’un autre « demi-dictionnaire » contenant les mots de n à z !
* « Numérique » se situe dans la catégorie des mots commençant par n, je peux donc jeter le « demi-dictionnaire » contenant les mots de a à m, il ne m’est plus d’aucune utilité.
* Je dispose maintenant d’une base de données contenant des éléments allant de n à z, soit 13 catégories de lettres, je peux donc redécouper en deux parties égales la liste. *13 / 2 = 6.5* dans mon algorithme je choisi de prendre la valeur inférieure soit 6, j’aurais donc un « quart de dictionnaire » contenant les mots de n à s, et un autre allant de t à z.
* Comme vous l’avez compris je garde le « quart de dictionnaire » contenant les mots de n à s.
* Et ainsi de suite jusqu’à obtenir l’élément recherché, petit à petit **la machine traite de moins en moins d’éléments !**

# Représentation
![Visualisation d’une recherche dichotomique, où 4 est la valeur recherchée.|inline](https://romainmellaza.fr/img/Dichotomie_images/Binary-search-into-array.png)

# Programmation & Algorithme
```python
def recherche(tab,n):
    """
    n étant la valeur recherchée.
    """
    i = 1
    j = 0
    while i > 0 :
        i = (len(tab)-1)//2
        if tab[i] > n :
            tab = tab[:i]
            j += i
        elif tab[i] < n :
            tab = tab[i:]
            j += i
        elif tab[i] == n :
            return i+j
    return -1 # Si l'élément recherché n'est pas dans la liste.
```

# Complexité
Tout comme l’algorithme de Dichotomie, il existe d’autres méthodes pour **retrouver un élémentdans une série ordonnée**, en voici quelques-unes :
*Recherche Séquentielle, Hachage, Arbre Binaire, Recherche par interpolation, Matrices Judy, Filtres de Bloom, Arbres de van Emde Boas, …*

Mais étant donné que nous travaillons ici avec le langage Python, nous allons comparer le temps d’exécution de l’algorithme de Dichotomie, par rapport à la **méthode native** « *list.index(element)* ».

Pour les besoins de l’expérience, je vais bien évidemment **désactiver l’affichage utilisateur et la temporisation**, afin d’éviter tout ralentissements superflus !

J’ai donc demandé à ma machine (**via l’algo. de Dichotomie**) de **déterminer l’index du nombre « 84 327 » dans ma liste de 100 000 valeurs ordonnées.**

Puis j’ai réitéré la même problématique à ma machine, mais en lui demandant d’**utiliser la fonction native** cette fois ci !

*Et voici le résultat :*
|                                   | **Temps d'exécution total** |
| :-------------------------------: | --------------------------- |
| **Algorithme de Dichotomie**      | ```1.824 secondes```        |
| **Méthode Native « .index() »**   | ```0.684 secondes```        |

La méthode native reste donc **la méthode la plus rapide.**