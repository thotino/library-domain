# Library Domain

Petit module de gestion de bibliothèque conçu selon les principes du Domain-Driven Design (DDD), avec un focus sur le cœur de métier plutôt que sur l'infrastructure.

Le service permet à un membre de :

- emprunter un livre ;
- rendre un livre ;
- payer une pénalité de retard ;
- voir son statut évoluer selon les règles métier.

---

## Présentation du service

Ce module modélise un système de prêt de livres simple et robuste.

### Règles métier clés

- Un livre ne peut être emprunté que s'il est disponible.
- Un membre ne peut pas être suspendu et ne peut pas avoir plus de 3 emprunts actifs.
- La date d'échéance est fixée à J+14.
- Un retour en retard génère une pénalité de 1 € par jour.
- Si le total des pénalités impayées dépasse 20 €, le membre est suspendu.
- Le paiement de toutes les pénalités réactive le membre.

Cette logique est encapsulée dans le domaine et non dans des services techniques.

---

## Pattern utilisé

Le projet suit le pattern du Domain Model, inspiré du DDD.

### Principes appliqués

- Les règles métier vivent dans le domaine.
- Les objets de valeur sont utilisés pour représenter des concepts fiables comme `Money`, `MemberId`, `BookId` et `DueDate`.
- Les entités portent leur propre comportement (`Member`, `Book`, `Loan`, `Penalty`).
- Les handlers applicatifs sont légers et ne font que l'orchestration : charger les objets, appeler le domaine, sauvegarder le résultat.
- Les repositories sont limités à l'infrastructure en mémoire.

### Exemple de conception

Au lieu d'analyser des attributs publics, le domaine expose des méthodes comme :

```ts
member.borrow(book)
loan.close()
book.markAsUnavailable()
```

Cela permet d'éviter les objets anémiques et de garder les règles métier au cœur du modèle.

---

## Structure du projet

```text
src/
├── application/
│   ├── BorrowBookHandler.ts
│   ├── ReturnBookHandler.ts
│   ├── PayPenaltyHandler.ts
│   └── __tests__/
├── domain/
│   ├── Book.ts
│   ├── BookId.ts
│   ├── DueDate.ts
│   ├── Loan.ts
│   ├── Member.ts
│   ├── MemberId.ts
│   ├── Money.ts
│   ├── Penalty.ts
│   └── __tests__/
├── infrastructure/
│   └── InMemoryRepositories.ts
└── ...
```

### Rôle de chaque couche

#### `domain/`
Contient les objets métier, les value objects, les règles de validation et les comportements.

#### `application/`
Contient les use cases / handlers qui orchestrent les interactions avec le domaine.

#### `infrastructure/`
Contient les implémentations techniques, ici des repositories en mémoire.

---

## Dépendances

### Dépendances runtime

- `date-fns` : gestion des dates, notamment pour calculer la date d'échéance.

### Dépendances de développement

- `vitest` : exécution des tests unitaires.
- `typescript` : compilation du code TypeScript.
- `eslint` : vérification du style et de la qualité du code.
- `prettier` : formatage du code.

---

## Commandes utiles

Installer les dépendances :

```bash
npm install
```

Lancer les tests :

```bash
npm run test
```

Vérifier le lint :

```bash
npm run lint
```

Formater le code :

```bash
npm run prettier
```

---

## Maintenance du module

Pour maintenir la cohérence du projet, il est conseillé de :

1. garder les règles métier dans le domaine ;
2. éviter les mutations directes sur les objets ;
3. conserver les handlers applicatifs légers ;
4. exécuter les tests et le lint avant chaque validation.

Ce module est volontairement pensé comme un exemple pédagogique de design centré sur le métier, simple à comprendre et facile à étendre.
