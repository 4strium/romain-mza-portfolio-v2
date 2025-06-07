---
title: "Optimiser un hôpital, grâce aux types abstraits"
date: 2024-01-08T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://mellaza.tech/img/hospital_type/cover.jpg'
tags: ["Structures de données", "Types abstraits", "OCaml"]
theme: "light"
---

*Ce concept est purement fictif et il ne s'agit bien entendu que d'un exercice d'application de l'optimisation possible des types abtraits en Algorithmique*

# Contexte
Imaginons que nous sommes engagés par un hôpital pour remplacer le système manuel de tri des patients arrivant aux urgences par un système informatique.
Les patients arrivant aux urgences sont immédiatement évalués en fonction de la gravité de leur pathologie et de l’urgence de leur prise en charge. Ils sont notés : cette évaluation prend la forme d’une note allant entre 0 (les cas les moins urgents et les plus bénins) à N − 1 (les cas extrêmes à prendre en charge en premier). 

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

Maintenant que ces deux types sont définis, nous pouvons à présent définir l'interface en [version fonctionnelle](https://fr.wikipedia.org/wiki/Programmation_fonctionnelle) :
| **Type d'opérations** |   **Description**   |   **Implémenté en OCaml**   |
| :---------------------: | :--------------------: | :-------------------------: |
| Constructeur | Crée une salle d'attente vide | ```make_room: unit → (int * int) list``` |
| Constructeur | Crée un couple ( score / id du patient) | ```make_patient: int → int → (int * int)``` |
| Constructeur | Ajoute un couple patient à une salle d'attente | ```add_pat_room: (int * int) → (int * int) list → (int * int) list``` |
| Constructeur | Faire sortir le patient prioritaire de la salle d'attente | ```call_patient: (int * int) list → (int * int) list``` |
| Accesseur | Renvoie le patient à traiter en priorité dans une salle d'attente | ```get_prio: (int * int) list → (int * int)``` |

Parallèlement, nous pouvons définir l'interface en [version impérative](https://fr.wikipedia.org/wiki/Programmation_imp%C3%A9rative) :
| **Type d'opérations** |   **Description**   |   **Implémenté en OCaml**   |
| :---------------------: | :--------------------: | :-------------------------: |
| Constructeur | Crée une salle d'attente vide | ```make_room: unit → patient list``` |
| Constructeur | Crée un couple ( score / id du patient) | ```make_patient: int → int → patient``` |
| Transformateur | Ajoute un couple patient à une salle d'attente | ```add_pat_room: patient → room → unit``` |
| Transformateur | Faire sortir le patient prioritaire de la salle d'attente | ```call_patient: room → patient``` |
| Accesseur | Renvoie le patient à traiter en priorité dans une salle d'attente | ```get_prio: room → patient``` |

```ocaml
let make_room = []

let make_patient (score : int) (id : int) = (score, id)

(* Fonction permettant d'ajouter un patient à une salle d'attente *)
let add_pat_room patient_inp room_inp = patient_inp::room_inp

(* Fonction permettant d'obtenir le patient prioritaire *)
let get_prio room_inp = match room_inp with
  | [] -> failwith "Salle d'attente complètement vide !"
  | t::q -> let first_val = t in
  let rec prio_auxi best lst_inp = match lst_inp with
  | [] -> best
  | t::q -> if fst t > fst best || fst t = fst best then prio_auxi t q 
            else prio_auxi best q
  in prio_auxi first_val room_inp

(* Fonction permettant d'appeler le patient prioritaire et en pratique le retirer de la salle d'attente *)  
let call_patient room_inp = 
  let patient_a_appeler = get_prio room_inp in 
  let rec search_for_patient room_inp_aux pat = match room_inp_aux with
    | [] -> failwith "Erreur"
    | t::q -> if fst t = fst pat then q
              else t :: search_for_patient q pat 
  in search_for_patient room_inp patient_a_appeler
```

### Complexités observées :
| **Type d'opérations** |   **Complexité temporelle**   |
| :---------------------: | :--------------------: |
| `make_room` | `O(1)` |
| `make_patient` | `O(1)` |
| `add_pat_room` | `O(1)` |
| `get_prio` | `O(n)` |
| `call_patient` | `O(n²)` |

On constate que chercher le patient dans la salle d'attente requiert un nombre important d'opérations, en effet, le patient prioritaire peut très bien se situer au fond de la salle d'attente (conceptuellement), ce qui fait donc perdre un temps précieux !

Pour contrer ce soucis, on décide de trier la salle d'attente afin que le patient prioritaire se situe en tête de la salle d'attente, puis le second juste après, etc... jusqu'au patient le moins prioritaire. On rappelle que les patients avec des blessures de même gravité sont triés de telle sorte que le patient arrivé avant est traité d'abord pour éviter les séquelles.

## 2ème version du type abstrait

*Les représentations des patients et des salles d'attentes restent inchangées.*

On choisit de trier la salle d'attente en utilisant le [tri par insertion](https://fr.wikipedia.org/wiki/Tri_par_insertion) :
```ocaml
let rec insere lst element = match lst with
  | [] -> [element]
  | h::t -> if fst element > fst h then element::h::t else h::(insere t element)

let rec tri_insertion lst = match lst with 
  | [] -> []
  | h::t -> insere (tri_insertion t) h
```

On propose par conséquent trois nouvelles versions des fonctions `add_pat_room`, `get_prio` et `call_patient` :

```ocaml
let add_pat_room_v2 patient_inp room_inp = tri_insertion (patient_inp::room_inp)

let get_prio_v2 room_inp = match room_inp with 
  | [] -> failwith "Salle d'attente complètement vide !"
  | t::q -> t

let call_patient_v2 room_inp = match room_inp with
  | [] -> failwith "Salle d'attente complètement vide !"
  | t::q -> q
```

On peut clairement voir ici que trouver et appeler la patient prioritaire est simplissime car il se trouve en tête de la liste (la salle d'attente en l'occurrence).

### Complexités observées :
| **Type d'opérations** |   **Complexité temporelle**   |
| :---------------------: | :--------------------: |
| `make_room` | `O(1)` |
| `make_patient` | `O(1)` |
| `add_pat_room_v2` | `O(n²)` |
| `get_prio_v2` | `O(1)` |
| `call_patient_v2` | `O(1)` |

On constate que la complexité en `O(n²)` a été reléguée à l'ajout du patient dans la salle d'attente en raison du tri par insertion, si un tri avec une [complexité temporelle](https://fr.wikipedia.org/wiki/Complexit%C3%A9_en_temps) moindre est souhaité alors on pourra utiliser un autre algorithme. Sinon toutes les autres opérations du type abstrait sont effectuées en `O(1)`, soit une complexité en temps constante.