import BookId from "../domain/BookId";
import Loan from "../domain/Loan";
import MemberId from "../domain/MemberId";
import { LoanRepositoryInterface } from "../domain/repositories/LoanRepository";

export class LoanRepository implements LoanRepositoryInterface {
    #loans: Loan[];
    constructor() {
        this.#loans = new Array<Loan>();
    }
    save(loan: Loan) {}
    async create(loan: Loan) {
        return this.#loans.push(loan);
    }
    async findOneByBookId(bookId: BookId) {
        return this.#loans.find(loan => loan.bookId.equals(bookId));
    }
    async findActiveByMemberId(memberId: MemberId) {
        return this.#loans.filter(
            loan => loan.memberId.equals(memberId) && loan.isActive === true,
        );
    }
}
