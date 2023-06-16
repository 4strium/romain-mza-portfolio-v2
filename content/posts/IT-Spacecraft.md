---
title: "Les technologies embarquées dans les engins spatiaux"
date: 2023-05-17T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/IT_space/rover-mars.jpg'
tags: ["Nouvelles technologies", "Espace", "Futur"]
theme: "dark"
---

![Image d'illustration d'un rover martien|wide](https://romainmellaza.fr/img/IT_space/rover-mars.jpg)

# Comment peut-on concevoir des logiciels embarqués pour les engins spatiaux qui soient suffisamment fiables pour fonctionner de manière autonome ?
![Réplique de Spoutnik 1|inline](https://romainmellaza.fr/img/IT_space/Sputnik_asm.jpg)

C’est en **1957**, durant la Guerre Froide, qu’est envoyé le **premier satellite artificiel en orbite terrestre**, il se nomme [**Spoutnik**](https://fr.wikipedia.org/wiki/Spoutnik_1) et il comporte déjà un petit détail qui fait toute son importance ! Ce petit détail, c’est que la sphère de **l’engin renferme déjà de l’électronique embarqué.** Il s’agit donc là de la particularité des différents appareils humains envoyés dans l’espace : ils sont en écrasantes majorités équipées d’ordinateur de bord, et ceux du nanosatellite jusqu’à la plus puissante des fusées. En effet **la communication, le recueil d’informations, l’autonomie et la prise de décision** sont primordiales au bon déroulement des missions effectuées par ces engins. Par conséquent, le choix des différents composants et logiciels utilisés est longuement réfléchi et mûri pour être certain que, même à plusieurs milliards de kilomètres de la Terre, **aucun souci technique mettant en péril le fonctionnement du système n’advienne.**

**Nous verrons donc premièrement le processus des ingénieurs en électroniques et informatiques embarqués pour le choix du système d’exploitation. Puis dans un second temps, celui du choix des composants électroniques les plus adaptés au bon déroulement des missions spatiales.**

Le système d’exploitation d’un engin spatial est tout à fait différent des systèmes d’exploitation conventionnels que nous utilisons, vous et moi. Je rappelle dans un premier temps ce qu’est qu’un système d’exploitation (*Operating System en Anglais*), via ce schéma qui est donc spécifique à un satellite par exemple :

![Schéma théorique du fonctionnement logiciel d'un satellite|inline](https://romainmellaza.fr/img/IT_space/schema_1.png)

Les systèmes d’exploitation utilisés dans les engins spatiaux sont ce que l’on appelle des RTOS c’est-à-dire [**Real Time Operating System**](https://fr.wikipedia.org/wiki/Syst%C3%A8me_d%27exploitation_temps_r%C3%A9el), qui sont donc bien différents des systèmes GPOS ([**General Purpose Operating System**](https://fr.wikipedia.org/wiki/Syst%C3%A8me_d%27exploitation)) que nous utilisons quotidiennement. En effet, les RTOS sont basés essentiellement sur ce que l’on appelle des limites critiques de temps, en somme les différents processus doivent être effectués dans un temps très court sous peine d’être stoppé en cas de dépassement de limite. De plus les tâches sont ordonnées de telle sorte que **le délai du changement entre deux tâches est réduit de l’ordre de 70 % par rapport à un système d’exploitation conventionnel.**

Il s’agit du même système opérationnel que l’on peut retrouver sur des systèmes embarqués que ce soit dans le milieu médical, automobile ou aéronautique. En d’autres termes, **tous les milieux où chaque action doit avoir un résultat de manière rapide et sans affranchissement possible.** *On imagine mal une commande électronique de frein qui réagit 10 secondes après que l’utilisateur ait appuyé sur la pédale.*

De plus, ce laps de temps alloué à chaque tâche est **déterminé en amont**, à la milliseconde près, il n’y a donc aucune surprise lors du vol spatial, car les logiciels utilisés dans les missions doivent être composés de **tâches entièrement prévisibles et complètes dans un délai précis. On interdit donc toute allocation dynamique de mémoire, étant donné que l’occupation de chaque case mémoire est déterminée à l’avance.**

Enfin, bien souvent la **redondance** est de mise, avec un traitement interne qui est assuré par trois processeurs indépendant, le système choisi ensuite l’exécution la plus rapide de cette tâche. **C’est donc un équilibre fragile entre la quantité d’énergie disponible et la quantité totale d’énergie dépensée pour assurer la fiabilité extrême de l’engin !**

Pour ce qui est des satellites naviguant en orbite terrestre, certains d’entre eux (comme les satellites « [*Starlink*](https://fr.wikipedia.org/wiki/Starlink) » de la société « [*SpaceX*](https://fr.wikipedia.org/wiki/SpaceX) » par exemple) ont une conception différente, en effet ces derniers naviguent en orbite eux-mêmes, mais **l’effort colossal de calcul informatique ce fait en majeure partie sur Terre.** Cela permet un avantage considérable : si un quelconque problème advient au niveau du programme, ce dernier peut être modifié directement sur Terre. Et ce genre de situation est plus probable que l’on ne le pense, car les radiations solaires sont capables d’inverser les bits, c’est-à-dire qu’un 0 peut se transformer tout seul en 1, et inversement ! En effet, **une simple particule chargée de haute énergie traversant un matériau semi-conducteur est susceptible d’injecter des centaines d’électrons dans la bande de conduction, accroissant le bruit électronique et provoquant un pic de signal capable de fausser les calculs dans un circuit numérique.**

C’est à ce moment précis qu’intervient le choix primordial des composants et de leurs caractéristiques. Il faut réussir à trouver le compromis parfait entre **consommation allégée, performance et robustesse.** Voilà pourquoi le principe de [**radiodurcissement électronique** des composants](https://fr.wikipedia.org/wiki/Durcissement_(%C3%A9lectronique)) est mis en place, il permet une résistance largement accrue face aux rayonnements ionisants. En raison de la complexité de ces adaptations, le développement de tels composants, destinés à un marché de niche, prend du temps et revient cher. C’est la raison pour laquelle ces composants offrent des performances souvent très en retrait par rapport à leurs équivalents contemporains du marché.

À titre d’information, le processeur [**RAD750**](https://fr.wikipedia.org/wiki/RAD750) qui équipe les rovers martiens « [Curiosity](https://fr.wikipedia.org/wiki/Curiosity_(astromobile)) » et « [Perseverance](https://fr.wikipedia.org/wiki/Exploration_de_Mars_par_Perseverance) » a la capacité de supporter **1 000 grays** et de fonctionner entre **−55 °C et 70 °C** avec une consommation **n’excédant pas 5 W** de puissance électrique. Le tout pour la bagatelle de **280 000 euros.**

*Un gray correspond à l’énergie du rayonnement ionisant apportant une énergie d’un joule à un kilogramme de matière. À savoir que 10 grays correspond à la quantité maximale de radiation auquel ont été exposé les employés de la centrale nucléaire de Tchernobyl, mais aussi une victime se situant à plus de 1 200 m de la bombe d’Hiroshima.*

**En conclusion, nous avons donc vu que la planification d’une mission spatiale se fait du choix des composants jusqu’à l’ordonnancement des tâches du système, pour éviter toute mésaventure dans les confins de notre système solaire.**