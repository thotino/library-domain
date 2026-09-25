import BookId from "../domain/BookId";
import Loan from "../domain/Loan";
import MemberId from "../domain/MemberId";
import { LoanRepositoryInterface } from "../domain/repositories/LoanRepository";

export class LoanRepository implements LoanRepositoryInterface {
    #loans: Loan[];
    constructor() {
        this.#loans = new Array<Loan>();
    }
    async save(loan: Loan) {
        const index = this.#loans.findIndex(
            existingLoan => existingLoan.id === loan.id,
        );

        if (index !== -1) {
            this.#loans[index] = loan;
        }
    }
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
