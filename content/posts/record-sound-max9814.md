---
title: "[Cristal] How to record sound on a microSD card with an ESP32 and a MAX9814 microphone ?"
date: 2024-08-06T18:39:07+01:00
draft: true
author: Romain MELLAZA
cover: ''
tags: ["Electronic", "C++", "esp32"]
theme: "light"
---

# Introduction
Making sound recordings is undoubtedly an integral part of most electronic projects, which is why today I'm going to show you how to do this task in the simplest and most efficient way.

I advise you to get an ESP32, a [push button](https://www.amazon.fr/s?k=push+button&__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss), a [MicroSD Card Module](https://www.amazon.fr/esp32-sd/s?k=esp32+sd) as well as a microSD card with the smallest capacity you have, in fact it will be useful to us only to store the audio file recorded (**⚠️ IMPORTANT NOTE : the card must be formatted in [FAT32 format](https://support.microsoft.com/fr-fr/topic/comment-convertir-un-lecteur-en-fat32-%C3%A0-l-aide-du-convertisseur-de-lecteur-5f751b9d-60a2-01bc-4079-2f536b876cc3)**), and a [MAX9814](https://www.az-delivery.de/fr/products/max9814-mikrofon) amplified electret microphone.

The ESP32 microcontroller has built-in analog-to-digital converters (ADCs) with a resolution of 12 bits, which allows for 4096 discrete levels of input. There are two ADCs on the ESP32, named ADC1 and ADC2. Each ADC has multiple channels:

* **ADC1**: 8 channels (GPIO 32 to GPIO 39)
* **ADC2**: 10 channels (GPIO 0, GPIO 2, GPIO 4, GPIO 12 to GPIO 15, GPIO 25 to GPIO 27)

*In this article we will use ADC1 channel 7, that is GPIO35.*

Sound is an analog signal, meaning it continuously varies in amplitude and frequency over time. The ADC in the ESP32 converts these continuous analog sound waves into digital data, which consists of discrete numerical values that can be processed by the microcontroller. The sampling rate determines the range of frequencies that can be accurately captured. According to the [Nyquist theorem](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem), the sampling rate should be at least twice the highest frequency you want to capture.

# Wiring 

Make the connections follow this:
![|inline](https://www.electronicwings.com/storage/PlatformSection/TopicContent/452/description/MicroSD.jpg)

### Micro SD Card Module :
* 3.3 V
* MISO : GPIO 19
* CLK : GPIO 18
* MOSI : GPIO 23
* CS : GPIO 5
* GND

### Push Button :
* 3.3 V
* GPIO 4
* GND
![|inline](https://www.az-delivery.de/cdn/shop/products/max9814-mikrofon-964239.jpg?v=1679402420&width=1200)

### Microphone MAX9814 :
* VDD : 3.3 V
* OUT : GPIO 35 (*ADC1_CHANNEL_7*)
* GND

*You may need pull-up resistors depending on your micro sd module...*

# Programming 

We are going to record the audio in a [**WAV file**](https://en.wikipedia.org/wiki/WAV), for this it is essential to define the headers inherent to this file format, here is an overview of the different characteristics to define in relation to our file to have a universally readable file :

```
[Master RIFF chunk]
   FileTypeBlocID  (4 bytes) : Identifier « RIFF »  (0x52, 0x49, 0x46, 0x46)
   FileSize        (4 bytes) : Overall file size minus 8 bytes
   FileFormatID    (4 bytes) : Format = « WAVE »  (0x57, 0x41, 0x56, 0x45)

[Chunk describing the data format]
   FormatBlocID    (4 bytes) : Identifier « fmt␣ »  (0x66, 0x6D, 0x74, 0x20)
   BlocSize        (4 bytes) : Chunk size minus 8 bytes, which is 16 bytes here  (0x10)
   AudioFormat     (2 bytes) : Audio format (1: PCM integer, 3: IEEE 754 float)
   NbrChannels     (2 bytes) : Number of channels
   Frequence       (4 bytes) : Sample rate (in hertz)
   BytePerSec      (4 bytes) : Number of bytes to read per second (Frequence * BytePerBloc).
   BytePerBloc     (2 bytes) : Number of bytes per block (NbrChannels * BitsPerSample / 8).
   BitsPerSample   (2 bytes) : Number of bits per sample

[Chunk containing the sampled data]
   DataBlocID      (4 bytes) : Identifier « data »  (0x64, 0x61, 0x74, 0x61)
   DataSize        (4 bytes) : SampledData size
   SampledData
```

Now let's implement this in c++ in a `wav-format` file:

* `wav-format.h` :
```h
#include <Arduino.h>

// 16bit, monoral, 44100Hz,  linear PCM
void CreateWavHeader(byte* header, int waveDataSize);  // size of header is 44
```

* `wav-format.cpp` :
```cpp
#include "wav-format.h"

void CreateWavHeader(byte* header, int waveDataSize){
  header[0] = 'R';
  header[1] = 'I';
  header[2] = 'F';
  header[3] = 'F';
  unsigned int fileSizeMinus8 = waveDataSize + 44 - 8;
  header[4] = (byte)(fileSizeMinus8 & 0xFF);
  header[5] = (byte)((fileSizeMinus8 >> 8) & 0xFF);
  header[6] = (byte)((fileSizeMinus8 >> 16) & 0xFF);
  header[7] = (byte)((fileSizeMinus8 >> 24) & 0xFF);
  header[8] = 'W';
  header[9] = 'A';
  header[10] = 'V';
  header[11] = 'E';
  header[12] = 'f';
  header[13] = 'm';
  header[14] = 't';
  header[15] = ' ';
  header[16] = 0x10;  // linear PCM
  header[17] = 0x00;
  header[18] = 0x00;
  header[19] = 0x00;
  header[20] = 0x01;  // linear PCM
  header[21] = 0x00;
  header[22] = 0x01;  // monoral
  header[23] = 0x00;
  header[24] = 0x44;  // sampling rate 44100
  header[25] = 0xAC;
  header[26] = 0x00;
  header[27] = 0x00;
  header[28] = 0x88;  // Byte/sec = 44100x2x1 = 88200
  header[29] = 0x58;
  header[30] = 0x01;
  header[31] = 0x00;
  header[32] = 0x02;  // 16bit monoral
  header[33] = 0x00;
  header[34] = 0x10;  // 16bit
  header[35] = 0x00;
  header[36] = 'd';
  header[37] = 'a';
  header[38] = 't';
  header[39] = 'a';
  header[40] = (byte)(waveDataSize & 0xFF);
  header[41] = (byte)((waveDataSize >> 8) & 0xFF);
  header[42] = (byte)((waveDataSize >> 16) & 0xFF);
  header[43] = (byte)((waveDataSize >> 24) & 0xFF);
}
```

As you can see, we are using a sample rate of 44100Hz, but you can change this depending on your usage, just don't forget to change the header values ​​accordingly.

Now it's time to code the actual audio recording program, we'll call it `rec-sound` :

* `rec-sound.h` :
```h
#ifndef REC_H_
#define REC_H_

#include <SD.h>

void record_mic();

#endif
```

* `rec-sound.cpp` :
```cpp
#include "Arduino.h"
#include <FS.h>
#include "wav-format.h"
#include "I2S.h"
#include <SD.h>

#define I2S_MODE I2S_MODE_ADC_BUILT_IN

const int record_time = 3;  // second
const char filename[] = "/audio.wav";

const int headerSize = 44;
const int waveDataSize = record_time * 88000;
const int numCommunicationData = 8000;
const int numPartWavData = numCommunicationData/4;
byte header[headerSize];
char communicationData[numCommunicationData];
char partWavData[numPartWavData];
File file;

bool driver_installed = false;

void record_mic() {

  if (!SD.begin()) Serial.println("SD begin failed");
  while(!SD.begin()){
    Serial.print(".");
    delay(500);
  }

  CreateWavHeader(header, waveDataSize);

  // Remove previous version of the record
  SD.remove(filename);

  file = SD.open(filename, FILE_WRITE);
  if (!file) return;

  file.write(header, headerSize);

  if (!driver_installed){
    I2S_Init(I2S_MODE, I2S_BITS_PER_SAMPLE_32BIT);
    driver_installed = true;
  }

  Serial.println("Démarrage de l'enregistrement...");
  for (int j = 0; j < waveDataSize/numPartWavData; ++j) {
    I2S_Read(communicationData, numCommunicationData);
    for (int i = 0; i < numCommunicationData/8; ++i) {
      partWavData[2*i] = communicationData[8*i + 2];
      partWavData[2*i + 1] = communicationData[8*i + 3];
    }
    file.write((const byte*)partWavData, numPartWavData);
  }

  file.close();
}
```

As you can see, we need the standard [FS](https://github.com/espressif/arduino-esp32/tree/master/libraries/FS/src) and [SD](https://www.arduino.cc/reference/en/libraries/sd/) libraries. You can also modify some constants according to your use such as the recording duration or the name of the recorded file, do not forget the "/" at the beginning of the file name as well as the ".wav" extension.