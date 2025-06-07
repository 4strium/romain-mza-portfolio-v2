---
title: "Le protocole de routage RIP"
date: 2023-01-11T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://mellaza.tech/img/cover-images/reseaux_cables.png'
tags: ["Réseaux", "Routage", "Dynamique"]
theme: "dark"
---

# Introduction
Nous allons nous intéresser à un [protocole de routage](https://fr.wikipedia.org/wiki/Routage_IP) dit « [**dynamique**](https://fr.wikipedia.org/wiki/Routage_dynamique#:~:text=Le%20routage%20dynamique%20ou%20routage,de%20communication%20dans%20un%20syst%C3%A8me.) », il va permettre aux différents routeurs de se comprendre et d'échanger des informations de façon périodique ou événementielle afin que **chaque routeur soit au courant des évolutions du réseau sans aucune intervention de l'administrateur du réseau.**

Le [**protocole RIP (Routing Information Protocol ou protocole d'information de routage)**](https://fr.wikipedia.org/wiki/Routing_Information_Protocol) est un protocole de routage IP à **vecteur de distance** (couple adresse, distance) s'appuyant sur [l'algorithme de **Bellman-Ford**](https://fr.wikipedia.org/wiki/Algorithme_de_Bellman-Ford) (algorithme qui permet de calculer les plus courts chemins dans un graphe) afin de déterminer la route permettant d'atteindre la destination en traversant **le moins de routeurs.**

Dans ce protocole, **la meilleure route à prendre est celle qui demandera le moins de sauts entre le routeur de départ et le routeur d'arrivée.**

Le protocole RIP est **aujourd'hui très rarement utilisé** dans les grandes infrastructures. En effet, il génère, du fait de l'envoi périodique de message, **un trafic réseau important** (surtout si les tables de routages contiennent beaucoup d'entrées). De plus, le protocole RIP est **limité à 15 sauts** (on traverse au maximum 15 routeurs pour atteindre sa destination). On lui préfère donc souvent le protocole OSPF. J'ai d'ailleurs étudié récemment cet autre protocle de routage dynamique, vous pouvez retrouver l'article en [cliquant ici](../protocol-ospf/) !

# Travail Pratique

Nous débutons donc notre simulation avec ce réseau, auquel **aucun protocole de routage** n’est défini entre les routeurs.
![](https://mellaza.tech/img/protocol_rip_img/rip_img1.png)

On choisit d’ouvrir l’invite de commandes du Routeur 0 et de taper les commandes suivantes :
```
Router#enable
Router#config t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#router rip
Router(config-router)#version 2
Router(config-router)#network 198.168.0.0
Router(config-router)#network 10.0.0.0
Router(config-router)#network 10.0.0.4
Router(config-router)#network 10.0.0.12
```
La première ligne permettant de passer en mode administrateur du routeur, puis la deuxième permettant de passer en mode « configuration » de ce dernier.
Enfin nous pouvons définir le protocole de routage RIP en renseignement les quatre réseaux se trouvant autour du Routeur 0 :
* 198.168.0.0 (à sa gauche)
* 10.0.0.0 (au-dessus de lui)
* 10.0.0.4 (à sa droite)
* 10.0.0.12 (en dessous de lui)

En lançant le mode simulation, on constate que les premiers paquets orange émis par le nouveau protocole du routeur apparaissent bien comme prévu :
![|inline](https://mellaza.tech/img/protocol_rip_img/rip_img2.jpg)

Après un reset de la simulation, les quatre paquets bleus nous intéressant apparaissent à leur tour :
![|inline](https://mellaza.tech/img/protocol_rip_img/rip_img3.jpg)

*Il s'agit des messages suivants :*
| **Numéro de message** |   **Adresse source**   |   **Adresse destination**   |   **Route annoncée 1 et métrique**   |    **Route annoncée 2 et métrique**   |   **Route annoncée 3 et métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| 1 (haut gauche)       |   ```192.168.0.254```  |        ```224.0.0.9```      | ```10.0.0.0/8 METRIC : 1```| ```Aucune```| ```Aucune```|
| 2 (haut droite)       |   ```10.0.0.1```  |        ```224.0.0.9```      | ```10.0.0.4/30 METRIC : 1```| ```10.0.0.12/30 METRIC : 1```| ```192.168.0.0/24 METRIC : 1```|
| 3 (bas gauche)        |   ```10.0.0.5```  |        ```224.0.0.9```      | ```10.0.0.0/30 METRIC : 1```| ```10.0.0.12/30 METRIC : 1```| ```192.168.0.0/24 METRIC : 1```|
| 4 (bas droite)       |   ```10.0.0.13```  |        ```224.0.0.9```      | ```10.0.0.0/30 METRIC : 1```| ```10.0.0.4/30 METRIC : 1```| ```192.168.0.0/24 METRIC : 1```|

A noter qu’il est tout à fait normal que l’adresse de destination soit « **224.0.0.9** » car il s’agitde l’**adresse de multicast dédiée au protocole RIP de seconde génération.**

On peut vérifier cela dans le document officiel « [*IPv4 Multicast Address Space Registry*](https://www.iana.org/assignments/multicast-addresses/multicast-addresses.xml) » :
![|inline](https://mellaza.tech/img/protocol_rip_img/rip_img4.jpg)

Les paquets ne sont pas récupérés par les machines adjacentes car comme on peut le lire dans l’onglet « *OSI model* » :

« ```The receiving port's IP address is invalid or its network is not configured for RIP. The device drops the packet.``` »

En réalité, ce qu’il se passe c’est que **le réseau n’a pas était configuré pour recevoir et interpréter le protocole RIP, entraînant la perte du paquet transmit.**
On doit donc configurer un second routeur adjacent au routeur 0 pour **créer une véritable communication entre eux !**

On configure donc le protocole RIP sur le routeur 1 par exemple.
On réalise la commande « ```show ip route``` » dans l’interface de Routeur 1 pour **connaître les différents réseaux connectés à ce dernier**, et voici le résultat :
```
C 10.0.0.0 is directly connected, FastEthernet1/0
C 10.0.0.8 is directly connected, FastEthernet2/0
C 192.168.1.0/24 is directly connected, FastEthernet0/0
```

Nous avons donc trois réseaux directement connectés au routeur 1 que le routage RIP
devra prendre en compte :
* 10.0.0.0
* 10.0.0.8
* 192.168.1.0

En tant qu’administrateur réseau, on configure le routage dynamique pour le Routeur 1 :
```
Router#enable
Router#config t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#router rip
Router(config-router)#version 2
Router(config-router)#network 10.0.0.0
Router(config-router)#network 10.0.0.8
Router(config-router)#network 192.168.1.0
```

On peut refaire un tableau pour **mieux visualiser les paquets émis par le routeur 1**, après configuration du nouveau protocole de routage dynamique :
| **Numéro de message** |   **Adresse source**   |   **Adresse destination**   |   **Route annoncée 1 et métrique**   |    **Route annoncée 2 et métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: |
| 1 (haut gauche)       |   ```192.168.1.254```  |        ```224.0.0.9```      | ```10.0.0.0/8 METRIC : 1```| ```Aucune```|
| 2 (haut droite)       |   ```10.0.0.2```  |        ```224.0.0.9```      | ```10.0.0.8/30 METRIC : 1```| ```192.168.1.0/24 METRIC : 1```|
| 3 (bas gauche)        |   ```10.0.0.9```  |        ```224.0.0.9```      | ```10.0.0.0/30 METRIC : 1```| ```192.168.1.0/24 METRIC : 1```|

Et via l’outil de simulation, on constate que notre configuration de routage dynamique RIP marche à merveille, car **la communication entre le routeur 0 et le routeur 1 est maintenant établie !**
![|inline](https://mellaza.tech/img/protocol_rip_img/rip_img5.jpg)

Nous avons de plus la confirmation textuelle : «```The device receives a RIP RESPONSE.```»

Nous allons dès à présent réaliser les différentes tables de routages, des deux routeurs configurés :

*Routeur 0:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Routeur suivant sur le réseau distant**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| Connected       |   ```10.0.0.0```  |        ```255.255.255.252```      | / | 0| 0|
| Connected       |   ```10.0.0.4```  |        ```255.255.255.252```      | / | 0| 0|
| RIPv2       |   ```10.0.0.8```  |        ```255.255.255.252```      | via ```10.0.0.2``` | 120| 1|
| Connected       |   ```10.0.0.12```  |        ```255.255.255.252```      | / | 0| 0|
| Connected       |   ```192.168.0.0```  |        ```255.255.255.0```      | / | 0| 0|
| RIPv2       |   ```192.168.1.0```  |        ```255.255.255.0```      | via ```10.0.0.2``` | 120| 1|

*Routeur 1:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Routeur suivant sur le réseau distant**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| Connected       |   ```10.0.0.0```  |        ```255.255.255.252```      | / | 0| 0|
| RIPv2       |   ```10.0.0.4```  |        ```255.255.255.252```      | via ```10.0.0.1``` | 120| 1|
| Connected       |   ```10.0.0.8```  |        ```255.255.255.252```      | / | 0| 0|
| RIPv2       |   ```10.0.0.12```  |        ```255.255.255.252```      | via ```10.0.0.1``` | 120| 1|
| RIPv2       |   ```192.168.0.0```  |        ```255.255.255.0```      | via ```10.0.0.1``` | 120| 1|
| Connected       |   ```192.168.1.0```  |        ```255.255.255.0```      | / | 0| 0|

Maintenant que la configuration de protocole RIP sur des routeurs est acquise, nous allons chercher à **étendre notre réseau en configurant les sous-réseaux 192.168.2.0 et 192.168.3.0**

**On ajoute les réseaux 192.168.2.0 et 192.168.3.0 signifiants que les tables de routages des 4 routeurs vont être modifiées pour atteindre les nouvelles destinations :**

*Par exemple, si notre paquet veut atteindre le réseau inter-routeur 10.0.0.8, alors il a maintenant deux routes différentes possibles : via 10.0.0.2 ou 10.0.0.6 !*

Voici les nouvelles tables de routages :

*Routeur 0:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Routeur suivant sur le réseau distant**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| Connected       |   ```10.0.0.0```  |        ```255.255.255.252```      | / | 0| 0|
| Connected       |   ```10.0.0.4```  |        ```255.255.255.252```      | / | 0| 0|
| RIPv2       |   ```10.0.0.8```  |        ```255.255.255.252```      | via ```10.0.0.2``` **ou** ```10.0.0.6``` | 120| 1|
| Connected       |   ```10.0.0.12```  |        ```255.255.255.252```      | / | 0| 0|
| RIPv2       |   ```10.0.0.16```  |        ```255.255.255.252```      | via ```10.0.0.6``` **ou** ```10.0.0.14``` | 120| 1|
| Connected       |   ```192.168.0.0```  |        ```255.255.255.0```      | / | 0| 0|
| RIPv2       |   ```192.168.1.0```  |        ```255.255.255.0```      | via ```10.0.0.2``` | 120| 1|
| RIPv2       |   ```192.168.2.0```  |        ```255.255.255.0```      | via ```10.0.0.6``` | 120| 1|
| RIPv2       |   ```192.168.3.0```  |        ```255.255.255.0```      | via ```10.0.0.14``` | 120| 1|

*Routeur 1:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Routeur suivant sur le réseau distant**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| Connected       |   ```10.0.0.0```  |        ```255.255.255.252```      | / | 0| 0|
| RIPv2       |   ```10.0.0.4```  |        ```255.255.255.252```      | via ```10.0.0.1``` **ou** ```10.0.0.10``` | 120| 1|
| Connected       |   ```10.0.0.8```  |        ```255.255.255.252```      | / | 0| 0|
| RIPv2       |   ```10.0.0.12```  |        ```255.255.255.252```      | via ```10.0.0.1``` | 120| 1|
| RIPv2       |   ```10.0.0.16```  |        ```255.255.255.252```      | via ```10.0.0.10``` | 120| 1|
| RIPv2       |   ```192.168.0.0```  |        ```255.255.255.0```      | via ```10.0.0.1``` | 120| 1|
| Connected       |   ```192.168.1.0```  |        ```255.255.255.0```      | / | 0| 0|
| RIPv2       |   ```192.168.2.0```  |        ```255.255.255.0```      | via ```10.0.0.10``` | 120| 1|
| RIPv2       |   ```192.168.3.0```  |        ```255.255.255.0```      | via ```10.0.0.1``` **ou** ```10.0.0.10``` | 120| 2|

*Routeur 2:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Routeur suivant sur le réseau distant**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| RIPv2       |   ```10.0.0.0```  |        ```255.255.255.252```      | via ```10.0.0.9``` **ou** ```10.0.0.5``` | 120| 1|
| Connected       |   ```10.0.0.4```  |        ```255.255.255.252```      | / | 0| 0|
| Connected       |   ```10.0.0.8```  |        ```255.255.255.252```      | / | 0| 0|
| RIPv2       |   ```10.0.0.12```  |        ```255.255.255.252```      | via ```10.0.0.18``` **ou** ```10.0.0.5``` | 120| 1|
| Connected       |   ```10.0.0.16```  |        ```255.255.255.252```      | / | 0| 0|
| RIPv2       |   ```192.168.0.0```  |        ```255.255.255.0```      | via ```10.0.0.5``` | 120| 1|
| RIPv2       |   ```192.168.1.0```  |        ```255.255.255.0```      | via ```10.0.0.9``` | 120| 1|
| Connected       |   ```192.168.2.0```  |        ```255.255.255.0```      | / | 0| 0|
| RIPv2       |   ```192.168.3.0```  |        ```255.255.255.0```      | via ```10.0.0.18``` | 120| 1|

*Routeur 3:*
| **Protocole** |   **Réseau de destination**   |   **Masque du réseau de destination**   |   **Routeur suivant sur le réseau distant**   |    **Distance Administrative**   |   **Métrique**   |
| --------------------- | :--------------------: | :-------------------------: | :----------------------------------: | :----------------------------------: | :----------------------------------: |
| RIPv2       |   ```10.0.0.0```  |        ```255.255.255.252```      | via ```10.0.0.13``` | 120| 1|
| RIPv2       |   ```10.0.0.4```  |        ```255.255.255.252```      | via ```10.0.0.13``` **ou** ```10.0.0.17``` | 120| 1|
| RIPv2       |   ```10.0.0.8```  |        ```255.255.255.252```      | via ```10.0.0.17``` | 120| 1|
| Connected       |   ```10.0.0.12```  |        ```255.255.255.252```      | / | 0| 0|
| Connected       |   ```10.0.0.16```  |        ```255.255.255.252```      | / | 0| 0|
| RIPv2       |   ```192.168.0.0```  |        ```255.255.255.0```      | via ```10.0.0.13``` | 120| 1|
| RIPv2       |   ```192.168.1.0```  |        ```255.255.255.0```      | via ```10.0.0.17``` **ou** ```10.0.0.13``` | 120| 2|
| RIPv2       |   ```192.168.2.0```  |        ```255.255.255.0```      | via ```10.0.0.17``` | 120| 1|
| Connected       |   ```192.168.3.0```  |        ```255.255.255.0```      | / | 0| 0|