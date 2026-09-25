import Book from "../domain/Book";
import BookId from "../domain/BookId";
import Member from "../domain/Member";
import MemberId from "../domain/MemberId";
import {
    bookRepository,
    loanRepository,
    memberRepository,
} from "../infrastructure/InMemoryRepositories";

export class BorrowBookHandler {
    static async handle(member: Member, book: Book) {
        return member.borrow(book);
    }
}

export class BorrowBookUseCase {
    static async execute(memberId: string, bookId: string) {
        const member = await memberRepository.findOne(
            MemberId.fromString(memberId),
        );
        if (member == null) {
            throw new Error("ERR_MEMBER_NOT_FOUND");
        }
        const book = await bookRepository.findOne(BookId.fromString(bookId));
        if (book == null) {
            throw new Error("ERR_BOOK_NOT_FOUND");
        }
        const loan = await BorrowBookHandler.handle(member, book);
        await loanRepository.create(loan);
    }
}
