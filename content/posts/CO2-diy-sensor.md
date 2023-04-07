---
title: "Détecteur connecté de dioxyde de carbone, fait maison !"
date: 2022-05-27T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'img/CO2_Sensor/banner_wide.png'
tags: ["Electronic", "ESP32", "MicroPython"]
theme: "dark"
---
![|wide]('https://romainmellaza.fr/img/CO2_Sensor/banner_wide.png')

# Introduction
![Logo du projet|inline](img/CO2_Sensor/LOGO-v1-blue-rectangle.png)

Le service « SKair », a pour but premier de répondre à un besoin essentiel de la population contemporaine :
* Connaître le taux de CO2 auquel l’utilisateur est exposé.

Le dioxyde de carbone étant un indicateur important de la qualité de l’air !

# Le CO2, un véritable poison
![Symptomatologie et la réponse physiopathologique selon la teneur en CO2 dans l’air inspiré.|inline](img/CO2_Sensor/Taux-risques.png)

# Différents taux de CO2 quotidiens.
Dans le reste du document, nous utiliserons l’unité dite de « **ppm** », c’est-à-dire **partie par million**, c’est un terme beaucoup utilisé en sciences, et il s’agit en réalité de la fraction valant 10⁻⁶, c'est-à-dire un millionième.

![Visualisation de 1%, 1‰, 1‱ et 1 ppm comme étant le point rouge sur le grand cube|inline](https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Visualisation_parts_per.svg/1024px-Visualisation_parts_per.svg.png)

Dans l'air intérieur, le taux de CO2 est compris entre **350 et 2500 ppm** environ.

Dans les écoles, le taux de CO2 est supérieur à **500 ppm** et peut aller jusqu’à **1500 ppm.**

Le Haut conseil de la santé publique recommande de ne pas dépasser le seuil de **800 ppm** de concentration de CO2 dans l’air afin de se protéger contre le virus de la Covid-19.

Dans les salles de sport, le taux de CO2 est compris entre **500 et 800 ppm.**
En effet, les salles de sport sont bien aérées.

Dans les logements, le taux est de **400 à 1 000 ppm.**

# Problématiques 
Obtenir les mesures de manière simple et rapide pour l’utilisateur :
* **CONNECTÉ** : L’utilisateur reçoit les mesures directement sur son smartphone.
* **COMPRÉHENSIBLE** : Pouvoir vérifier le taux de CO2 actuel, d’un seul coup d’oeil !
* **AUTONOME** : L’appareil peut être placé dans n’importe quelle pièce.

# Le choix du microcontrôleur
![|inline](https://m.media-amazon.com/images/I/71Q4jCOGohL._SL1500_.jpg)

[**ESP32 – WROOM**](https://www.espressif.com/en/products/modules/esp32)

*Caractéristiques :*
![|inline](img/CO2_Sensor/Specifications-ESP32.png)

* Une panoplie de fonctionnalités.
* Un coût très faible (~9€).
* La possibilité de contrôler chaque coeur du processeur indépendamment.
* Contrôler la fréquence du module.
* Une flexibilité en termes de programmation (C++, MicroPython, BIN, …)

# Le choix de la transmission via Bluetooth Low Energy (“BLE” ou “Bluetooth Smart”)

En réalité, nous utilisons ce mode de transmission **tous les jours** : *montre, voiture, paiements sans contact, badges, “AirDrop”, objets connectés, …*

Étant donné qu’ici nous recherchons une méthode de transfert peu couteuse en énergie, et qui n’a pour but que de transmettre des entiers (mesures) le [Bluetooth Low Energy](https://fr.wikipedia.org/wiki/Bluetooth_%C3%A0_basse_consommation) nous convient parfaitement !

![Comparatif entre une liaison Bluetooth classique et une liaison “BLE”|inline](img/CO2_Sensor/Documentation.jpg)

# Le choix du langage de programmation
* [**Python**](https://www.python.org/) *(Le langage parfait pour notre projet !)*
* Implémenté dans le proc de la carte ESP32 via [**Micro Python**](https://micropython.org/) (Une implémentation légère et efficace du langage de programmation Python 3 pour fonctionner sur des microcontrôleurs.)

# Flasher le nouveau firmware
Le but de l’opération est de convertir le processeur de la carte (qui est initialement en langage C) au langage Python (et donc par conséquent l’implémentation Micro Python).
1. **Effacement de la mémoire flash de l’ESP32**

En utilisant directement **l’invite de commande sous Windows**, il est possible d’effectuer cette action !

L’outil détecte parfaitement la carte ESP32 que j’ai branchée en **port COM3.**
![Capture d’écran de l’invite de commandes au moment de l’effacement mémoire.|inline](img/CO2_Sensor/Capture.png)
1. **Flasher le micrologiciel « MicroPython » sur ESP32 avec esptool.py**

Dans un premier temps, il est nécessaire de télécharger le code en .bin correspondant à votre carte de développement à l’adresse suivante : [*micropython.org/download/*](https://micropython.org/download/)
![Site de téléchargement officiel|inline](img/CO2_Sensor/Documentation-micro.jpg)

Il ne reste plus qu’à implémenter le programme téléchargé sur la carte !

Pour cela, il suffit juste d’ouvrir une nouvelle invite de commande dans le répertoire où se situe votre code source « **esp32-[…].bin** », le but de la manipulation ici étant de réécrire le nouveau micrologiciel sur la mémoire flash que l’on vient de libérer.

On réalise donc la fonction « ```write_flash``` » dans **l’invite de commande Windows** pour écrire notre micrologiciel sur la carte :
![Capture d’écran de l’invite de commandes au moment du flashage du nouveau firmware.|inline](img/CO2_Sensor/Capture2.png)

Et voilà ! C’est fini !

**Notre micro-processeur fonctionne maintenant avec le langage Python !**

# Les modules externes
* Le capteur CO2 utilisé : [**SGP30**](https://www.kubii.fr/modules-capteurs/2874-capteur-qualite-de-l-air-sgp30-breakout-3272496300705.html)

![SGP30|inline](img/CO2_Sensor/Documentation2.jpg)

* L’indicateur sonore : [**Buzzer passif HW-508**](https://hallroad.org/ky-006-3pin-miniature-passive-buzzer-alarm-sensor-module-in-pakistan.html)

![HW-508|inline](https://hallroad.org/images/thumbnails/500/500/detailed/10/KY-006_3pin_Miniature_Passive_Buzzer_Alarm_Sensor_Module_in_pakistan.jpg)

* Les indicateurs visuels : [**Diodes Électroluminescentes (Bleu, vert, jaune, rouge)**](https://www.amazon.fr/Diodes-Electroluminescentes/b?ie=UTF8&node=10153728031)

![Diodes Électroluminescentes|inline](img/CO2_Sensor/Documentation4.jpg)

* Les résistances : [**4 × 100Ω**](https://composant-electronique.fr/resistance-100-ohms-1-4w-cfr1-4w-100r)

![4 × 100Ω|inline](img/CO2_Sensor/Documentation5.jpg)

* Convertisseur d’alimentation : [**Step-Up Réglable DCDC Commutation Boost Convertisseur Alimentation Module 2-24V à 5V-28V 2A**](https://fr.banggood.com/Geekcreit-DC-2V-24V-To-5V-28V-2A-Step-Up-Boost-Converter-Power-Supply-Module-Adjustable-Regulator-Board-p-1566600.html?cur_warehouse=CN)

![Alimentation Module|inline](img/CO2_Sensor/Documentation6.jpg)

* Chargeur de batterie : [**Micro USB 5V 1A Contrôleur de Charge Lithium Li - ION Module Chargeur de Batterie USB 5V 1A**](https://www.amazon.fr/AZDelivery-TP4056-Micro-USB-Laderegler-Parent/dp/B07Z8D2WH2)

![Chargeur de batterie|inline](img/CO2_Sensor/Documentation7.jpg)

# Branchements
![](img/CO2_Sensor/Capture3.png)
![](img/CO2_Sensor/Capture4.png)
![](img/CO2_Sensor/Capture5.png)

*Sans oublier les différents branchements pour l’acquisition d’énergie de chaque composant du circuit !*

* Montage du circuit de charge avec batterie :

![Si vous souhaitez rendre votre module autonome en énergie !|inline](img/CO2_Sensor/Documentation8.jpg)

# Débouchés possibles
* **Fenêtre Connectée** → Ouvrir les fenêtres quand la concentration de CO2 est trop importante.
* **Système d’alarme** → Alerter le propriétaire quand une personne vulnérable (enfant, personne âgée, …) se trouve dans une pièce polluée.
* **VMC Connectée** → Renouveler l’air intérieur en fonction de la qualité de l’air mesurée par le module.
* **Améliorer notre qualité de vie** → Créer un véritable échantillon de mesures pour connaître quelles pièces sont plus sujettes à être polluées.