---
title: "Optimiser un hôpital, grâce aux types abstraits"
date: 2024-01-08T21:39:07+01:00
draft: true
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/tri_fusion/cover_img_lava.jpg'
tags: ["Structures de données", "Types abstraits", "OCaml"]
theme: "light"
---

*Ce concept est purement fictif et il ne s'agit bien entendu que d'un exercice d'application de l'optimisation possible des types abtraits en Algorithmique*

## Contexte
Imaginons que nous sommes engagés par un hôpital pour remplacer le système manuel de tri des patients arrivant aux urgences par un système informatique.
Les patients arrivant aux urgences sont immédiatement évalués en fonction de la gravité de leur pathologie et de l’urgence de leur prise en charge. Ils sont notés : cette évaluation prend la forme d’une note allant entre 0 (les cas les moins urgents et les plus bénins) à `$ N − 1 $` (les cas extrêmes à prendre en charge en premier). 

Ensuite, ils vont dans une salle d’attente en attendant qu’un médecin les prenne en charge.

La méthode pour choisir le prochain patient en salle d’attente est la suivante : 
* On prend d’abord le patient ayant la note la plus élevée. 
* S’il y a plusieurs patients ayant la même note, on prend d’abord en charge le patient étant arrivé le plus tôt.

# Mise en application
Nous allons implémenter plusieurs types pour représenter une salle d'attente ainsi qu'un patient, avec les avantages et les inconvénients pour chacun d'entre eux.

## 1ère version du type abstrait
On choisit dans un premier temps de représenter un patient par un couple d'entier : 
* Le premier élément représente son score de gravité.
* Le second élément est un identifiant unique permettant de différencier deux personnes ayant le même score de gravité par exemple.

De plus, on choisit de représenter une salle d'attente par une simple liste de couples patients.
```ocaml

type patient = (int * int)
type room = patient list

```

Maintenant que ces deux types sont définis, nous pouvons à présent définir l'interface suivante :
| **Type d'opérations** |   **Description**   |   **Implémenté en OCaml**   |
| :---------------------: | :--------------------: | :-------------------------: |
| Constructeur | Crée une salle d'attente vide | ```make_room: unit → (int * int) list``` |
| Constructeur | Crée un couple ( score / id du patient) | ```make_patient: int → int → (int * int)``` |