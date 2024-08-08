---
title: "[Cristal] How to display daily news on a I2C screen ?"
date: 2024-08-06T18:39:07+01:00
draft: true
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/cristal-home-assistant/pres4.png'
tags: ["Electronic", "C++", "esp32"]
theme: "light"
---
# Introduction 
Together we will see how to display daily news on an I2C screen. To obtain the information, we will use the [News API](https://newsapi.org/). You will have to create a free account on their site to obtain your personal API key. Don't hesitate to go read the [API documentation](https://newsapi.org/docs), we can make super interesting HTTP requests! Unfortunately the information displayed will not be full live, there is a 24 hour delay, but it allows you to get the most popular information.

