import Member from "../Member";
import MemberId from "../MemberId";

export interface MemberRepositoryInterface {
    create: (member: Member) => void;
    findOne: (id: MemberId) => Promise<Member | undefined>;
    save: (member: Member) => void;
}
