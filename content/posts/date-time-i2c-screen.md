---
title: "[Cristal] How to display date/time on a I2C screen ?"
date: 2024-08-05T18:39:07+01:00
draft: true
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/cristal-home-assistant/pres3.jpg'
tags: ["Electronic", "C++", "esp32"]
theme: "light"
---

# Introduction 
Together we will see how to display live date and time based on GPS coordinates (to get timezone) on an I2C screen. To obtain the information, we will use the [Time Zone Datatbase](https://timezonedb.com/). You will have to create an account on their site to obtain your personal API key.

# Programming
We will use the module [`ArduinoJson`](https://arduinojson.org/), so you need to install it on your project whether you are using the Arduino IDE or PlatformIO.

```h
#ifndef DATET_H_
#define DATET_H_

#include <Arduino.h>

String init_http_dt(void);
String get_date(void);
String get_time(void);

#endif
```

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <date-heure.h>

String url_dt = "http://api.timezonedb.com/v2.1/get-time-zone?key=<your-api-key>&format=json&by=position&lat=<your-latitude>&lng=<your-longitude>";

String init_http_dt(void){
    // Utilisation de la bibliothèque HTTPClient pour effectuer une requête GET
    HTTPClient http;
    http.begin(url_dt); // Début de la requête HTTP

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

}

String get_date(void) {    
    String req_rep = init_http_dt();

    DynamicJsonDocument doc(1024); // Taille du document JSON

    // Désérialiser le JSON
    DeserializationError error = deserializeJson(doc, req_rep);

    // Vérifier s'il y a une erreur lors de la désérialisation
    if (!error) {
        // Extraire la valeur de "formatted"
        String dateTime = doc["formatted"];
        
        // Extraire la date au format YYYY-MM-DD
        String year = dateTime.substring(0, 4);
        String month = dateTime.substring(5, 7);
        String day = dateTime.substring(8, 10);

        // Reformatage en DD-MM-YYYY
        String formattedDate = day + "-" + month + "-" + year;
        return formattedDate;
    } else {
        Serial.println("Erreur lors de la désérialisation du JSON !");
        return "error";
    }
}

String get_time(void) {    
    String req_rep = init_http_dt();

    DynamicJsonDocument doc(1024); // Taille du document JSON

    // Désérialiser le JSON
    DeserializationError error = deserializeJson(doc, req_rep);

    // Vérifier s'il y a une erreur lors de la désérialisation
    if (!error) {
        // Extraire la valeur de "formatted"
        String dateTime = doc["formatted"];
        return dateTime.substring(11,16); // Extraire l'heure (format HH:MM)
    } else {
        Serial.println("Erreur lors de la désérialisation du JSON !");
        return "error";
    }
}
```

```cpp
#include <Arduino.h>
#include <U8g2lib.h>
#include <stdio.h>
#include <Wire.h>
#include <date-heure.h> 
#include <WiFi.h>

#define I2C_SDA 27
#define I2C_SCL 22

U8G2_SH1106_128X64_NONAME_F_HW_I2C u8g2(U8G2_R2, /* reset=*/ U8X8_PIN_NONE);

void print_datetime(){
  u8g2.begin();
  u8g2.clearBuffer();
  u8g2.setFontDirection(2);
  u8g2.enableUTF8Print();

  u8g2.setFont(u8g2_font_logisoso20_tr);
  String timec = get_time();
  u8g2.drawUTF8(96,30,timec.c_str());

  u8g2.setFont(u8g2_font_logisoso18_tr);
  String date = get_date();
  u8g2.drawUTF8(120,2,date.c_str());

  u8g2.sendBuffer();
  delay(8000);
}
```