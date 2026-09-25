# AGENTS

## Présentation du module

Ce module met en oeuvre le concept du domain driven development. Il s'inspire de l'article suivant: https://deniskyashif.com/2026/04/14/the-domain-model-pattern-in-practice/.

Le but est de construire un système simple de prêt de livres. Il faut construire ce système en distinguant:
* les objets métiers
* les entités
* les services d'applications
Il faut s'assurer que tous les principes de DDD sont respectés:
* les règles métier vivent dans leurs domaines respectifs
* les value objects sont utilisés et apportent bien de la valeur ajouté
* les handlers font juste de l'orchestration

Dans le document [ASSESSMENT.md](./ASSESSMENT.md), se trouve le cas d'usage demandé avec les instructions qui ont permis de construire ce service.

## Structure du module
Ce module est structuré en 3 parties:
* **application**: elle contient les orchestateurs (handlers) ultra-légers
* **domain**: elle contient les value objects et les entités
* **infrastructure**: elle contient uniquement des classes et objets de répository

## Gestion des modifications

Lorsqu'une modification est apporté, il faut impérativement s'assurer que les règles de linting sont respectés et que les tests passent.
* Lancer les tests unitaires avec la commande `npm run test`
* Vérifier le linter avec `npm run lint`
* Formatter le code avec `npm run prettier`