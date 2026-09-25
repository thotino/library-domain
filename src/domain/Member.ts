import Book from "./Book";
import Loan from "./Loan";
import MemberId from "./MemberId";
import Money, { Currency } from "./Money";
import Penalty from "./Penalty";

export default class Member {
    #id: MemberId;
    #isSuspended: boolean = false;
    #activeLoans: number = 0;
    constructor(id: string) {
        this.#id = MemberId.fromString(id);
    }
    #markAsSuspended() {
        if (this.#isSuspended == false) {
            this.#isSuspended = true;
        }
    }
    #markAsUnsuspended() {
        if (this.#isSuspended == true) {
            this.#isSuspended = false;
        }
    }
    canBorrow(book: Book) {
        return (
            this.#isSuspended === false &&
            this.#activeLoans < 3 &&
            book.isAvailable()
        );
    }
    borrow(book: Book) {
        if (!this.canBorrow(book)) {
            throw new Error("ERR_CANNOT_BE_BORROWED");
        }
        book.markAsUnavailable();
        this.#incrementActiveLoans();
        return new Loan(this.#id, book.id);
    }
    returnLoan(loan: Loan, book: Book) {
        if (
            !loan.isActive ||
            !loan.memberId.equals(this.#id) ||
            !loan.bookId.equals(book.id)
        ) {
            throw new Error("ERROR_CANNOT_TREAT_LOAN");
        }
        book.markAsAvailable();
        const penalty = loan.createPenalty();
        loan.close();
        this.#decrementActiveLoans();
        return penalty;
    }
    get id() {
        return this.#id;
    }
    get activeLoans() {
        return this.#activeLoans;
    }
    get isSuspended() {
        return this.#isSuspended;
    }
    #incrementActiveLoans() {
        if (this.#activeLoans >= 3) {
            throw new Error("ERROR_CAN_EXCEED_MAX_ACTIVE_LOANS");
        }
        this.#activeLoans++;
    }
    #decrementActiveLoans() {
        this.#activeLoans = Math.max(0, this.#activeLoans - 1);
    }
    static readonly suspensionThreshold = new Money(20, Currency.EUR);
    #applyPenaltiesDebt(debt: Money) {
        if (debt.isGreaterThan(Member.suspensionThreshold)) {
            this.#markAsSuspended();
        } else {
            this.#markAsUnsuspended();
        }
    }
    applyPenalties(penalties: Penalty[]) {
        const fees = Penalty.calculateFees(penalties);
        this.#applyPenaltiesDebt(fees);
    }
}
