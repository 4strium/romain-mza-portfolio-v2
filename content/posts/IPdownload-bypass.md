---
title: "Bypasser les restrictions d'IP en téléchargement"
date: 2022-10-08T21:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/bypass-IP/cover_switch.png'
tags: ["Réseaux", "Python", "Software"]
theme: "light"
---

*⚠️ Cet article n'incite en aucun cas à des téléchargements de contenus illégaux, il met seulement en avant un outil parfaitement légal permettant par technique de connexion/déconnexion de changer d'adresse IP dynamique, dans le but de contourner les temps d'attente sur certains sites. ⚠️*

S'il vous est déjà arriver de télécharger quelconque fichier sur des sites de (téléchargement direct)[https://fr.wikipedia.org/wiki/T%C3%A9l%C3%A9chargement_direct] (*1fichier, DDownload, Rapidgator, etc...*) vous avez sans aucun doute été ennuyé par les temps d'attente entre deux téléchargements ! Par exemple sur la plateforme [*1fichier*](https://1fichier.com/) le temps d'attente est de plus d'une heure :

![|inline](https://romainmellaza.fr/img/bypass-IP/wait.png)

# La Méthode

La méthode est extrêmement simple. Suite au premier téléchargement, si vous souhaitez télécharger un second fichier (*voir plus...*) dans la foulée, alors suivez les étapes suivantes :
* Se rendre dans les paramètres de son système d'exploitation (*ici Windows 11*), puis dans l'onglet "**Paramètres réseaux avancés**"
![|inline](https://romainmellaza.fr/img/bypass-IP/etape1.png)

* Déactiver la connexion Internet courante, ici Ethernet.
* Attendre une dizaine de secondes.
* Réactiver la connexion Internet.
* Recharger la page de téléchargement.

# Automatiser le processus

Cette méthode peut paraître efficace au premier abord mais lorsque le fichier total que vous souhaitez télécharger et décomposé en une centaine de sous-fichiers cela devient vite pénible de rester attendre chaque fin de téléchargement pour effectuer la manipulation.

C'est pourquoi je vais vous fournir un moyen d'automatiser cela !

# Pré-requis 

Vous allez devoir télécharger :
* **Python** -> https://www.python.org/downloads/
* **JDownloader 2** -> https://jdownloader.org/fr/download/index
* **Ce script codé par mes soins** -> https://github.com/4strium/1fichier-bypass/raw/main/main.py

Je vous conseille vivement de créer un dossier ``JD_script`` dans votre répertoire ``Documents`` (par exemple) et d'y placer le script python.

Ouvrez maintenant les paramètres de JDownloader, puis rendez-vous dans le deuxième onglet à gauche : "Reconnexion". Cochez les trois premières options et dans le menu déroulant sélectionnez ``Script externe de reconnexion``. Dans l'invite ``Interprète`` écrivez ``cmd /c``.

![|inline](https://romainmellaza.fr/img/bypass-IP/etape2.png)

Puis dans ``Script Batch`` : ``py ./1fichier_bypass.py`` et enfin dans ``Démarrer dans le répertoire de l'application`` renseignez ``C:\Users\<votre nom d'utilisateur>\Documents\JD_script`` (n'omettez pas de remplacer dans le path ``<votre nom d'utilisateur>`` par votre nom d'utilisateur, visible dans le terminal par exemple).

**Voilà vous devez maintenant obtenir une configuration qui ressemble à ça ⬇️**
![|inline](https://romainmellaza.fr/img/bypass-IP/etape3.png)

**IL EST NÉCESSAIRE DE TOUJOURS LANCER JDOWNLOADER EN TANT QU'ADMINISTRATEUR, ÉTANT DONNÉ QUE LA GESTION AVANCÉE DU SERVICE RÉSEAU LEUR EST RÉSERVÉE !!**
# Conclusion
Vous avez maintenant en votre possession un moyen très efficace pour télécharger de très grandes quantités de fichier sans **aucunes restrictions**. Je vous laisse prendre en main JDonwloader qui est de base l'un des outils les plus performants pour réaliser des téléchargement directs (DDL).