---
title: "Le principe du Tri Fusion"
date: 2023-07-10T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://mellaza.tech/img/tri_fusion/cover_img_lava.jpg'
tags: ["Algorithm", "Python", "OCaml"]
theme: "dark"
---

# Introduction
Le tri fusion est un algorithme de tri qui utilise **le paradigme "Diviser pour régner".** Son principe est de diviser une grande liste en deux sous-listes plus petites, de trier chaque sous-liste de manière récursive en utilisant le tri fusion, puis de fusionner les deux sous-listes triées pour obtenir la liste triée complète.

Voici les étapes du tri fusion :
1. **Divisez la liste en deux sous-listes de taille égale (ou presque).**
2. **Triez chaque sous-liste récursivement en utilisant le tri fusion.**
3. **Fusionnez les deux sous-listes triées pour obtenir la liste triée complète.**

La fusion des sous-listes triées se fait en comparant les éléments des deux sous-listes, un par un, et en les plaçant dans l'ordre croissant dans une nouvelle liste. Cette étape est répétée jusqu'à ce que tous les éléments des deux sous-listes soient fusionnés dans la nouvelle liste.

**En résumé, le tri fusion est un algorithme de tri efficace qui utilise le paradigme "Diviser pour régner" en divisant une grande liste en deux sous-listes plus petites, en triant chaque sous-liste de manière récursive en utilisant le tri fusion, puis en fusionnant les deux souslistes triées pour obtenir la liste triée complète.**

![Exemple avec la liste [2,10,0,8,7,42,5]](https://mellaza.tech/img/tri_fusion/steps.png)

# Évaluation de la complexité :

L'avantage du tri fusion est sa complexité temporelle de **O(n × log (n))**, qui est plus efficace que d'autres algorithmes de tri tels que le tri par sélection **O(n²)** pour les grandes listes de données.

A titre de comparaison, voici un tableau reprenant les différents temps d’exécution en Python des deux types de tris en fonction de tableaux de différentes tailles, plus ou moins grandes :

| **n** | Tri par sélection | Tri fusion |
|:--:|:---: | :---: |
| **100** | *0.006 s* | *0.006 s* |
| **1 000** | *0.069 s* | *0.010 s* |
| **10 000** | *2.162 s* | *0.165 s* |
| **20 000** | *7.526 s* | *0.326 s* |
| **40 000** | *28.682 s* | *0.541 s* |

![|inline](https://mellaza.tech/img/tri_fusion/complexity.jpg)

*Si l’on se réfère au graphique de la notation **Big-O** on constate que la complexité temporelle du tri fusion se classe dans la section « Mauvais » qui représente le minimum possible pour un algorithme de tri !*

De plus, le tri fusion est stable, ce qui signifie que l'ordre relatif des éléments égaux est préservé après le tri.

# Implémentation en Python :
* Écrire une fonction **decoupe** qui :
    * Prend en paramètre un tableau tab,
    * Découpe le tableau en deux moitiés de même taille (à un élément près),
    * Retourne 2-uplets contenant la liste des deux moitiés.

```python
def decoupe(tab):
    middle = len(tab)//2
    return (tab[:middle],tab[middle:])
```

* Écrire une fonction itérative fusionne qui :
    * Prend en paramètres deux tableaux triés tab1 et tab2 dans l'ordre croissant,
    * Fusionne les deux tableaux en un seul, trié dans l'ordre croissant,
    * Retourne un tableau du résultat de la fusion.

*Réutilisation du sujet n°24 du BAC pratique NSI 2023*
```python
def fusionne(tab1, tab2):
    n1 = len(tab1)
    n2 = len(tab2)
    lst12 = [0] * (n1 + n2)
    i1 = 0
    i2 = 0
    i = 0
    while i1 < n1 and i2 < n2 :
        if tab1[i1] < tab2[i2]:
            lst12[i] = tab1[i1]
            i1 = i1 + 1
        else:
            lst12[i] = tab2[i2]
            i2 = i2 + 1
        i += 1
    while i1 < n1:
        lst12[i] = tab1[i1]
        i1 = i1 + 1
        i = i + 1
    while i2 < n2:
        lst12[i] = tab2[i2]
        i2 = i2 + 1
        i = i + 1
    return lst12
```

* Écrire une fonction récursive tri_fusion qui :
    * Prend en paramètre un tableau tab d'entiers non triés,
    * Retourne ce tableau trié dans l'ordre croissant grâce au tri fusion,
    * Le cas de base retourne le tableau tab lorsqu'il ne reste plus qu'un élément dans tab.
    * 2-uplets tab1 et tab2 mémorisent le retour du découpage de tableau tab en 2 en appelant la fonction decoupe.
    * On retourne récursivement la fusion du tri_fusion de tab1 et du tri_fusion de tab2.

```python
def tri_fusion(tab):
    if len(tab) == 1 :
        return tab

    res = decoupe(tab)
    return fusionne(tri_fusion(res[0]),tri_fusion(res[1]))
```

Autre méthode pour le tri fusion :
```python
def tri_fusion(T,g,d):
  if g < d :
    m = (d+g)//2
    tri_fusion(T,g,m)
    tri_fusion(T,m+1,d)
    fusion(T,g,m,d)

def fusion(T,g,m,d):
  i = g
  j = m+1
  aux = []

  while i <= m and j <= d :
    if T[i] < T[j] :
      aux.append(T[i])
      i += 1
    else :
      aux.append(T[j])
      j += 1
  while i <= m :
    aux.append(T[i])
    i += 1
  while j <= d :
    aux.append(T[j])
    j += 1
  k = 0
  l = g
  while l <= d :
    T[l] = aux[k]
    k += 1
    l += 1
```

# Implémentation en OCaml :
```ocaml
let rec divise lst = match lst with
      | [] -> [], []
      | [x] -> [], [x]
      | h1::h2::t -> let l1, l2 = divise t in h1::l1, h2::l2;;

let rec fusionne lst1 lst2 = match lst1, lst2 with
      | [],l -> l
      | l, [] -> l
      | h1::t1, h2::t2 -> if h1 < h2 then h1::(fusionne t1 lst2) else h2::(fusionne lst1 t2);;

let rec tri_fus lst = match lst with
      | [] -> []
      | [x] -> [x]
      | _ -> let lst_1,lst_2 = divise lst in fusionne (tri_fus lst_1) (tri_fus lst_2);;
```