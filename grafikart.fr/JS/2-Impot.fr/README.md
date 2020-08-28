# [impot.fr](https://github.com/Grafikart/Challenges/tree/master/JS/2-Impot.fr)

<a href="https://www.economie.gouv.fr/particuliers/tranches-imposition-impot-revenu#etapescalculir">
    <img src="https://img.shields.io/badge/economie-🇫🇷gouv.fr-blue.svg" alt=""/>
</a>
<a href="https://github.com/Grafikart/Challenges/tree/master/JS/2-Impot.fr">
    <img src="https://img.shields.io/badge/challenge-🦝 grafikart-blue.svg?logo=github" alt=""/>
</a>
<a href="https://www.youtube.com/watch?v=cX-5J_cy8TM">
    <img src="https://img.shields.io/badge/youtube-video-red.svg?logo=youtube" alt=""/>
</a>
<a href="https://codesandbox.io/s/angry-cloud-z8n08">
    <img src="https://img.shields.io/badge/demo-codesandbox-black.svg?black=codesandbox" alt=""/>
</a>


## démo 
https://codesandbox.io/s/angry-cloud-z8n08


## Idées concernant l'algorithme reverse

 - **Bruteforce**: facile mais peu efficace.
 - **Dichotomie**: meilleur que le bruteforce mais peut mieux faire.
 - **Mathématiques**: la manière la plus efficace mais ca demande un peu de temps de réflexion.


## Back to school - Reverse algorithm


### Enoncé

On souhaite déterminer le revenu imposable d'une personne à partir de la somme d'argent qu'elle disposera après le prélevement de l'impôt. Une autre manière de formuler serait:
> Si je souhaite disposer de 100€ après prélevement de l'impôt, de combien doit être mon revenu ?


### Données

- Soit `P` une constante donnée représentant le nombre de parts.
- Soit `S` (pour *saving*) une constante donnée, représentant l'argent dont je souhaite disposer après prélevement de l'impôt.
- Soit `SL(i)` la borne inférieure de la tranche `i` (`S` pour *slice*, `L` pour *lower*).
- Soit `SU(i)` la borne supérieure de la tranche `i` ( `U` pour *upper*).
- Soit `T(i)` Le coefficient de la tranche `i` (`T` pour *tax*).



### Résolution
Je cherche à déterminer `X`, le montant du revenu imposable.


Exprimons `S` en fonction de `X`.
Introduisons également la variable `impot` représentant le montant de l'impôt à payer.
```
S = X - impot
```

Développons la variable `impot`, on peut représenter `impot` sous la forme d'une somme de valeurs, correspondant chacune à l'impôt à payer pour chaque tranche. Dans cet exercice, nous avons 5 tranches. Pour une tranche donnée, le calcul est le suivant:
```js
perSlice(i) = (min(SU(i), X/P) - SL(i)) * T(i) 

// Par exemple, perSlice(1) vaut 
perSlice(1) = (min(25659, X/P) - 10065) * 0.11
```

On a donc:

```js

impot = P * (perSlice(0) + perSlice(1) + ... + perSlice(4))
```

Maintenant l'objectif est de développer l'équation afin d'isoler `X`.
```
S = P - impot
S = P - (P * (perSlice(0) + perSlice(1) + ... + perSlice(4)))
```

Pour des raisons de simplifications, j'introduis la variable `x`, `x = X/P`:

```js
S = Px - (P * (perSlice(0) + perSlice(1) + ... + perSlice(4)))
```

Supposons maintenant que `x` se situe dans la tranche en question `i`. J'introduis la variable `acc` (pour *accumulator*) représentant l'impôt collecté des tranches précédentes. On a donc ceci:
```js
S = Px - (P * (acc + perSlice(i))
S = Px - (P * (acc + ((min(SU(i), x) - SL(i)) * T(i))))
S = Px - (P * (acc + (x - SL(i) * T(i))))
S = Px - (P * (acc + T(i)x - SL(i)T(i)))
S = Px - (Pacc + PT(i)x - SL(i)T(i)P)
S = Px - Pacc - PT(i)x + SL(i)T(i)P
S - SL(i)T(i)P + Pacc = x(P - PT(i))
x = (S - SL(i)T(i)P + Pacc)/(P - PT(i))
```

De manière plus lisible, on obtient ceci:

![Equation](https://math.now.sh?from=x%20%3D%20%5Cfrac%7B%28S%20-%20SL(i%29T(i)P%20%2B%20P*%20acc)%7D%7BP%20-%20PT(i)%7D)


On repasse sur `X`:

![Equation](https://math.now.sh?from=X%20%3D%20%5Cfrac%7B%28S%20-%20SL(i%29T(i)P%20%2B%20P*%20acc)%7D%7B1%20-%20T(i)%7D)



Vérifions notre résultat.

> célibataire, je souhaite épargner 10€, mon revenu doit être alors de 10€.

![Equation](https://math.now.sh?from=%5Cfrac%7B%2810%20-%200%20*%200%20*%201%20%2B%201*0%29%7D%7B1%20-%200%7D%20%3D%2010)


> En couple, 2 enfants, je souhaite épargner 53 117€, mon revenu doit être alors de 55 950€.

![Equation](https://math.now.sh?from=%5Cfrac%7B53117%20-%2010065%20*%200.11%20*%203%20%2B%203*0%7D%7B1%20-%200.11%7D%20%5Csimeq%2055950%2C05)



On a donc la formule permettant de déterminer le revenu lorsque lorsque la tranche a été trouvée. Mais comment trouver la tranche puisqu'il nous faut le revenu ? Pour cela, lors de chaque calcul de tranche, je pars de l'hypothèse suivante:
 - On émet l'hypothese que le revenu est égal à la **borne supérieure** de la tranche multipliée par le **nombre de parts**: `X = SU(i) * P`
 - Si `X - (acc + (SU(i) - SL(i)) * T(i)) > S` alors on a trouvé la tranche et on peut appliquer la formule précédente.


## Remarques

Plus les nombres sont grands, plus les arrondis nous jouent des tours et rendent le calcul imprécis lors du reverse.


## J'ai appris des trucs

 - Première utilisation de JSDoc.
 - L'API  ECMAScript Internationalization API [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl), plutôt sympa.
 - L'API [math.now.sh](https://math.now.sh) pour génerer des images de formules mathématiques LaTeX. 
 - Poser le problème mathématiquement m'a aidé à refactor le code.
 - Je suis rendu compte que je suis rouillé en mathématiques.
 - On peut mettre des emojis dans les badges de [shields.io](https://shields.io).
 - C'est qu'on a besoin que d'deux cailloux pour avoir un but (avez-vous les [bases](https://youtu.be/2plxPVOI6lo?t=81) ?)


## Ressources
 - [Calculette impôt 2021 (sur les revenus 2020)](https://www.francetransactions.com/impots/calcul-impot-2020-revenus-2020.html)
 - [Tranches d'impôt 2020 : allez-vous bénéficier des réductions ?](https://www.tacotax.fr/guides/impot-sur-le-revenu/taux-tranches-baremes-impot-sur-le-revenu/tranches-d-impot-2020)