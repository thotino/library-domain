# Exercice : système de prêt de livres

Durée visée : **1h à 2h**.

## Le métier

Tu développes le cœur d’une petite bibliothèque.

Un utilisateur peut emprunter des livres, les rendre et payer des pénalités de retard.

Le but n’est **pas** de faire une API ou une base de données : uniquement le domaine.

---

## Cas d’usage

### 1. Emprunter un livre

Un membre peut emprunter un livre si :

* le livre est disponible ;
* le membre n'est pas suspendu ;
* le membre n'a pas déjà 3 emprunts actifs.

Quand l'emprunt est créé :

* le livre devient indisponible ;
* une date d'échéance est fixée à J+14.

---

### 2. Retourner un livre

Quand un livre est rendu :

* il redevient disponible ;
* si la date de retour dépasse la date d'échéance :

  * une pénalité est créée.

Règle :

* 1€ par jour de retard.

---

### 3. Payer une pénalité

Un membre peut payer une pénalité :

* uniquement si elle n'est pas déjà payée.

Si le total des pénalités impayées dépasse 20€ :

* le membre devient suspendu.

Quand tout est payé :

* le membre redevient actif.

---

# Contraintes de design (importantes)

Le but est de t'obliger à appliquer le pattern.

## 1. Pas d'objets anémiques

Interdit :

```ts
member.suspended = true;
loan.returned = true;
book.available = false;
```

Tu dois avoir :

```ts
member.suspend();
loan.close();
book.markAsBorrowed();
```

---

## 2. Utiliser des Value Objects

Crée au minimum :

```text
Money
MemberId
BookId
DueDate
```

Par exemple :

```ts
new Money(10, "EUR")
```

Et :

```ts
money.add(other)
money.multiply(3)
```

---

## 3. Entités

Tu peux partir sur :

```text
Member
Book
Loan
Penalty
```

---

## 4. Service applicatif mince

Tu peux avoir :

```ts
BorrowBookHandler
ReturnBookHandler
PayPenaltyHandler
```

Mais ils ne font que :

```text
charger
→ appeler le domaine
→ sauvegarder
```

Pas de logique métier dedans.

---

## 5. Repositories en interface uniquement

```ts
interface MemberRepository
interface BookRepository
interface LoanRepository
```

Fais une implémentation en mémoire :

```ts
InMemoryMemberRepository
```

Pas de DB.

---

# Structure cible

```text
domain/
    Member.ts
    Book.ts
    Loan.ts
    Penalty.ts

    Money.ts
    MemberId.ts
    BookId.ts

application/
    BorrowBookHandler.ts
    ReturnBookHandler.ts
    PayPenaltyHandler.ts

infrastructure/
    InMemoryRepositories.ts

tests/
```

---

# Tests à écrire

Minimum :

```text
✓ un membre suspendu ne peut pas emprunter
✓ impossible d'emprunter un livre indisponible
✓ un retard génère une pénalité
✓ un membre avec >20€ d'impayés est suspendu
✓ payer toutes les pénalités réactive le membre
```
