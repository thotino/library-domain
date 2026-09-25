import Book from "../domain/Book";
import BookId from "../domain/BookId";
import Loan from "../domain/Loan";
import Member from "../domain/Member";
import MemberId from "../domain/MemberId";
import Penalty from "../domain/Penalty";

interface MemberRepositoryInterface {
    create: (member: Member) => void;
    findOne: (id: MemberId) => Promise<Member | undefined>;
}

interface BookRepositoryInterface {
    create: (book: Book) => void;
    findOne: (id: BookId) => Promise<Book | undefined>;
}

interface LoanRepositoryInterface {
    create: (loan: Loan) => void;
    findOneByBookId: (id: BookId) => Promise<Loan | undefined>;
    findActiveByMemberId: (id: MemberId) => Promise<Loan[]>;
}

interface PenaltyRepositoryInterface {
    create: (penalty: Penalty) => void;
    findByMemberId: (id: MemberId) => Promise<Penalty[]>;
}

class MemberRepository implements MemberRepositoryInterface {
    #members: Member[];
    constructor() {
        this.#members = new Array<Member>();
    }
    async create(member: Member) {
        return this.#members.push(member);
    }
    async findOne(id: MemberId) {
        return this.#members.find(member => member.id.equals(id));
    }
}
const memberRepository = new MemberRepository();

class BookRepository implements BookRepositoryInterface {
    #books: Book[];
    constructor() {
        this.#books = new Array<Book>();
    }
    async create(book: Book) {
        return this.#books.push(book);
    }
    async findOne(id: BookId) {
        return this.#books.find(book => book.id.equals(id));
    }
}
const bookRepository = new BookRepository();

class LoanRepository implements LoanRepositoryInterface {
    #loans: Loan[];
    constructor() {
        this.#loans = new Array<Loan>();
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
const loanRepository = new LoanRepository();

class PenaltyRepository implements PenaltyRepositoryInterface {
    #penalties: Penalty[];
    constructor() {
        this.#penalties = new Array<Penalty>();
    }
    async create(penalty: Penalty) {
        return this.#penalties.push(penalty);
    }
    async findByMemberId(memberId: MemberId) {
        return this.#penalties.filter(penalty =>
            penalty.memberId.equals(memberId),
        );
    }
}
const penaltyRepository = new PenaltyRepository();
export { memberRepository, bookRepository, loanRepository, penaltyRepository };
