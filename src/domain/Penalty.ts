import { differenceInDays } from "date-fns";
import MemberId from "./MemberId";
import Money, { Currency } from "./Money";
import DueDate from "./DueDate";

export default class Penalty {
    #id: string;
    #isPaid: boolean = false;
    #loanId: string;
    #loanDueDate: DueDate;
    #memberId: MemberId;
    #fees: Money;
    constructor(loanId: string, loanDueDate: DueDate, memberId: MemberId) {
        this.#loanId = loanId;
        this.#loanDueDate = loanDueDate;
        this.#memberId = memberId;
        this.#fees = this.#calculateFee();
        this.#id = crypto.randomUUID();
    }
    markAsPaid() {
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
    #calculateFee() {
        const now = new Date();
        const nbDays = differenceInDays(now, this.#loanDueDate.value);
        return new Money(Math.max(nbDays, 0), Currency.EUR);
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
