import BookId from "./BookId";
import DueDate from "./DueDate";
import MemberId from "./MemberId";
import { addDays, differenceInDays } from "date-fns";
import Penalty from "./Penalty";

export default class Loan {
    #id: string;
    #memberId: MemberId;
    #bookId: BookId;
    #isActive: boolean = true;
    #dueDate: DueDate;
    static readonly nbOfDays: number = 14;
    constructor(memberId: MemberId, bookId: BookId, dueDate?: DueDate) {
        this.#id = crypto.randomUUID();
        this.#bookId = bookId;
        this.#memberId = memberId;
        this.#dueDate =
            dueDate ?? new DueDate(addDays(new Date(), Loan.nbOfDays));
    }
    get id() {
        return this.#id;
    }
    get isActive() {
        return this.#isActive;
    }
    get dueDate() {
        return this.#dueDate;
    }
    get memberId() {
        return this.#memberId;
    }
    get bookId() {
        return this.#bookId;
    }
    #calculateDifferenceInDays() {
        const now = new Date();
        const nbDays = differenceInDays(now, this.#dueDate.value);
        return Math.max(nbDays, 0)
    }
    close() {
        if (this.#isActive === true) {
            this.#isActive = false;
            return;
        }
        throw new Error("ERR_LOAN_ALREADY_COMPLETED");
    }
    createPenalty() {
        const nbDaysFromDueDate = this.#calculateDifferenceInDays()
        if (this.#isActive && nbDaysFromDueDate > 0) {
            return new Penalty(this.#id, this.#memberId, nbDaysFromDueDate);
        }
    }
}
