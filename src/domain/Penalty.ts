import MemberId from "./MemberId";
import Money, { Currency } from "./Money";

export default class Penalty {
    #id: string;
    #isPaid: boolean = false;
    #loanId: string;
    #memberId: MemberId;
    #fees: Money;
    constructor(loanId: string, memberId: MemberId, differenceInDays: number) {
        this.#loanId = loanId;
        this.#memberId = memberId;
        this.#fees = new Money(differenceInDays, Currency.EUR);
        this.#id = crypto.randomUUID();
    }
    pay(money: Money) {
        if (!this.#isPaid && money.isGreaterThanOrEqual(this.#fees)) {
            this.#markAsPaid();
            return money.subtract(this.#fees);
        }
        return money;
    }
    #markAsPaid() {
        if (this.#isPaid == false) {
            this.#isPaid = true;
            return;
        }
        throw new Error("ERROR_PENALTY_ALREADY_PAID");
    }
    get memberId() {
        return this.#memberId;
    }
    get isPaid() {
        return this.#isPaid;
    }
    get fees() {
        return this.#fees;
    }
    get loanId() {
        return this.#loanId;
    }
    get id() {
        return this.#id;
    }
    static calculateFees(penalties: Penalty[]) {
        const fees = penalties.reduce(
            (acc, penalty) => {
                return !penalty.isPaid
                    ? acc.add(penalty.fees)
                    : acc.add(new Money(0, Currency.EUR));
            },
            new Money(0, Currency.EUR),
        );
        return fees;
    }
}
