---
title: "Le tri fusion en multi-threading"
date: 2024-04-14T18:39:07+01:00
draft: false
author: Romain MELLAZA
cover: 'https://mellaza.tech/img/multi-threading/cover_microcircuit.jpg'
tags: ["Algorithm", "esp32", "Electronic"]
theme: "light"
---

# Problématique
Dans le cadre d'un projet personnel, j'ai souhaité comparer les performances énergétiques de systèmes informatiques. Une des premières idées qui m'est venu à l'esprit est de mettre en concurrence le même algorithme (en [C](https://fr.wikipedia.org/wiki/C_(langage))) de tri fusion (détaillé [ici](https://mellaza.tech/posts/tri-fusion/)) exécuté de manière séquentielle **VERSUS** une exécution en [**multi-threading**](https://learn.microsoft.com/fr-fr/dotnet/standard/threading/threads-and-threading) soit utilisant le principe de [parallélisme](https://fr.wikipedia.org/wiki/Parall%C3%A9lisme_(informatique)).

*Je ne détaillerai pas ici mon algorithme de mesure de puissance électrique, car ce dernier fera l'objet d'un futur article.*

# Algorithme
Nous allons donc passer en revue de manière succincte les différentes fonctions et procédures permettant cette implémentation.

### Directives de préprocesseur
```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <pthread.h>
#include <string.h>
#include <unistd.h>

#define THREAD_MAX 12
```
On importe les modules utiles, et on définit le nombre maximale de threads à 12. Vous pouvez bien entendu faire varier cette valeur en fonction de votre machine.

### Définition de structure
```c
struct ThreadArgs {
    int* arr;
    int size;
};
```
On définit une structure qui permettra un empaquetage pour chaque thread, avec pour attributs :
 * Le sous-tableau qu'il doit traiter.
 * La taille de ce dernier.

### Fonction de fusion 
```c
void merge(int tab_inp[], int low, int mid, int high) {
    int* left = (int*)malloc((mid - low + 1) * sizeof(int));
    int* right = (int*)malloc((high - mid) * sizeof(int));

    int n1 = mid - low + 1, n2 = high - mid, i, j;

    for (i = 0; i < n1; i++)
        left[i] = tab_inp[i + low];

    for (i = 0; i < n2; i++)
        right[i] = tab_inp[i + mid + 1];

    int k = low;
    i = j = 0;

    while (i < n1 && j < n2) {
        if (left[i] <= right[j])
            tab_inp[k++] = left[i++];
        else
            tab_inp[k++] = right[j++];
    }

    while (i < n1) {
        tab_inp[k++] = left[i++];
    }

    while (j < n2) {
        tab_inp[k++] = right[j++];
    }

    free(left);
    free(right);
}
```
La fonction `merge` fusionne deux sous-tableaux d'un tableau donné. Les sous-tableaux sont définis par les indices `low`, `mid` et `high`. Elle crée deux nouveaux tableaux, `left` et `right`, pour stocker les éléments des sous-tableaux, puis fusionne ces tableaux dans le tableau original en ordre croissant.

### La fonction de tri (à proprement parler)
```c
void tri_fusion(int t[], int l, int r){
  if (l < r) {
    int m = l + (r - l) / 2;
    tri_fusion(t, l, m);
    tri_fusion(t, m + 1, r);
    merge(t, l, m, r);
  }
}
```
La fonction `tri_fusion` effectue un tri fusion sur un sous-tableau d'un tableau donné. Les limites du sous-tableau sont définies par les indices `l` et `r`. Elle divise récursivement le tableau en deux moitiés, les trie individuellement, puis les fusionne.

### Gestion des threads 
```c
void* merge_sort_thread(void* arg) {
    struct ThreadArgs* args = (struct ThreadArgs*)arg;
    int* tab = args->arr;
    int arr_size = args->size;

    int thread_part = part++;

    int low = thread_part * (arr_size / THREAD_MAX);
    int high = (thread_part + 1) * (arr_size / THREAD_MAX) - 1;

    int mid = low + (high - low) / 2;
    if (low < high) {
        tri_fusion(tab, low, mid);
        tri_fusion(tab, mid + 1, high);
        merge(tab, low, mid, high);
    }
    return NULL;
}
```
Le fonction `merge_sort_thread` est similaire à `tri_fusion`, mais elle est conçue pour être exécutée dans un thread. Elle prend un argument de type void*, qui est ensuite converti en un pointeur vers la structure `ThreadArgs` définie plus haut. La fonction divise le tableau en sous-tableaux en fonction du nombre de threads, puis effectue un tri fusion sur chaque sous-tableau.

### Génération des tableaux aléatoires
```c
int* gen_tableau_aleatoires(int n, int rand_coeff) {
  int *arr_gen = malloc(sizeof(int) * n);
  for (int i = 0; i < n; i++) {
    arr_gen[i] = rand() % rand_coeff;
  }
  return arr_gen;
}
```
Cette fonction génère un tableau de nombres aléatoires. La taille du tableau et le coefficient pour la génération de nombres aléatoires sont passés en arguments.

### Fonction `main`
```c
int main(int argc, char *argv[]) {
    // Réinitialisation du compteur interne permettant la génération de nombres aléatoires :
    srand(time(NULL));

    // Vérification que l'utilisateur a passé le bon nombre d'arguments :
    if (argc < 3) {
        printf("Usage: %s <taille_tableau> <valeur_max_aléatoire>\n", argv[0]);
        return 1;
    }

    int arr_size = atoi(argv[1]);
    int* arr_alea = gen_tableau_aleatoires(arr_size, atoi(argv[2]));

    // Copie dans un tableau temporaire, pour comparer des mêmes points de départ :
    int* arr_for_thread = malloc(sizeof(int) * arr_size);
    memcpy(arr_for_thread, arr_alea, arr_size * sizeof(int));

    clock_t t1, t2, t3, t4;
    int diff, diff2;

    t1 = clock();
    pthread_t threads[THREAD_MAX];

    // Création de la structure d'arguments pour les threads
    struct ThreadArgs args[THREAD_MAX];
    for (int i = 0; i < THREAD_MAX; i++) {
        args[i].arr = arr_for_thread;
        args[i].size = arr_size;
        pthread_create(&threads[i], NULL, merge_sort_thread, &args[i]);
    }

    for (int i = 0; i < THREAD_MAX; i++) {
        pthread_join(threads[i], NULL);
    }

    // Fusion de tous les threads suite à leur tri individuel
    for (int i = 0; i < THREAD_MAX - 1; i++) {
        merge(arr_for_thread, i * (arr_size / THREAD_MAX), (i + 2) * (arr_size / THREAD_MAX) - 1, (i + 3) * (arr_size / THREAD_MAX) - 1);
    }

    t2 = clock();

    // Mesure du temps d'éxecution du tri fusion multi-threadé en secondes :
    diff = t2 - t1;
    printf("Temps d'exécution du tri fusion multi-threadé sur un tableau de taille %d et de facteur aléatoire %d : %f secondes\n", arr_size, atoi(argv[2]), ((double)diff) / (CLOCKS_PER_SEC*(THREAD_MAX/2)));    

    sleep(5);

    t3 = clock();

    tri_fusion(arr_alea, 0, arr_size - 1);

    // Mesure du temps d'éxecution du tri fusion séquentiel en secondes :
    t4 = clock();
    diff2 = t4 - t3;
    printf("Temps d'exécution du tri fusion classique sur un tableau de taille %d et de facteur aléatoire %d : %f secondes\n", arr_size, atoi(argv[2]), ((double)diff2) / CLOCKS_PER_SEC);

    return 0;
}
```
La fonction `main` génère un tableau de nombres aléatoires, le copie, puis effectue un tri fusion parallèle sur le tableau copié en utilisant plusieurs threads, ensuite elle réalise le tri fusion classique sur le tableau intial. Elle mesure également le temps d'exécution du tri fusion parallèle et du tri fusion séquentiel.

# Bac à sable
Tous les tests suivants seront effectués sur ce système (*sous Ubuntu 22.04.4 LTS*) :
```bash
Architecture :                              x86_64
  Mode(s) opératoire(s) des processeurs :   32-bit, 64-bit
  Address sizes:                            39 bits physical, 48 bits virtual
  Boutisme :                                Little Endian
Processeur(s) :                             12
  Liste de processeur(s) en ligne :         0-11
Identifiant constructeur :                  GenuineIntel
  Nom de modèle :                           12th Gen Intel(R) Core(TM) i7-1255U
    Famille de processeur :                 6
    Modèle :                                154
    Thread(s) par cœur :                    2
    Cœur(s) par socket :                    10
    Socket(s) :                             1
    Révision :                              4
    Vitesse maximale du processeur en MHz : 4700,0000
    Vitesse minimale du processeur en MHz : 400,0000
```

# Mesures temporelles

Après avoir compilé notre code, on peut effectuer quelques test dont voici les résultats pour différentes valeurs :
| **Nombre de valeurs / Valeur max. possible** | 100 / 50 |  1000 / 500 | 100000 / 500000 |  1000000000 / 50000000000 |
| :--------------------------: | :----------------: | :-----------------: | :----------------: | :-----------------: |
| **Tri fusion multi-threadé**      |```0.000256 sec```|```0.000490 sec```| ```0.000622 sec```|```65.112378 sec```|
| **Tri fusion séquentiel**   | ```0.000044 sec```| ```0.000456 sec```| ```0.014993 sec```| ```196.443202 sec```|

On constate que sur des tableaux contenant peu de données le tri fusion séquentiel  est plus rapide, cela s'explique notamment par le fait que les étapes supplémentaires inhérentes au séquençage en plusieurs threads, puis le regroupement de ces derniers induisent des calculs supplémentaires pour le processeur. Cependant ces étapes étant pratiquement constantes, elles restent complètement négligeables lorsque l'on traite des tableaux de tailles bien plus grandes, où l'on peut constater la puissance du parallélisme !

# Mesures de puissance

![Graphique montrant les différences entre un tri fusion séquentiel et parallèle|big](https://mellaza.tech/img/multi-threading/graph.png)

On constate que le tri fusion séquentiel bien que plus long, ne demande pas à l'appareil une puissance supérieure à 30 watts, tandis que le tri fusion parallèle utilise l'ensemble des ressources de l'ordinateur en demandant une puissance électrique autour des 50 watts en pic, surtout dûe au refroidissement du système.