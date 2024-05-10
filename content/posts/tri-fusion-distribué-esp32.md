---
title: "Distribuer le tri fusion sur des "System on a Chip""
date: 2024-05-10T18:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/esp32-merge-sort/cover-esp32.jpg'
tags: ["ESP32", "Electronic", "SoC"]
theme: "light"
---

# Introduction
Il était sans l'ombre d'un doute passionnant [d'implémenter le tri-fusion en *multi-threading*](https://romainmellaza.fr/posts/merge-multithreading/) car cela nous a donné des résultats intéressants et variables selon des propriétés données. On peut à présent s'enfouir un peu plus dans ce domaine en implémentant le tri fusion de [**manière distribué**](https://aws.amazon.com/fr/what-is/distributed-computing/) des [ESP32](https://fr.wikipedia.org/wiki/ESP32) qui sont de magnifiques ["System on a Chip" (SoC)](https://fr.wikipedia.org/wiki/Syst%C3%A8me_sur_une_puce) endurants et emportant une grande quantité de fonctionnalités tels que le [Bluetooth](https://fr.wikipedia.org/wiki/Bluetooth) ou le [WiFi](https://fr.wikipedia.org/wiki/Wi-Fi) mais aussi des protocoles filaires moins connus tels que [SPI](https://fr.wikipedia.org/wiki/Serial_Peripheral_Interface) ou [I2C](https://fr.wikipedia.org/wiki/I2C),qui sont tout aussi utiles.

# Mise en situation
La situation est la suivante : on dispose de deux ESP32, on souhaite générer un tableau contenant *n-éléments* aléatoires. On divise ensuite le tableau en deux parties égales, on demande au premier microcontrôleur de trier (via tri-fusion) la première partie du tableau, et au second de traiter la deuxième partie. Puis on récupère les deux parties triées pour les fusionner. On a dans un premier temps réalisé les branchements nécessaires à l'utilisation de la liaison SPI mais on s'est assez rapidement confronté à un problème qui peut — au premier abord — paraître anodin mais qui est à la souche de ce type de projet : **LA SYNCHRONISATION**.

# La synchronisation
Ici le soucis est que nous avons aucune preuve formelle permettant d'affirmer que les deux tris locaux vont se réaliser en un temps rigoureusement identique. On ne peut donc pas demander au premier ESP32 de lire les données reçues du second microcontrôleur alors que ce dernier a peut-être déjà terminé et transmis sans que personne ne l'écoute, ou alors il est entrain de transmettre le 79ème élément de son tableau (*on a donc perdu les 78 éléments précédents*), ou bien il n'a pas encore terminé son tri. En d'autres termes, pour une bonne compréhension collective, lorsqu'un MCU parle l'autre l'écoute, et inversement, mais les deux ne peuvent pas faire la même chose en même temps.

# Les architectures "maître-esclave(s)"
Heureusement une solution existe pour ce type de problématique, il s'agit des dispostions "maître-esclave(s)". Derrière ce terme barbare se cache en réalité un système simple à comprendre : **on demande à un unique système de prendre le contrôle sur ses commpères.** Le périphérique dit "maître" peut alors demander aux périphériques dits "esclaves" à ce que l'on l'écoute mais aussi à ce que l'on lui parle. Cela permet d'éviter la cacophonie précédente.

# Programmation (*framework Arduino*)
## Initialiser une liaison I2C
On choisi par simpliciter de s'orienter vers le protocole I2C, utilisant le *framework propre à Arduino* on a donc la configuration suivante pour les deux SoC :

```
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 9600
```

Côté esclave on doit initialiser la liaison ainsi que définir une fonction à exécuter lorsque le maître lui transmet des informations (*on l'appellera* `receiveEvent`), mais aussi lorsque ce dernier demande des informations (*on l'appellera* `send_int_tab`).

On se retrouve donc avec les fonctions suivantes :

`receiveEvent` (+ `add2tab`) :
```cpp
void add2tab(byte x) {
  Serial.print("Received byte: ");
  Serial.println(x);
  arr_export[ind-1] = (int)x;
  ind++;
      
  if ((ind-1) == size_arr) {
    print_array(arr_export,ind-1);
    tri_fusion(arr_export,0,size_arr-1);
    print_array(arr_export,ind-1);
    ind = 0;
    tab_rens = true;
  }
}

void receiveEvent(int Numbytes){
  int verif4 = 0;

  
  ind_resp = 0;

  while (0 < Wire.available()) {
    byte x = Wire.read();
    // Process the received byte here
      
    if (verif4 == 0){
      if (ind==0){
        Serial.print("Taille du tableau : ");
        Serial.println(x);
        size_arr = (int)x;

        ind++;

        int* temp = (int*)realloc(arr_export, size_arr * sizeof(int));
        arr_export = temp;
      }

      else{
        add2tab(x);
      }

      verif4++;
    }
  }
}
```

`send_int_tab` :
```cpp
void send_int_tab(){

  if (tab_rens){
      int data_exp = arr_export[ind_resp];
      Wire.write(data_exp);
      ind_resp++;
  }
}
```

`Setup` :
```cpp
#include <Arduino.h>

// Include Arduino Wire library for I2C
#include <Wire.h>

// Define Slave I2C Address
#define SLAVE_ADDR 9

// Global :
int ind = 0;
int size_arr;
bool tab_rens = false;
int ind_resp = 0;

int* arr_export = (int*)malloc(sizeof(int)*10);

void setup() {
  // Initialize I2C communications as Slave
  Wire.begin(SLAVE_ADDR);
  
  // Function to run when data requested from master
  Wire.onRequest(send_int_tab); 
  
  // Function to run when data received from master
  Wire.onReceive(receiveEvent);
  
  // Setup Serial Monitor 
  Serial.begin(9600);
  Serial.println("I2C Slave Demonstration");
}

void loop() {}
```

Côté maître, on doit pouvoir générer un tableau d'entiers aléatoires :
```c
int* gen_tableau_aleatoires(int n, int rand_coeff) {
  int *arr_gen = malloc(sizeof(int) * n);
  for (int i = 0; i < n; i++) {
    arr_gen[i] = rand() % rand_coeff;
  }
  return arr_gen;
}
```

De même, on doit pouvoir fusionner les deux parties à la fin des deux exécutions locales :
```c
void fusionner_tableaux(int tab_inp_1[], int size_1, int tab_inp_2[], int size_2, int tab3_exp[]) {
  int i = 0, j = 0, k = 0;

  // Fusionner les éléments des deux tableaux jusqu'à ce que l'un soit épuisé
  while (j < size_1 && k < size_2) {
    if (tab_inp_1[j] <= tab_inp_2[k]){
      tab3_exp[i] = tab_inp_1[j];
      j++;
    }
    else {
      tab3_exp[i] = tab_inp_2[k];
      k++;
    }
    i++;
  }

  // Copier les éléments restants du premier tableau, s'il en reste
  while (j < size_1) {
    tab3_exp[i] = tab_inp_1[j];
    j++;
    i++;
  }

  // Copier les éléments restants du second tableau, s'il en reste
  while (k < size_2) {
    tab3_exp[i] = tab_inp_2[k];
    k++;
    i++;
  }
}
```

`Setup du master` :
```cpp
void setup() {
  Serial.begin(9600);

  srand(time(NULL));

  // Initialize I2C communications as Master
  Wire.begin();
  
  // Setup serial monitor
  Serial.println("I2C Master Demonstration");
  
  int* init_tab = gen_tableau_aleatoires(tab_size,rand_coeff);
  int** dooble_mid_arr = get_mid(tab_size, init_tab);

  print_array(dooble_mid_arr[1], (tab_size/2));
  send_int_tab(tab_size, dooble_mid_arr[1]);

  tri_fusion(dooble_mid_arr[0],0,(tab_size/2)-1);

  delay(tab_size*10);

  for (int response = 0 ; response < (tab_size/2)+1; response++){
    Wire.requestFrom(SLAVE_ADDR, 1); // Request data from Slave
    if (response > 0){
      add2tab(Wire.read(), dooble_mid_arr[1]);
    }
    delay(100);
  }

  delay(5);

  fusionner_tableaux(dooble_mid_arr[0],(tab_size/2),dooble_mid_arr[1],(tab_size/2),init_tab);

  print_array(init_tab,tab_size);
}
```