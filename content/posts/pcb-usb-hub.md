---
title: "Réaliser son propre circuit imprimé de hub USB"
date: 2024-08-26T14:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://github.com/4strium/PCB-USB-hub/raw/main/pcb_view.png?raw=true'
tags: ["Electronic", "PCB", "schematic"]
theme: "dark"
---

![](https://github.com/4strium/PCB-USB-hub/raw/main/3d_view.png?raw=true)

# Introduction 
La conception de circuit imprimé (PCB) est un domaine tout aussi fascinant qu'effrayant pour un novice en la matière comme moi. Heureusement de nombreux logiciels nous simplifient grandement la tâche pour nous concentrer entièrement sur la sélection, l'arrangement et le câblage des différents composants. Je me suis tout d'abord basé sur ce tutoriel du Hackclub pour réaliser les fondations du projet : [https://jams.hackclub.com/batch/usb-hub](https://jams.hackclub.com/batch/usb-hub).

# Composants sur [JLCPCB](https://jlcpcb.com/)

|**Nom**    | **Identifiants sur le schéma** | **ID sur JLCPCB** |
|:--:|:---: | :---: |
| **Capacité 10uF**   | ```C1,C2,C3,C4,C5,C6,C7,C8``` | `C19702` |
| **Diode**   | ```D1``` | ```C48192``` |
| **Résistances 5.1kΩ**   | ```R1,R2``` | ```C25905``` |
| **Convertisseur USB SL2.1A**   | ```U1``` | ```C192893``` |
| **Micro USB Femelle**   | ```MICRO-USB``` | ```C10418``` |
| **USB-C Femelle GT-USB-7100A**   | ```USB-C``` | ```C7469646``` |
| **USB-A Femelle AF-90**   | ```USB-A-F1,USB-A-F2``` | ```C46407``` |
| **USB-A Male**   | ```USB-A``` | ```C98125``` |

# Schéma 
Vous pouvez réaliser les branchements et le positionnement des composants de cette manière :

![](https://github.com/4strium/PCB-USB-hub/raw/main/sheet_view.png?raw=true)


# Conception du circuit
Vous pouvez agencer le circuit imprimé de cette manière :

![](https://github.com/4strium/PCB-USB-hub/raw/main/pcb_view.png?raw=true)

# Fichiers

Les différents fichiers sont disponibles au téléchargement à cette adresse : [https://github.com/4strium/PCB-USB-hub](https://github.com/4strium/PCB-USB-hub)