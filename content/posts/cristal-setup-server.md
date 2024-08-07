---
title: "[Cristal Assistant] Setting up the server"
date: 2024-08-06T18:39:07+01:00
draft: true
author: Romain MELLAZA
cover: ''
tags: ["Server", "Linux", "esp32"]
theme: "light"
---

# Introduction
This article is part of all the steps necessary to create a personalized voice assistant, the explanations of which you can find here: [click](). Of course if you just want to see how to create an Ubuntu server allowing voice recognition via TCP/IP as well as the integration of the Google Assistant SDK then you are in the right place!

# Transmission wav audio file between esp32 and linux server for recognition
As I said in the introductory article, you can use any machine here as long as it runs Linux. The first step is to integrate a Python script to perform speech recognition, so you will need to have Python installed on your Linux machine. In addition, it is necessary to install the "[speech_recognition](https://pypi.org/project/SpeechRecognition/)" module, for this you need to create a Python virtual environment at the root of your project :

```bash
pip install virtualenv
```

```bash
python3 -m venv <virtual-environment-name>
```

It is necessary to activate the environment each time you want to use it, whether to run a script using it or to install a new module.

```bash
source <virtual-environment-name>/bin/activate
```

If you see the name of your environment in parentheses at the start of your line in the terminal then it's good, it's activated! Now install the module to perform voice recognition.

```bash
pip install SpeechRecognition
```

You can now add this python file to your server, it performs French voice recognition, but you can simply modify the values ​​for the language you want! Name it “*recognize-fr.py*”.

```python
import speech_recognition as sr
import os

current_dir = os.getcwd()
filename = current_dir + "/enregistrement.wav"

# Check if the file is empty
if os.path.getsize(filename) == 0:
    print("Le fichier est vide, aucun traitement effectué.")
    with open("rapport.txt", "w") as file:
        file.write("Erreur de reconnaissance\n")
else:
    r = sr.Recognizer()
    with sr.AudioFile(filename) as source:
        audio = r.record(source)
        try:
            datafr = r.recognize_google(audio, language="fr-FR")
            print("Reconnaissance réussie : ", datafr)
        except sr.UnknownValueError:
            print("Ressayez s'il vous plaît...")
            datafr = "Erreur de reconnaissance"

    with open("rapport.txt", "w") as file:
        file.write(datafr)
        file.write("\n")

    # Vérifiez le contenu du fichier après l'écriture
    with open("rapport.txt", "r") as file:
        content = file.read()
        print("Contenu du fichier :", repr(content))
```

However this script is obviously not enough, you have to add the reception and sending tasks, I coded this in C++, it is therefore important to have a gcc type compiler on your machine.

```cpp
#include <iostream>
#include <fstream>
#include <cstring>
#include <cstdlib>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <sstream>

#define PORT 8080
#define MAX_CONNECTIONS 5

bool is_file_empty(const std::string& filename){
    struct stat file_stat;
    if (stat(filename.c_str(), &file_stat) != 0){
        return true;
    }
    return file_stat.st_size == 0;
}

int main() {
    int serverSocket, recSocket, sendSocket;
    struct sockaddr_in serverAddr, clientAddr;
    socklen_t addrSize = sizeof(clientAddr);
    char buffer[1024] = {0};

    // Création du socket serveur
    if ((serverSocket = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        std::cerr << "Erreur de création de socket" << std::endl;
        return -1;
    }

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(PORT);

    // Lier le socket au port
    if (bind(serverSocket, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0) {
        std::cerr << "Échec de la liaison" << std::endl;
        close(serverSocket);
        return -1;
    }

    // Écouter les connexions entrantes
    if (listen(serverSocket, MAX_CONNECTIONS) < 0) {
        std::cerr << "Échec de l'écoute" << std::endl;
        close(serverSocket);
        return -1;
    }

    std::cout << "Serveur en écoute sur le port " << PORT << std::endl;

    while (true) {
        std::cout << "En attente de connexion..." << std::endl;
        recSocket = accept(serverSocket, (struct sockaddr *)&clientAddr, &addrSize);
        if (recSocket < 0) {
            std::cerr << "La connexion utile à la réception a échouée" << std::endl;
            continue;
        }

        std::cout << "Connexion acceptée" << std::endl;

        // Recevoir le fichier
        ssize_t bytesRead;
        std::ofstream outfile("enregistrement.wav", std::ios::binary);
        if (!outfile.is_open()) {
            std::cerr << "Erreur d'ouverture du fichier enregistrement.wav" << std::endl;
            close(recSocket);
            continue;
        }

        bool receivedData = false;
        while ((bytesRead = recv(recSocket, buffer, sizeof(buffer), 0)) > 0) {
            outfile.write(buffer, bytesRead);
            receivedData = true;
        }
        outfile.close();
        // Fermer le socket après la réception du fichier audio
        close(recSocket);

        if (!receivedData || is_file_empty("enregistrement.wav")) {
            std::cerr << "Fichier reçu est vide, aucun traitement effectué" << std::endl;
            continue;   // Passer à la prochaine connexion
        }

        std::cout << "Fichier reçu avec succès" << std::endl;

        // Exécuter le script Python
        std::cout << "Exécution du script Python..." << std::endl;
        int result = system("python3 recognize-fr.py");
        if (result != 0) {
            std::cerr << "Échec de l'exécution du script Python" << std::endl;
        } else {
            std::cout << "Script Python exécuté avec succès" << std::endl;
        }

        sendSocket = accept(serverSocket, (struct sockaddr *)&clientAddr, &addrSize);
        if (sendSocket < 0) {
            std::cerr << "La connexion utile à l'envoi a échouée" << std::endl;
            continue;   // Passer à la prochaine connexion
        }

        // Lire le contenu de rapport.txt
        std::ifstream reportFile("rapport.txt");
        if (!reportFile.is_open()) {
            std::cerr << "Échec de l'ouverture de rapport.txt" << std::endl;
            close(sendSocket); // Fermer le socket en cas d'échec
            continue; // Passer à la prochaine connexion
        }
        std::stringstream reportBuffer;
        reportBuffer << reportFile.rdbuf();
        std::string reportContent = reportBuffer.str();
        reportFile.close();

        // Envoyer le contenu de rapport.txt au client
        ssize_t sentBytes = send(sendSocket, reportContent.c_str(), reportContent.size(), 0);
        if (sentBytes < 0) {
            std::cerr << "Échec de l'envoi du rapport" << std::endl;
        } else {
            std::cout << "Rapport envoyé avec succès (" << sentBytes << " bytes)" << std::endl;
        }

        close(sendSocket);
    }

    // Fermer le socket serveur (en théorie, cette ligne ne sera jamais exécutée)
    close(serverSocket);
    return 0;
}
```

Compile with this command:

```bash
g++ -std=c++11 -o server-side main.cpp
```
