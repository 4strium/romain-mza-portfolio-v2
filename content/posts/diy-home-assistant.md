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

Today I decided to show you in the smallest details how I managed to design **Cristal** a voice assistant which can respond to all your wishes as long as you are ready to fiddle a minimum between the hardware and the software.

# The necessary equipment
![|inline](https://www.gotronic.fr/ori-module-nodemcu-esp32-28407.jpg)

* An [ESP32](https://www.amazon.fr/esp32-wroom/s?k=esp32+wroom) will be the microcontroller of our project! We will take full advantage of its WiFi capacity but also of its integrated ADCs.
![|inline](https://www.az-delivery.de/cdn/shop/products/13-zoll-oled-i2c-128-x-64-pixel-display-kompatibel-mit-arduino-und-raspberry-pi-466478.jpg?v=1679397952&width=1200)

* An [OLED screen (128x64) using the SH1106 chip](https://www.az-delivery.de/en/products/1-3zoll-i2c-oled-display), it will be the main means of feedback with the user.
![|inline](https://www.electronicwings.com/storage/PlatformSection/TopicContent/452/description/MicroSD.jpg)

* A [MicroSD Card Module](https://www.amazon.fr/esp32-sd/s?k=esp32+sd) as well as a microSD card with the smallest capacity you have, in fact it will be useful to us only to temporarily store the audio file recorded by the microphone as well as the secret identifiers specific to your assistant, so it only takes a few kilobytes , but if you have personal upgrades requiring storage then judge the card's capacity accordingly. **⚠️ IMPORTANT NOTE : the card must be formatted in FAT32 format**

![©Osoyoo|inline](https://osoyoo.com/wp-content/uploads/2018/09/hc-sr04.png)

* An [Ultrasonic Sensor](https://www.amazon.com/ultrasonic-sensor/s?k=ultrasonic+sensor), **HC-SR04** is the safe bet.
![|inline](https://www.az-delivery.de/cdn/shop/products/max9814-mikrofon-964239.jpg?v=1679402420&width=1200)

* A microphone using the i2s protocol, personally I use the [MAX9814](https://www.az-delivery.de/fr/products/max9814-mikrofon) which is widespread in the field of microelectronics in particular because it carries a high quality amplifier with automatic gain control (AGC) and low noise microphone polarization.
![|inline](https://m.media-amazon.com/images/I/614vPNmpmuL._AC_UF894,1000_QL80_.jpg)

* LED's of the color you want. *(the best is that it matches the color of your case)*
![|inline](https://www.amazon.fr/s?k=push+button&__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss)

* A [push button](https://www.amazon.fr/s?k=push+button&__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss). 

# A small server
Unfortunately, although the esp32 is a true marvel due to the extent of its capabilities, certain actions are either not possible, or possible but within a period of time which makes use uncomfortable and not smooth.


This is the case for voice recognition for example, which is therefore central to our project, which is why it is necessary to first record the audio file before transmitting it to a more powerful device so that the latter achieves recognition. But be careful by "more powerful" I don't mean a server with 32GB of ram and a premium CPU, no it's quite the opposite! You can either rent the smallest server configuration from a host, or use a Raspberry Pi at home.
![|inline](https://m.media-amazon.com/images/I/61K2IaK2b9L._AC_UF1000,1000_QL80_.jpg)

In my case for example, I rent a server thanks to DigitalOcean, I selected the lowest possible configuration with only 1GB of Ram and an inefficient Intel processor. But it is more than sufficient as you can see in the graphs below, in terms of the memory or processor usage percentages with actions initiated by my custom assistant.

![Screenshot of data measured on the server I used for this project](https://romainmellaza.fr/img/cristal-home-assistant/digital-ocean.png)

# 3D models for those who want/can print them...
You can print the four parts of the project, here are the 3d files, feel free to modify them as you wish! *(namely I printed it with my Ender-3 V3 SE)*

![|inline](https://romainmellaza.fr/img/cristal-home-assistant/printing-1.jpg)

* [The button to activate voice recording.](https://github.com/4strium/Cristal-Home-Assistant/blob/main/models/Bouton-Cristal-AI.3mf)
* [The head of the robot with its two antennas.](https://github.com/4strium/Cristal-Home-Assistant/blob/main/models/Head%20cristal.3mf)
* [The body that will carry all the electronics.](https://github.com/4strium/Cristal-Home-Assistant/blob/main/models/body.3mf) 
* [The hood to make the link between the head and the body.](https://github.com/4strium/Cristal-Home-Assistant/blob/main/models/capuchon.3mf)


# Sub-articles