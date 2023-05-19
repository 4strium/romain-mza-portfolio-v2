---
title: "Le protocole de routage OSPF"
date: 2023-01-12T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/cover-images/reseaux_cables.png'
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
![](https://romainmellaza.fr/img/protocol_ospf_img/ospf_img1.jpg)

Comme vous pouvez le remarquer dans les noms des interfaces, les liaisons ne sont pas toutes à la même vitesse :
* **10Mbits/s** (**Eth** : carte d'extension liaison **cuivre** *PT-ROUTER-NM-1CE*)
* **100Mbits/s** (**FA** : carte d'extension liaison **cuivre** *PT-ROUTER-NM-1CFE*)
* **1Gbits/s** (**Gig** : carte d'extension liaison **fibre** *PT-ROUTER-NM-1FGE*)

On remplit donc les trois routeurs vierges, avec ces configurations :
![|inline](https://romainmellaza.fr/img/protocol_ospf_img/ospf_img2.png)

Nous réalisons une configuration des différents routeurs fraîchement installés, avec un protocole de routage RIP !

([*Pour de plus amples explications sur le protocole RIP, veuillez-vous référer au document traitant de ce sujet*](../protocol-rip/))

On obtient donc les tables de routages suivantes :

*Routeur 0:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Interface ou Passerelle**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| Connected       |   ```10.0.0.0```  |        ```255.255.255.252```      | Eth 2/0 | 0| 0|
| Connected       |   ```10.0.0.4```  |        ```255.255.255.252```      | Gig 1/0 | 0| 0|
| RIPv2       |   ```10.0.0.8```  |        ```255.255.255.252```      | via ```10.0.0.2``` **ou** ```10.0.0.6``` | 120| 1|
| Connected       |   ```192.168.0.0```  |        ```255.255.255.0```      | FA 0/0 | 0| 0|
| RIPv2       |   ```192.168.1.0```  |        ```255.255.255.0```      | via ```10.0.0.2``` | 120| 1|

*Routeur 1:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Interface ou Passerelle**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| RIPv2       |   ```10.0.0.0```  |        ```255.255.255.252```      | via ```10.0.0.5``` **ou** ```10.0.0.10``` | 120| 1|
| Connected       |   ```10.0.0.4```  |        ```255.255.255.252```      | Gig 0/0 | 0| 0|
| Connected       |   ```10.0.0.8```  |        ```255.255.255.252```      | Gig 1/0 | 0| 0|
| RIPv2       |   ```192.168.0.0```  |        ```255.255.255.0```      | via ```10.0.0.5``` | 120| 1|
| RIPv2       |   ```192.168.1.0```  |        ```255.255.255.0```      | via ```10.0.0.10``` | 120| 1|

*Routeur 2:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Interface ou Passerelle**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| Connected       |   ```10.0.0.0```  |        ```255.255.255.252```      | Eth 0/0 | 0| 0|
| RIPv2       |   ```10.0.0.4```  |        ```255.255.255.252```      | via ```10.0.0.1``` **ou** ```10.0.0.9``` | 120| 1|
| Connected       |   ```10.0.0.8```  |        ```255.255.255.252```      | Gig 1/0 | 0| 0|
| RIPv2       |   ```192.168.0.0```  |        ```255.255.255.0```      | via ```10.0.0.1``` | 120| 1|
| Connected       |   ```192.168.1.0```  |        ```255.255.255.0```      | FA 2/0 | 0| 0|

Étant donné qu’avec un protocole de routage RIP, le meilleur chemin est celui qui comporte le moins de « saut », alors un message échangé entre PC0 et PC1 passe par Routeur 0 puis Routeur 2, c'est à dire **la connexion Ethernet 10 Mbits/s. Alors qu’un chemin – qui certes comporte deux sauts – pourrait permette une connexion fibre 1Gbits/s ?!**

Une solution qui pourrait privilégier ce lien est **le recours au [protocole de routage OSPF](https://fr.wikipedia.org/wiki/Open_Shortest_Path_First). Celui-ci en effet prend en compte, de manière prépondérante par rapport au nombre de sauts, la vitesse de transmission entre deux routeurs.**

Nous allons donc configurer ce nouveau protocole de routage, la première étape étant de supprimer les protocoles RIP existant sur les routeurs.

On utilise la commande suivante dans chacune des interfaces de configuration des trois routeurs du réseau :
```
Router(config)#no router rip
```
Nous prenons soin de passer en mode simulation sur le logiciel, afin de mieux visualiser les différentes requêtes.

**Pour activer OSPF, il faut activer le routage et déclarer les réseaux sur lesquels on souhaite transmettre les informations.**

Nous activons OSPF sur le Routeur 0 avec la commande :
```
Router(config)#router ospf 100
```
Il faut préciser un **identifiant de processus car on peut faire tourner plusieurs processus OSPF sur un même routeur.** Dans notre cas, on n'aura qu'un seul processus OSPF et on choisira une valeur souvent utilisée par défaut : **100**

On déclare ensuite les réseaux que le routeur 0 doit prendre en compte pour les informations de routage OSPF :
```
Router(config-router)#network 10.0.0.0 0.0.0.3 area 0
Router(config-router)#network 10.0.0.4 0.0.0.3 area 0
Router(config-router)#network 192.168.0.0 0.0.0.255 area 0
Router(config-router)#redistribute connected subnets
```
**On précise après la commande network, l'adresse du réseau, le masque inversé et le mot clef area qui permet de définir éventuellement des zones OSPF différentes dans un ensemble de réseaux.** *On aura une seule zone dans ce schéma simplifié et on utilisera pour la définir une valeur de 0.* La dernière commande "```redistribute connected subnets```" permet d'indiquer que l'**on souhaite informer les routeurs voisins des réseaux directement connectés à ce routeur** (par défaut uniquement ce qui est appris via le protocole OSPF est retransmit).

Nous visualisons déjà les toutes premières requêtes OSPF du Routeur 0 :
![](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu1.jpg)

**Les trois messages OSPF que nous pouvons voir ci-dessus sont émis par le Routeur 0 afin de découvrir si d'autres routeurs sont prêts à échanger avec lui des routes via OSPF.**

![](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu2.jpg)

*Comme aucun autre routeur n'est pour l'instant configuré, toutes ses demandes n'aboutissent pas. Pour commencer à avoir des échanges, allons configurer Routeur 2 !*

Dans l’interface du Routeur 2, **nous configurons donc le protocole de routage OSPF ainsi que les trois réseaux à prendre en compte pour les échanges :**
```
Router(config)#router ospf 100
Router(config-router)#network 10.0.0.0 0.0.0.3 area 0
Router(config-router)#network 10.0.0.8 0.0.0.3 area 0
Router(config-router)#
00:02:25: %OSPF-5-ADJCHG: Process 100, Nbr 192.168.0.254 on
Ethernet0/0 from LOADING to FULL, Loading Done
Router(config-router)#network 192.168.1.0 0.0.0.3 area 0
Router(config-router)#redistribute connected subnets
Router(config-router)#exit
Router(config)#exit
Router#
%SYS-5-CONFIG_I: Configured from console by console
```

![](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu3.png)

**Le routeur 2 se met alors à vouloir communiquer lui aussi.**
**Il envoie un message vers routeur 1 qui n'est pas pris en compte et un message vers routeur 0 qui est accepté !**

Un certain nombre d'échanges OSPF vont maintenant être réalisés entre routeur 0 et routeur 2 pour qu'ils puissent mettre à jour leurs tables de routage.

On repasse en mode « Realtime » pour être sûr que ces échanges soient complets.

Nous pouvons maintenant réaliser de nouveau les tables de routage des routeurs 0 et 2 :

*Routeur 0:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Interface ou Passerelle**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| Connected       |   ```10.0.0.0```  |        ```255.255.255.252```      | Eth 2/0 | 0| 0|
| Connected       |   ```10.0.0.4```  |        ```255.255.255.252```      | Gig 1/0 | 0| 0|
| **OSPF**      |   ```10.0.0.8```  |        ```255.255.255.252```      | via ```10.0.0.2``` | 110| 11|
| Connected       |   ```192.168.0.0```  |        ```255.255.255.0```      | FA 0/0 | 0| 0|
| **OSPF**       |   ```192.168.1.0```  |        ```255.255.255.0```      | via ```10.0.0.2``` | 110| 11|

*Routeur 2:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Interface ou Passerelle**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| Connected       |   ```10.0.0.0```  |        ```255.255.255.252```      | Eth 0/0 | 0| 0|
| **OSPF**       |   ```10.0.0.4```  |        ```255.255.255.252```      | via ```10.0.0.1``` | 110| 11|
| Connected       |   ```10.0.0.8```  |        ```255.255.255.252```      | Gig 1/0 | 0| 0|
| **OSPF**       |   ```192.168.0.0```  |        ```255.255.255.0```      | via ```10.0.0.1``` | 110| 11|
| Connected       |   ```192.168.1.0```  |        ```255.255.255.0```      | FA 2/0 | 0| 0|

**On constate notamment deux métriques de 11 pour les protocoles OSPF, ce qui est tout à normal, on peut démontrer cela de manière théorique :**
* FastEthernet : Lien 100 Mbits/s = 10⁸/10⁸ = **1**
* Fibre : Lien 1 Gbits/s = 10⁸/10⁹ = **0.1** (*ce qui est impossible car la valeur minimale par convention est 1*), **on choisit donc de mettre 1 par défaut pour la fibre.**
* Ethernet : Lien 10 Mbits/s = 10⁸/10⁷ = **10**

A partir de Routeur 2 par exemple, **pour atteindre le réseau 10.0.0.4, notre paquet va transiter par un lien en Ethernet et un autre en Fibre, soit respectivement 10 et 1 ce qui nous donnes bien une métrique de 11 !**
![|inline](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu4.jpg)

On peut vérifier l’autre protocole de la table avec un paquet ayant pour destination ```192.168.0.0```
![|inline](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu5.jpg)

Ci-dessus, nous avons un paquet qui transite par un lien Ethernet puis FastEthernet, soit **10 + 1**, ce qui donne bien une **métrique de 11** comme spécifié dans la table.

On s’attelle maintenant à configurer OSPF sur le Routeur 1 et déclarez les deux réseaux à prendre en compte pour les échanges OSPF.

Dans l’interface du Routeur 1, **nous configurons donc le protocole de routage OSPF ainsi que les deux réseaux à prendre en compte pour les échanges :**
```
Router(config)#router ospf 100
Router(config-router)#network 10.0.0.4 0.0.0.3 area 0
Router(config-router)#network 10.0.0.8 0.0.0.3 area 0
Router(config-router)#redistribute connected subnets
02:48:37: %OSPF-5-ADJCHG: Process 100, Nbr 192.168.0.254 on
GigabitEthernet0/0 from LOADING to FULL, Loading Done
02:48:41: %OSPF-5-ADJCHG: Process 100, Nbr 192.168.1.254 on
GigabitEthernet1/0 from LOADING to FULL, Loading Done
Router(config-router)#exit
Router(config)#exit
Router#
%SYS-5-CONFIG_I: Configured from console by console
```
**La connexion entre Router 1 et les autres routeurs est optimale comme nous pouvons le voir dans le mode simulation :**
![|inline](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu6.png)

![|inline](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu7.png)

**Normalement, le fait qu’une nouvelle route plus rapide soit disponible a dû modifier les tables de routages de Routeur 0 et Routeur 2.**

Nous vérifions cela :

*Routeur 0 :*
![|inline](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu8.jpg)

*Routeur 2 :*
![|inline](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu9.jpg)

**On constate que les routes ont bien été modifiées pour les protocoles OSPF, au profit des liaisons fibres, ce qui réduit les métriques !**

On peut vérifier cela avec deux exemples concrets :

**10.0.0.8 via 10.0.0.6 ➔ Fibre + Fibre = 2×Gigabit = 2×1 = Métrique de 2**
![|inline](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu10.jpg)

**192.168.1.0 via 10.0.0.6 ➔ Fibre + Fibre + FastEthernet = 2×Gigabit + 100 Megabits = 2×1+1 = Métrique de 3**
![|inline](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu11.jpg)

**Un message entre PC0 et PC1 passe maintenant par Routeur 1, comme on peut le démontrer en générant un ping de test par exemple :**
![|inline](https://romainmellaza.fr/img/protocol_ospf_img/config_ospf_simu12.png)