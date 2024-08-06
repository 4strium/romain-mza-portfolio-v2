---
title: "How to make a custom home voice personal assistant based on an esp32"
date: 2024-08-06T18:39:07+01:00
draft: true
author: Romain MELLAZA
cover: ''
tags: ["Electronic", "C++", "esp32"]
theme: "light"
---

# Introduction 
This personal project is based on a simple observation: nowadays there are a significant number of voice assistants coupled with numerous tools promising hyper connectivity and boosted productivity. We therefore end up getting lost in all these opaque layers processing our personal data as well as in subscriptions that are often prohibitively expensive compared to the simplicity of the tasks that we want our electronic companion to carry out.

Today I decided to show you in the smallest details how I managed to design *Cristal* a voice assistant which can respond to all your wishes as long as you are ready to fiddle a minimum between the hardware and the software.

# The necessary equipment

![|inline](https://www.gotronic.fr/ori-module-nodemcu-esp32-28407.jpg)
* An [ESP32](https://www.amazon.fr/esp32-wroom/s?k=esp32+wroom) will be the microcontroller of our project! We will take full advantage of its WiFi capacity but also of its integrated ADCs.

![|inline](https://www.az-delivery.de/cdn/shop/products/13-zoll-oled-i2c-128-x-64-pixel-display-kompatibel-mit-arduino-und-raspberry-pi-466478.jpg?v=1679397952&width=1200)
* An [OLED screen (128x64) using the SH1106 chip](https://www.az-delivery.de/en/products/1-3zoll-i2c-oled-display), it will be the main means of feedback with the user.

![|inline](https://www.electronicwings.com/storage/PlatformSection/TopicContent/452/description/MicroSD.jpg)
* A [MicroSD Card Module](https://www.amazon.fr/esp32-sd/s?k=esp32+sd) as well as a microSD card with the smallest capacity you have, in fact it will be useful to us only to temporarily store the audio file recorded by the microphone as well as the secret identifiers specific to your assistant, so it only takes a few kilobytes , but if you have personal upgrades requiring storage then judge the card's capacity accordingly. *⚠️ IMPORTANT NOTE : the card must be formatted in FAT32 format*

# Sub-articles