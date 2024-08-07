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

Before launching the script, make sure that your Python virtual environment is indeed activated, it will not work otherwise!

```bash
./server-side
```

If all goes well you should see this:

```bash
./server-side

Serveur en écoute sur le port 8080
En attente de connexion...
```

But if you see this, don't worry:

```bash
./server-side 

Échec de la liaison
```

This means that another process is using port 8080 while our script wants to use it to communicate with esp32, you can check who is using this port:

```bash
sudo lsof -i:8080

COMMAND     PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
server-si 34293 root    3u  IPv4 278644      0t0  TCP *:http-alt (LISTEN)
```

To kill it subsequently by identifying it by its PID:
```bash
sudo kill -9 34293
```

And it should now work! However, one last configuration is necessary, in fact we are going to run two scripts in parallel on our Linux machine, it is therefore preferable to limit these two processes to two separate sessions (which is also necessary if you use SSH like me).

To do this, install [screen](https://doc.ubuntu-fr.org/screen) which is a terminal multiplexer:
```bash
sudo apt install screen
```

Now every time you run the server-side script, do this in order:

* Create a new session : `screen -S <name-of-your-session>`
* Or connect to a pre-existing session that you created : `screen -r <name-of-your-session>`
* Activate your virtual environment
* Run `./server-side`
* Hit `Ctrl+A` then `D`

# Enable the Google Assistant SDK

We will now see together how it is possible to integrate your homemade voice assistant with your Google home application to be able to control all of your connected devices exactly as if you were talking to an official Google voice assistant! I made this choice so as not to get lost in the use of lots of different APIs but you can do it if you wish, here Google does not process anything, it is simply a matter of sending a text command to your Google Assistant using your account.

Setting up the Google Assistant SDK is quite complex, follow [this official guide](https://developers.google.com/assistant/sdk/guides/service/python/embed/config-dev-project-and-account).

If you have problems with google-oauthlib-tool, particularly the `--headless` parameter, do this:

* execute `screen -S auth`
* execute `source env/bin/activate`
* execute `google-oauthlib-tool --scope https://www.googleapis.com/auth/assistant-sdk-prototype --save --client-secrets </path/to/client_secret_client-id.json>` (modify the command to match your secret file)

* Complete authentication on any device using chrome
* At this state, you should see a failed to load website page
* Open chrome dev tools(F12)
* Go to network
* Reload the webpage
* On the entry that popped up, click copy as cURL
* On your Linux machine, press `Ctrl+a` and afterward `D` to close the screen
* Paste in terminal 

# Connect Google Assistant with ESP32

* Initialize a new Node.js project

Use npm to initialize a new project. This will create a package.json file where information about your project and its dependencies will be stored.

```bash
npm init -y
```

* Install Express

Express is a minimalist framework for Node.js that makes it easy to create web servers. Install Express as a dependency in your project.

```bash
npm install express
```

* Create the Server

Create a `server.js` file in your project directory. This file will contain the server code.

```bash
touch server.js
```

Open `server.js` in a text editor and add the following code:
```js
const express = require('express');
const { exec } = require('child_process');
const app = express();

// Clé API pour sécuriser les requêtes
const API_KEY = 'VOTRE_CLE_API_GENERATED';  // Remplacez par la clé API générée

app.use(express.json());

// Middleware pour vérifier la clé API
app.use((req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (apiKey !== API_KEY) {
    return res.status(403).send('Accès refusé');
  }
  next();
});

app.post('/execute', (req, res) => {
  const deviceId = req.body.deviceId;
  const deviceModelId = req.body.deviceModelId;
  const phrase = req.body.phrase; // Nouvelle phrase à envoyer

  // Vérification des paramètres
  if (!deviceId || !deviceModelId || !phrase) {
    return res.status(400).send('Paramètres manquants : deviceId, deviceModelId ou phrase');
  }

  // Construire la commande avec les paramètres
  const command = `./run_assistant.sh ${deviceId} ${deviceModelId} "${phrase}"`;

  exec(command, { shell: '/bin/bash' }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Erreur d'exécution : ${error.message}`);
    }
    if (stderr) {
      return res.status(500).send(`Erreur de commande : ${stderr}`);
    }
    res.send(stdout);
  });
});

const PORT = 3000;  // Choisissez le port que vous souhaitez utiliser
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
```

* Create the `run_assistant.sh` script that executes the necessary Bash commands. Place this file in the same directory as server.js.

```bash
#!/bin/bash

# Récupérer les paramètres
DEVICE_ID=$1
DEVICE_MODEL_ID=$2
PHRASE=$3

# Activer l'environnement virtuel
source ~/prog/cristal-env/bin/activate
echo "Environnement activé."

# Obtenir la date et l'heure actuelle
CURRENT_DATETIME=$(date '+%d-%m-%Y %H:%M:%S')

# Construire la commande complète
COMMAND="python -m googlesamples.assistant.grpc.textinput --device-id $DEVICE_ID --device-model-id $DEVICE_MODEL_ID"

# Écrire la commande et la phrase dans le fichier de log avec l'horodatage
echo "[$CURRENT_DATETIME] Command: $COMMAND, Phrase: \"$PHRASE\"" >> command_log.txt

# Exécuter le script expect
expect ./send_command.exp "$DEVICE_ID" "$DEVICE_MODEL_ID" "$PHRASE"
```

The line echo `[$CURRENT_DATETIME] Command: $COMMAND, Phrase: \"$PHRASE\"" >> command_log.txt` writes the full command and phrase to the `command_log.txt` file, appending the timestamp at the beginning.

* Make sure the script is executable:
```bash
chmod +x run_assistant.sh
```

* Install expect (if necessary):

On Ubuntu, you can install expect with the following command:

```bash
sudo apt-get install expect
```

* Create an Expect Script:

We will create an expect script that sends the phrase after detecting the prompt :

```exp
#!/usr/bin/expect

# Récupérer les arguments
set device_id [lindex $argv 0]
set device_model_id [lindex $argv 1]
set phrase [lindex $argv 2]

# Lancer la commande Python
spawn python -m googlesamples.assistant.grpc.textinput --device-id $device_id --device-model-id $device_model_id

# Attendre l'invite
expect ": "

# Envoyer la phrase et appuyer sur Entrée
send "$phrase\r"

# Attendre que le processus se termine
expect eof
```