export enum Currency {
    EUR = "EUR",
    USD = "USD",
    GBP = "GBP",
}
export default class Money {
    constructor(
        public readonly amount: number,
        public readonly currency: Currency,
    ) {
        if (amount < 0) {
            throw new Error("ERR_NEGATIVE_AMOUNT_MONEY_OPERATION");
        }
        this.amount = amount;
        this.currency = currency;
    }
    add(other: Money) {
        if (this.currency != other.currency) {
            throw new Error("ERR_INVALID_MONEY_OPERATION");
        }
        return new Money(this.amount + other.amount, this.currency);
    }
    subtract(other: Money) {
        if (this.currency != other.currency) {
            throw new Error("ERR_INVALID_MONEY_OPERATION");
        }
        return new Money(this.amount - other.amount, this.currency);
    }
    isGreaterThan(other: Money) {
        if (this.currency != other.currency) {
            throw new Error("ERR_INVALID_MONEY_OPERATION");
        }
        return this.amount > other.amount;
    }
    isGreaterThanOrEqual(other: Money) {
        if (this.currency != other.currency) {
            throw new Error("ERR_INVALID_MONEY_OPERATION");
        }
        return this.amount >= other.amount;
    }
    equals(other: Money) {
        if (this.currency != other.currency) {
            throw new Error("ERR_INVALID_MONEY_OPERATION");
        }
        return this.amount === other.amount;
    }
}
