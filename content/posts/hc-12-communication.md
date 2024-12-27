---
title: "Créer une liaison stable, sécurisée et distante sur 433MHz"
date: 2024-12-27T18:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://romainmellaza.fr/img/hc-12/hc-12_cover.jpg'
tags: ["esp32", "Electronic", "Réseaux"]
theme: "dark"
---

# Introduction
![|inline](https://romainmellaza.fr/img/hc-12/intro.png)

Il y a fort à parier que lors de la réalisation de vos différents projets électroniques il y ait eu à un moment ou un autre la nécessité de mettre en action une liaison permettant le transfert de données sur de longues distances. Aujourd'hui nous allons voir ensemble comment réaliser ceci de manière simple, efficace et abordable. Nous allons travailler sur la fréquence 433MHz en raison de son rapport intéressant grande portée/faible consommation d'énergie. De plus cette bande de fréquence est utilisée et reconnue dans des domaines tels que la domotique ou les systèmes d'alarmes, en effet la communication entre les différents modules ou télécommandes passe en majorité par cette fréquence. **Il est alors primordial de vous prévenir que d'utiliser cette fréquence dans des environnements très saturés en systèmes électroniques - c'est à dire des maisons disposant d'un nombre important d'objets connectés - générera à coup sur des interférences non négligeables.** Mais pas d'inquiétude nous allons voir comment éviter que votre projet personnel paralyse votre habitat.

Un autre petit disclaimer : aux États-Unis par exemple il est obligatoire d'avoir une licence de radio-amateur pour émettre sur du 433MHz avec une puissance supérieure à 1mW. En France ce n'est pas nécessaire.

Voilà maintenant que vous êtes pleinement conscient des conséquences possibles vis à vis de l'utilisation de ce type de système, passons au côté un peu plus technique du projet. Le but recherché sera donc de transmettre sans fil des variables sur des distances assez longues. Cela pourra être tout aussi bien des chiffres que des lettres. Le cas pratique de référence est celui d'un capteur quelconque qui transmet ses mesures à un second module, on peut imaginer que le capteur se situe à plusieurs dizaines de mètres (+ obstacles) de la carte souhaitant recevoir les données.

Ici pour mon travail les modules 1 et 2 seront des ESP32 mais vous pouvez bien entendu utiliser n'importe quel MCU dont vous êtes familier au fonctionnement et aux entrées/sorties, le tout est de savoir moduler mes instructions et programmes en conséquences. Ce que je recherche personnellement est une connexion bi-directionnel c'est à dire que je ne considère pas une des deux cartes comme réceptrice et l'autre comme émettrice, en effet selon moi les deux peuvent tout aussi bien être émettrice que réceptrice, cependant comme vous devez vous en doutez cela requiert une certaine synchronisation. Enfin pour être complètement transparent avec vous, je cherche à ce que mon *ESP1* transmette une valeur comprise entre -3 et +3 (dépendant de la position d'un potentiomètre linéaire) tandis que mon *ESP2* devra transmettre les différentes directions du vecteur rotation (*lacet, roulis, tangage*) au travers de la lecture d'un accéléromètre **GY-521/MPU6050**. On peut résumer mon montage au schéma suivant :
![|inline](https://romainmellaza.fr/img/hc-12/schema1.png)

# Le module
A moins que vous disposez d'un MCU capable d'émettre et recevoir sur du 433MHz de manière native, il est nécessaire de vous procurer deux modules permettant une émission/réception sur cette bande de fréquence. Un module bien connu permet ce tour de force, je vous présente le module **HC-12** :
![|inline](https://romainmellaza.fr/img/hc-12/hc12.png)

Passons maintenant en revue quelques caractéristiques importantes. Tout d'abord si vous utilisez tout comme moi un ESP32 il est nécessaire d'alimenter le module en 3.3V et non en 5V, en effet l'ESP32 fonctionne en logique 3.3V, par conséquent la tension en sortie des convertisseurs numérique-analogique sera au maximum de 3.3V et non 5V. En pratique si vous alimentez en 5V le module alors que les broches de réception/émission transmettent un signal de 3.3V maximum il y aura donc un problème de compatibilité des niveaux logiques. A noter que les cartes RaspberryPi et l'Arduino Due fonctionnent aussi en logique 3.3V alors que l'Arduino UNO par exemple fonctionne lui en logique 5V.

Si l'on revient maintenant aux branchements, pour un ESP32 il y a trois contrôleurs UART (*Universal Asynchronous Receiver-Transmitter*) intégrés au microcontrôleur. Vous pouvez donc utiliser un des trois couples suivants en fonction de la disponibilité de vos broches (il s'agit du mapping le plus courant) :
| **UART** | **Transmission (Tx)** | **Réception (Rx)** |
| :------: | :-------------------: | :----------------: |
| UART0    |    ```GPIO1```        |    ```GPIO3```     |
| UART1    |    ```GPIO10```       |    ```GPIO9```     |
| UART2    |    ```GPIO17```       |    ```GPIO16```    |

A noter que ces GPIO's sont complètement remappables (*si nécessaire, je vous laisse voir le processus sur Internet*).

Après avoir réalisé de votre côté les différents branchements, vous devriez avoir quelque chose de ce genre :
![|inline](https://romainmellaza.fr/img/hc-12/cablage.png)

Ne reste plus qu'à initialiser le module en le déclarant en tant qu'objet dans votre programme :
```cpp
#include <HardwareSerial.h>

// Si vous choisissez l'UART0 :
HardwareSerial HC12(0);

// Si vous choisissez l'UART1 :
HardwareSerial HC12(1);

// Si vous choisissez l'UART2 :
HardwareSerial HC12(2);

void setup(void){
    // Si vous choisissez l'UART0 :
    HC12.begin(9600, SERIAL_8N1, 3, 1); // 9600 bps, 8 bits de données, aucun bit de parité, 1 bit d'arrêt

    // Si vous choisissez l'UART1 :
    HC12.begin(9600, SERIAL_8N1, 9, 10);

    // Si vous choisissez l'UART2 :
    HC12.begin(9600, SERIAL_8N1, 16, 17);
}
```

# Utilisation
Maintenant que nous avons correctement initialisé le module, nous pouvons à présent l'utiliser pour recevoir et émettre des données, voici les deux modèles à apprendre :

* Émission :
```cpp
HC12.println("Je suis une phrase émise par un ESP32");
```

* Réception :
```cpp
String receivedData = "";

while (HC12.available())
{
    char c = HC12.read(); // Lire le caractère depuis le module HC-12
    receivedData += c;    // Ajouter le caractère à la variable receivedData
}
```

# Encapsulation des données
Dans une démarche de stabilité des échanges et pour éviter toutes confusions sur la teneur des différentes valeurs transmises j'ai mis en place une technique d'encapsulation des données, c'est-à-dire que chaque valeur sera entourée par des codes particuliers que les deux microcontrôleurs peuvent interprétés. On a donc des chaînes caractères échangées qui ressemble à ceci :
![|inline](https://romainmellaza.fr/img/hc-12/message.png)

Dès lors que le microcontrôleur réceptionnera le message, on peut vérifier que la variable de type ```String``` sauvegardée contient un code correspondant à la donnée que l'on recherche. Bon c'est un peu barbare vu comme ça mais en réalité c'est assez simple, voici un exemple tiré de mon projet :

Imaginons que nous voulions différencier l'axe de tangage, de celui du roulis et de lacet. On peut donc créer une classe comme celle ci :
```cpp
class encapsulation_CODES
{
private:
    const char *vspeed = "pyZmKrXbTs";
    const char *roulis = "WzJpyXbQtm";
    const char *tangage = "gHnQkLzRb";
    const char *lacet = "XvcPrBmTyg";
    const char *nothing = "xxxxxxxxxx";

public:

    // Fonction pour interpréter les messages reçus :
    String *parseAndStore(const char *input)
    {
        String str(input);
        String code;
        String value;
        String indic;
        int pos1, pos2;

        // On cherche dans le message une occurence du code correspondant à "vspeed" :
        if ((pos1 = str.indexOf(vspeed)) != -1)
        {
            code = vspeed;
            indic = "vspeed";
        }
        else
        {
            // Code not found
            code = nothing;
            indic = "nothing";
        }

        pos2 = str.indexOf(code, pos1 + code.length());
        if (pos2 == -1)
        {
            // Seconde occurence du code dans le message non trouvée
            code = nothing;
            indic = "nothing";
        }

        value = str.substring(pos1 + code.length(), pos2);

        // Creation d'un tableau statique pour engreistrer à la fois la donnée brute mais aussi son identiant (vspeed)
        static String result[2];
        result[0] = indic;
        result[1] = value;

        return result;
    }

    // A l'inverse, si l'on veut transmettre une valeur alors on l'entoure entre les deux codes correspondants à la teneur de la donnée à émettre :
    void sendToRadio(const char *type, String data)
    {
        if (type == "battery")
        {
            String message = String(dbattery) + data + String(dbattery);
            HC12.println(message);
        }
        if (type == "roulis")
        {
            String message = String(roulis) + data + String(roulis);
            HC12.println(message);
        }
        if (type == "tangage")
        {
            String message = String(tangage) + data + String(tangage);
            HC12.println(message);
        }
        if (type == "lacet")
        {
            String message = String(lacet) + data + String(lacet);
            HC12.println(message);
        }
    }
}
```

Ce système permet donc d'ajouter assez simplement tout type de données recherchées dans un échange, si l'on veut transmettre plein d'autre chose, c'est tout à fait possible. Il faut juste faire attention car vous avez peut-être constaté que mes codes sont aléatoirement composés de lettres **et seulement de lettres**, cela est dû au fait que je ne veux pas mélanger des données brutes entières ou flottantes avec les codes. Cela signifie donc aussi que si vous souhaitez transmettre des mots il sera alors judicieux de générer des codes d'encapsulation composés exclusivement de chiffres.

L'autre intérêt de ce type de système est d'être certain d'interpréter **une donnée complète et sans perte**.

Imaginer que je veuille transmettre ```123456```, je l'entoure du code d'encapsulation ```barbapapa```. Cela ressemble donc à ça :
![|inline](https://romainmellaza.fr/img/hc-12/message1.png)

Imaginer maintenant que le message reçu par le MCU récepteur soit entre-coupé et qu'une partie de ce dernier soit perdue :
![|inline](https://romainmellaza.fr/img/hc-12/message2.png)

Alors la donnée ne sera pas prise en compte, même si dans cette situation ce n'est pas très utile de rejeter la donnée.

Par contre dans le cas ci-dessous, c'est **beaucoup** plus grave, et ça évite une erreur dangereuse :
![|inline](https://romainmellaza.fr/img/hc-12/message3.png)

Voilà donc l'utilité de mon système d'encapsulation ! 😄

# Optimisation de la liaison
J'ai aussi mis en place un calcul du packet loss, il est assez basique : à chaque cycle de ma boucle ```loop```, un de mes deux ESP32 demande à l'autre de répondre, s'il répond alors je rajoute un 1 à une file, cependant s'il ne répond pas j'enfile un 0, dans les deux cas je défile puis je calcule le pourcentage de 0 dans la file, ce pourcentage représente la quantité de paquets perdus. On peut résumer ce test au diagramme suivant :
![|inline](https://romainmellaza.fr/img/hc-12/packet_loss.png)

Enfin grâce à ce système j'ai pu mener ma propre batterie de test afin de savoir quel était le temps d'attente optimal entre la question émise par **ESP1** et la réponse de **ESP2** reçue par **ESP1**. J'ai aussi vérifié que cette réponse était complète et bien interprétée.

![|inline](https://romainmellaza.fr/img/hc-12/test1.png)

Voici ci-dessus l'affichage d'un des essais où j'ai défini un temps d'attente satisfaisant : on constate un taux de packet loss aux alentours de 5%.

En conclusion cela m'a permis de réaliser le graphique suivant où l'on constate bien l'effet du temps d'attente sur la fiabilité de la connexion. A noter que l'encadré rouge représente la plage de l'expérimentation où les données reçues étaient illisibles, c'est-à-dire que l'encapsulation était corrompue comme explicité un peu plus haut dans cet article.
![|inline](https://romainmellaza.fr/img/hc-12/graphique.png)

On constate donc qu'un temps d'attente aux alentours de **250ms** est optimal dans ma configuration. Je pense que vous pouvez obtenir des résultats différents en fonction de votre système, je vous laisse donc mener la même expérience de votre côté.

Enfin, pour obtenir de tels résultats j'ai réussi à éviter que les deux modules soit en réception ou en émission en même temps, j'ai mis en place une architecture *maître/esclave* dont je ne rentrerai pas dans les détails de fonctionnement, mais si le sujet de la synchronisation vous intéresse je vous laisse lire [un autre article que j'ai rédigé où je parle de ce type d'architecture](https://romainmellaza.fr/posts/tri-fusion-distribu%C3%A9-esp32/).
