---
title: "Le protocole de routage OSPF"
date: 2023-01-12T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://images.unsplash.com/photo-1520869562399-e772f042f422?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1746&q=80'
tags: ["Réseaux", "Routage", "Dynamique"]
theme: "dark"
---

# Introduction
[**OSPF**](https://fr.wikipedia.org/wiki/Open_Shortest_Path_First) (Open Shortest Path First) est un protocole de routage utilisé pour distribuer des informations de routage dans un réseau IP. Il utilise un algorithme de calcul du chemin le **plus rapide ([algorithme de Dijkstra](https://fr.wikipedia.org/wiki/Algorithme_de_Dijkstra))** pour déterminer le meilleur chemin à travers le réseau.
Il est principalement utilisé dans **les réseaux locaux (LAN) et les réseaux privés virtuels (VPN)** pour connecter les réseaux locaux à un réseau étendu.

OSPF est un protocole de **routage intérieur (IGP)** qui est souvent utilisé pour connecter les réseaux locaux à un réseau étendu qui utilise un protocole de routage externe (EGP) comme BGP. OSPF est un protocole de routage à **état de lien**, ce qui signifie qu'**il utilise des informations sur les états des liens pour déterminer les meilleurs chemins à travers le réseau**, c’est à dire les plus rapides.

L'[**algorithme de Dijkstra**](https://fr.wikipedia.org/wiki/Algorithme_de_Dijkstra) est un algorithme de calcul de plus court chemin utilisé pour trouver le plus court chemin entre deux noeuds d'un graphe pondéré. Il est souvent utilisé pour trouver le plus court chemin dans les **réseaux de transport, les réseaux informatiques et les systèmes de navigation GPS.**

L'algorithme fonctionne en utilisant une méthode de "relaxation" pour déterminer le plus court chemin entre le noeud de départ et tous les autres noeuds. Il utilise une file de priorité pour stocker les noeuds qui ont été visités, **en ordonnant les noeuds en fonction de la distance du noeud de départ.** À chaque étape, l'algorithme sélectionne le noeud de la file de priorité qui a **la distance minimale et met à jour les distances des noeuds adjacents en utilisant la formule de relaxation.**

La formule de relaxation est utilisée pour mettre à jour la distance d'un noeud donné **en comparant la distance actuelle avec la distance du noeud de départ plus la distance entre le noeud de départ et le noeud cible via le noeud donné. Si la distance est plus courte en passant par le noeud donné, la distance est mise à jour.**

L'algorithme s'arrête lorsque **tous les noeuds ont été visités ou lorsque le noeud cible a été atteint.** Le plus court chemin entre le noeud de départ et le noeud cible est alors déterminé **en remontant les prédécesseurs à partir du noeud cible.**

Tout comme OSPF, le protocole RIP utilise un algorithme de calcul de plus court chemin pour déterminer le meilleur chemin à travers le réseau. Cependant, **il existe plusieurs différences clés entre OSPF et RIP :**
* **OSPF est un protocole de routage à état de lien, tandis que RIP est un protocole de routage à état de vecteur.** Cela signifie que OSPF utilise des informations sur les états des liens pour déterminer les meilleurs chemins à travers le réseau, tandis que RIP utilise des informations sur les états des vecteurs de distance.
* **OSPF est plus efficace pour les réseaux de grande taille et les réseaux à grande bande passante, tandis que RIP est plus adapté aux petits réseaux.**
* OSPF utilise une **méthode de mise à jour** de l'état de lien plus efficace que RIP, ce qui permet à OSPF de **converger plus rapidement** en cas de changements dans le réseau.
* OSPF permet une **hiérarchisation des réseaux**, ce qui facilite la gestion des réseaux de grande taille. RIP ne permet pas cette hiérarchisation.

En somme, OSPF est considéré comme **un protocole de routage plus efficace et évolutif que RIP pour les réseaux de grande taille**, mais RIP est plus simple à configurer et peut être utilisé dans des environnements plus restreints.

# Travail Pratique
Nous débutons donc notre simulation avec ce réseau relativement simple :
![](https://i.ibb.co/Nr4xy39/ospf-img1.jpg)

Comme vous pouvez le remarquer dans les noms des interfaces, les liaisons ne sont pas toutes à la même vitesse :
* **10Mbits/s** (**Eth** : carte d'extension liaison **cuivre** *PT-ROUTER-NM-1CE*)
* **100Mbits/s** (**FA** : carte d'extension liaison **cuivre** *PT-ROUTER-NM-1CFE*)
* **1Gbits/s** (**Gig** : carte d'extension liaison **fibre** *PT-ROUTER-NM-1FGE*)

On remplit donc les trois routeurs vierges, avec ces configurations :
![|inline](https://i.ibb.co/mBTP67d/ospf-img2.png)

Nous réalisons une configuration des différents routeurs fraîchement installés, avec un protocole de routage RIP !

([*Pour de plus amples explications sur le protocole RIP, veuillez-vous référer au document traitant de ce sujet*](../protocol-rip/))

On obtient donc les tables de routages suivantes :