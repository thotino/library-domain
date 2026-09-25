import Book from "../domain/Book";
import BookId from "../domain/BookId";
import Loan from "../domain/Loan";
import Member from "../domain/Member";
import { BookRepositoryInterface } from "../domain/repositories/BookRepository";
import { LoanRepositoryInterface } from "../domain/repositories/LoanRepository";
import { MemberRepositoryInterface } from "../domain/repositories/MemberRepository";
import { PenaltyRepositoryInterface } from "../domain/repositories/PenaltyRepository";

export class ReturnBookHandler {
    static async handle(loan: Loan, book: Book, member: Member) {
        return member.handleLoanClosing(loan, book);
    }
}

export class ReturnBookUseCase {
    constructor(
        readonly memberRepository: MemberRepositoryInterface,
        readonly bookRepository: BookRepositoryInterface,
        readonly loanRepository: LoanRepositoryInterface,
        readonly penaltyRepository: PenaltyRepositoryInterface,
    ) {}
    async execute(bookId: string) {
        const book = await this.bookRepository.findOne(
            BookId.fromString(bookId),
        );
        if (book == null) {
            throw new Error("ERR_BOOK_NOT_FOUND");
        }
        const loan = await this.loanRepository.findOneByBookId(book.id);
        if (loan == null) {
            throw new Error("ERR_LOAN_NOT_FOUND");
        }
        const member = await this.memberRepository.findOne(loan.memberId);
        if (member == null) {
            throw new Error("ERR_MEMBER_NOT_FOUND");
        }
        const penalty = await ReturnBookHandler.handle(loan, book, member);
        if (penalty != null) {
            await this.penaltyRepository.create(penalty);
        }
    }
}
