import Member from "../domain/Member";
import MemberId from "../domain/MemberId";
import { MemberRepositoryInterface } from "../domain/repositories/MemberRepository";

export class MemberRepository implements MemberRepositoryInterface {
    #members: Member[];
    constructor() {
        this.#members = new Array<Member>();
    }
    save(member: Member) {}
    async create(member: Member) {
        return this.#members.push(member);
    }
    async findOne(id: MemberId) {
        return this.#members.find(member => member.id.equals(id));
    }
}
