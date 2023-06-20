---
title: "Aéronautique : Atterrissage autonome"
date: 2023-06-19T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/cover-images/a350-landing.jpg'
tags: ["Aviation", "Nouvelles technologies", "Futur"]
theme: "dark"
---

![Un Airbus A350, trains d’atterrissage sortis|wide](https://romainmellaza.fr/img/cover-images/a350-landing.jpg)

Depuis le [**premier vol motorisé d’un appareil plus lourd que l’air en 1890**](https://fr.wikipedia.org/wiki/%C3%89ole_(avion)), l’aéronautique n’a de cesse d’évoluer en fonction des enjeux de demain. De nos jours, avec l’essor actuel de l’intelligence artificielle, l’aviation autonome n’est plus un mythe mais bien une réalité ! D’autant plus que [selon un rapport du GIEC datant de 1999, une optimisation du trafic aérien permettrait d’**économiser 8 à 18 % de kérosène.**](https://fr.wikipedia.org/wiki/Gestion_du_trafic_a%C3%A9rien#Impact_environnemental)

**Nous allons donc voir ensemble comment est-il possible d’estimer précisément la distance à laquelle l’aéronef se situe de son point de toucher sur la piste, pour agir en conséquence sur les commandes de l’appareil.** On peut décomposer cette recherche de l'atterrissage autonome en plusieurs étapes :
1. Calcul de l’altitude grâce à la pression statique
2. Anticipation de l'approche
3. Toucher en toute autonomie au moyen du système [ILS](https://fr.wikipedia.org/wiki/Syst%C3%A8me_d%27atterrissage_aux_instruments)

# Calcul de l’altitude grâce à la [pression statique](https://fr.wikipedia.org/wiki/Pression_statique)
Tout au long de cet exposé nous prendrons l’exemple d’un [**Airbus A350**](https://fr.wikipedia.org/wiki/Airbus_A350_XWB) dont l'objectif est d'atterrir sur **la piste numéro 2 de l’[aéroport Roissy Charles de Gaulle](https://fr.wikipedia.org/wiki/A%C3%A9roport_de_Paris-Charles-de-Gaulle)**. A savoir que cet aéroport dispose de 4 pistes différentes, par conséquent il est primordial de ne pas les confondre.

Donc imaginons que nous mesurons une pression de **177 millibars/hectopascals** via la sonde positionnée au niveau de la cabine, nous cherchons donc à déterminer l’altitude de notre aéronef en pied grâce à cette constatation.

On utilise la formule suivante → **Altitude (en [ft.](https://fr.wikipedia.org/wiki/Pied_(unit%C3%A9)))** :
![Formule permettant de convertir une pression statique mesurée en une altitude|inline](https://romainmellaza.fr/img/autonomous-landing/static-pressure-equation.png)

En y injectant notre valeur de 177 millibars, on obtient une altitude d’environ **41 000 pieds.** Le pied et le mile nautique sont les unités internationales de longueurs utilisées dans le secteur aéronautique, mais pour simplifier la compréhension de cette présentation **nous utiliserons le mètre à partir de maintenant.**

On doit donc convertir notre résultat de **41 000 pieds en m, en multipliant cette valeur par 0.3048, ce qui nous permet d’obtenir une altitude d’environ 12 500 mètres !**

# Anticipation de l'approche
En modélisant une approche constante et alignée avec la piste, il est possible de connaître précisément à quelle distance de notre point de toucher l’avion doit initier sa descente.

Pour cela il faut représenter **un triangle rectangle où, tout d’abord, notre angle Alpha sera l’angle de descente, c’est-à-dire 3° ici** (*comme préconisé par l’[Organisation de l'aviation civile internationale](https://fr.wikipedia.org/wiki/Organisation_de_l%27aviation_civile_internationale)*). **Et donc par rapport à cet angle nous aurons le côté qui y est opposé, autrement dit l'altitude que nous venons de calculer, et le côté adjacent à l’angle alpha qui est donc la longueur que l’on cherche à calculer.**

En utilisant une relation trigonométrique, on calcule la distance recherchée via la formule suivante :
![Formule permettant d’obtenir la distance (au niveau du sol) entre l’aéronef et son point de toucher|inline](https://romainmellaza.fr/img/autonomous-landing/distance-GPS-altitude.png)

**En l'occurrence, avec notre altitude de 12 500 m calculé, on peut estimer que notre Airbus A350 doit entamer sa descente lorsqu’il se situera à 238 514 m de son point de toucher sur la piste.**

# Toucher en tout autonomie au moyen de l’[Instrument Landing System](https://fr.wikipedia.org/wiki/Syst%C3%A8me_d%27atterrissage_aux_instruments)
![Représentation complète d’un système ILS en 3D](https://romainmellaza.fr/img/autonomous-landing/ILS_schema.png)

**Pour synthétiser simplement le fonctionnement du système d'atterrissage aux instruments, il faut savoir que ce système est composé de deux éléments complémentaires :**
* Le “**Localizer**” qui est une antenne située au fond de la piste, cette dernière émet **deux signaux sur un plan horizontal, un à 90Hz vers la gauche de la piste, et un à 150Hz vers la droite de la piste. Le chevauchement des deux fréquences est représenté par le plan rouge sur mon schéma ci-dessus. L’avion doit donc suivre cet axe horizontalement.**
* Le “**Glideslope**” qui est également une antenne, **positionnée à environ 300m** du début de la piste et qui permet cette fois-ci **le positionnement vertical de l’aéronef en utilisant exactement le même processus de chevauchement de fréquences. Toujours sur le schéma ci-dessus l’avion doit donc suivre le plan vert, pour atterrir en douceur.**

![Illustration des émissions de l’alignement de piste et de l’alignement de descente ILS. © Fred the Oyster|inline](https://romainmellaza.fr/img/autonomous-landing/ILS_localizer_glideslope_illustration.png)

**Enfin, en combinant ces deux axes, on obtient une trajectoire parfaite d’atterrissage !**

En conclusion, nous avons vu comment optimiser l’atterrissage d’un aéronef lorsqu'il se trouve encore en altitude de croisière jusqu’aux derniers mètres le séparant de la piste. Cela ne fait guère de doutes que ces méthodes sont et seront des applications pour **garantir la sûreté et la simplicité des atterrissage dans le futur.**