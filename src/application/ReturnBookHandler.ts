import Book from "../domain/Book";
import BookId from "../domain/BookId";
import Loan from "../domain/Loan";
import Member from "../domain/Member";
import {
    bookRepository,
    loanRepository,
    memberRepository,
    penaltyRepository,
} from "../infrastructure/InMemoryRepositories";

export class ReturnBookHandler {
    static async handle(loan: Loan, book: Book, member: Member) {
        return member.handleLoanClosing(loan, book);
    }
}

export class ReturnBookUseCase {
    static async execute(bookId: string) {
        const book = await bookRepository.findOne(BookId.fromString(bookId));
        if (book == null) {
            throw new Error("ERR_BOOK_NOT_FOUND");
        }
        const loan = await loanRepository.findOneByBookId(book.id);
        if (loan == null) {
            throw new Error("ERR_LOAN_NOT_FOUND");
        }
        const member = await memberRepository.findOne(loan.memberId);
        if (member == null) {
            throw new Error("ERR_MEMBER_NOT_FOUND");
        }
        const penalty = await ReturnBookHandler.handle(loan, book, member);
        if (penalty != null) {
            await penaltyRepository.create(penalty);
        }
    }
}
