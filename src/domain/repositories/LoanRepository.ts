import BookId from "../BookId";
import Loan from "../Loan";
import MemberId from "../MemberId";

export interface LoanRepositoryInterface {
    create: (loan: Loan) => void;
    findOneByBookId: (id: BookId) => Promise<Loan | undefined>;
    findActiveByMemberId: (id: MemberId) => Promise<Loan[]>;
    save: (loan: Loan) => void;
}
