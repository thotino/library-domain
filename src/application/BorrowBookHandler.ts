import Book from "../domain/Book";
import BookId from "../domain/BookId";
import Member from "../domain/Member";
import MemberId from "../domain/MemberId";
import { BookRepositoryInterface } from "../domain/repositories/BookRepository";
import { LoanRepositoryInterface } from "../domain/repositories/LoanRepository";
import { MemberRepositoryInterface } from "../domain/repositories/MemberRepository";

export class BorrowBookHandler {
    static async handle(member: Member, book: Book) {
        return member.borrow(book);
    }
}

export class BorrowBookUseCase {
    constructor(
        readonly memberRepository: MemberRepositoryInterface,
        readonly bookRepository: BookRepositoryInterface,
        readonly loanRepository: LoanRepositoryInterface,
    ) {}
    async execute(memberId: string, bookId: string) {
        const member = await this.memberRepository.findOne(
            MemberId.fromString(memberId),
        );
        if (member == null) {
            throw new Error("ERR_MEMBER_NOT_FOUND");
        }
        const book = await this.bookRepository.findOne(
            BookId.fromString(bookId),
        );
        if (book == null) {
            throw new Error("ERR_BOOK_NOT_FOUND");
        }
        const loan = await BorrowBookHandler.handle(member, book);
        await this.loanRepository.create(loan);
    }
}
