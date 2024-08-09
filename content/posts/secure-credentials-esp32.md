---
title: "[Cristal] Secure credentials in your IOT projects"
date: 2024-08-02T18:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/cover-images/hacking.jpg'
tags: ["Electronic", "C++", "esp32"]
theme: "light"
---

# Introduction
If you have followed the [various previous tutorials concerning the development of the personal assistant on an esp32](https://romainmellaza.fr/posts/diy-home-assistant/), you will agree that the security and confidentiality of the different requests between the SoC and the server is **CRUCIAL**. Indeed, we do not want a person outside the system to be able to interfere with our actions by recovering our API key or even worse by having access to our Google Home account.

This is why you should never define a secret key raw in your code, and even less so when it is published publicly in an online repository. The solution that I am proposing to you today for esp32/arduino is to store this confidential data in a text file (which you name `secret_file.txt`) on a micro SD card connected to your SoC, you must therefore have physical contact with the device to recover this precious data.

Write each code on a different line because it is the line number that will allow each code to be distinctly identified!

Ok now let's see how to recover the secret keys to use them in your program.

# Programming
The function is quite simple, we first define two constants, the first is the maximum number of different keys recorded in your text file, the second is the maximum number of characters for each secret code. So define these constants according to your specific usage.

```cpp
#include <SPI.h>
#include <SD.h>

const int maxLignes = 6; // Nombre maximum de lignes à lire
const int tailleMaxLigne = 130; // Taille maximale de chaque ligne

char* get_secret(int indice) {

  if (!SD.begin()) {
    Serial.println("Erreur d'initialisation de la carte SD!");
    return nullptr;
  }
  Serial.println("Carte SD initialisée.");

  File myFile = SD.open("/secret_file.txt");
  char* lignes[maxLignes]; // Tableau de pointeurs pour stocker les lignes

  if (myFile) {
    Serial.println("Lecture du fichier secret_file.txt...");

    int ligneIndex = 0;
    while (ligneIndex < maxLignes && myFile.available()) {
      char buffer[tailleMaxLigne]; // Tampon pour lire une ligne
      int i = 0;

      // Lire la ligne jusqu'à un retour à la ligne ou jusqu'à la fin du tampon
      while (myFile.available() && i < tailleMaxLigne - 1) {
        char c = myFile.read();
        if (c == '\n') {
          break;
        }
        buffer[i++] = c;
      }
      buffer[i] = '\0'; // Terminer la chaîne

      // Nettoyer les espaces blancs et retours chariot en début et en fin de chaîne
      char* debut = buffer;
      while (isspace((unsigned char)*debut)) debut++; // Supprimer les espaces et retours chariot en début

      char* fin = debut + strlen(debut) - 1;
      while (fin > debut && (isspace((unsigned char)*fin) || *fin == '\r')) fin--; // Supprimer les espaces et retours chariot en fin
      *(fin + 1) = '\0'; // Terminer la chaîne

      // Allouer la mémoire pour la ligne et copier le contenu du tampon
      lignes[ligneIndex] = (char*)malloc(strlen(buffer) + 1);
      if (lignes[ligneIndex]) {
        strcpy(lignes[ligneIndex], buffer);
        ligneIndex++;
      }
    }

    myFile.close();
  } else {
    Serial.println("Impossible d'ouvrir le fichier secret_file.txt");
  }

  return lignes[indice];
}
```

You see that the character string is of type `char*` but you can easily convert it to type `String` depending on the future use that you reserve for the secret key. To obtain the secret key listed in the 4th line for example, simply call `get_secret(4)`.