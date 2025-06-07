---
title: "[Cristal] How to display daily news on a I2C screen ?"
date: 2024-06-30T18:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://mellaza.tech/img/cristal-home-assistant/pres5.jpg'
tags: ["Electronic", "C++", "esp32"]
theme: "light"
---

![](https://i0.wp.com/newsdata.io/blog/wp-content/uploads/2024/01/Snipaste_2021-11-28_13-55-49.jpg?fit=701%2C351&ssl=1)

# Introduction 
Together we will see how to display daily news on an I2C screen. To obtain the information, we will use the [News API](https://newsapi.org/). You will have to create a free account on their site to obtain your personal API key. Don't hesitate to go read the [API documentation](https://newsapi.org/docs), we can make super interesting HTTP requests! Unfortunately the information displayed will not be full live, there is a 24 hour delay, but it allows you to get the most popular information for each country.

# Programming
We will use the module [`ArduinoJson`](https://arduinojson.org/), so you need to install it on your project whether you are using the Arduino IDE or PlatformIO.

We therefore code a simple library allowing us to make the HTTP request allowing us to provide the JSON payload to the API, knowing that the payload is basically quite long with more than twenty different articles returned, so I chose to keep only the 5 most popular french articles of the day (But you can do absolutely whatever you want based on my example) :

* `open-news-api.h` :
```h
#ifndef NEWS_H_
#define NEWS_H_

String init_http_news(void);
String* get_five_top_news(void);

#endif
```

* `open-news-api.cpp` :
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <open-news-api.h>
#include <get_secret_values.h>

#define MAX_TITLES 5

String url_news = "https://newsapi.org/v2/top-headlines?country=fr&sortBy=popularity&apiKey=";

String init_http_news(void){

    String apiKey = get_secret(5);

    // Remove any trailing newline characters
    apiKey.trim();

    // Append the API key to the URL
    url_news += apiKey;

    // Utilisation de la bibliothèque HTTPClient pour effectuer une requête GET
    HTTPClient http;
    http.begin(url_news); // Début de la requête HTTP

    int code = http.GET(); // Effectuer la requête GET
    
    if (code > 0) { // Vérifier si la requête a réussi
    // Obtenir le contenu de la réponse
        String payload = http.getString();
        http.end();
        return payload;
    } else {
        Serial.println("Erreur lors de la requête HTTP !");
        http.end();
        return "error";
    }

    http.end();
}

String* get_five_top_news(void) {
    // Créer un tableau pour stocker les titres
    static String titles[MAX_TITLES];
    for (int i = 0; i < MAX_TITLES; i++) {
        titles[i] = ""; // Initialiser le tableau
    }

    String req_rep = init_http_news();
    
    if (req_rep == "") {
        Serial.println("Aucune réponse reçue !");
        return titles;
    }

    DynamicJsonDocument doc(2048); // Taille du document JSON, ajustez si nécessaire

    // Désérialiser le JSON
    DeserializationError error = deserializeJson(doc, req_rep);
    if (error) {
        Serial.println("Erreur lors de la désérialisation du JSON !");
        return titles;
    }

    // Accéder à la liste des articles
    JsonArray articles = doc["articles"].as<JsonArray>();

    // Extraire les titres des 5 premiers articles
    int count = 0;
    for (JsonObject article : articles) {
        if (count >= MAX_TITLES) break; // Limiter à 5 titres
        const char* title = article["title"];
        if (title) {
            titles[count] = String(title);
            count++;
        }
    }

    // Vérifier s'il y a des titres trouvés
    if (count == 0) {
        titles[0] = "Aucun titre trouvé !";
    }

    return titles;
}
```

If you are wondering what the personal library "get_secret_values" is then head [here](https://mellaza.tech/posts/secure-credentials-esp32/).

# Display on screen

```cpp
#include <Arduino.h>
#include <U8g2lib.h>
#include <stdio.h>
#include <Wire.h>
#include <open-news-api.h>

U8G2_SH1106_128X64_NONAME_F_HW_I2C u8g2(U8G2_R2, /* reset=*/ U8X8_PIN_NONE);

void display_titles() {
    // Obtenir le tableau de titres
    if (titles_news == nullptr){
      titles_news = get_five_top_news();
    }

    u8g2.clearBuffer();
    u8g2.setFlipMode(1); // Activer le mode de retournement pour inverser l'affichage
    u8g2.setFontDirection(0);
    u8g2.enableUTF8Print();
    u8g2.setFont(u8g2_font_ncenB08_tf);

    // Constante pour la largeur de l'écran en pixels
    const int screenWidth = 128; // Largeur de l'écran OLED

    for (int i = 0; i < MAX_TITLES; i++) {
        u8g2.clearBuffer(); // Effacer le tampon de l'écran
        u8g2.setCursor(0, 10); // Position du curseur pour le texte

        // Préparer le titre avec le préfixe "Titre X: "
        String fullTitle = "Titre " + String(i + 1) + ": " + titles_news[i];
        
        // Variables pour gérer les lignes et l'espacement vertical
        int lineHeight = 10; // Hauteur de ligne (ajustez selon la taille de police)
        int yPosition = 10;  // Position initiale en Y

        // Variable pour stocker la largeur courante du texte
        int currentWidth = 0;

        // Diviser le texte en mots pour gérer le retour à la ligne
        char *token = strtok((char *)fullTitle.c_str(), " ");
        while (token != nullptr) {
            String word = String(token) + " ";
            int wordWidth = u8g2.getStrWidth(word.c_str());

            if (currentWidth + wordWidth > screenWidth) {
                // Si le mot ne tient pas sur la ligne actuelle, aller à la ligne suivante
                yPosition += lineHeight;
                u8g2.setCursor(0, yPosition);
                currentWidth = 0;
            }

            // Imprimer le mot courant et mettre à jour la largeur actuelle
            u8g2.print(word);
            currentWidth += wordWidth;

            // Passer au mot suivant
            token = strtok(nullptr, " ");
        }

        u8g2.sendBuffer(); // Envoyer le tampon à l'écran
        delay(DISPLAY_TIME); // Attendre avant d'afficher le titre suivant
    }7
  u8g2.setFlipMode(0);
}
```

You can safely remove `u8g2.setFlipMode()` if your screen is in the opposite direction to mine, it just depends on its orientation in your project.