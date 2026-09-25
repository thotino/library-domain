import Member from "../domain/Member";
import MemberId from "../domain/MemberId";
import Money, { Currency } from "../domain/Money";
import Penalty from "../domain/Penalty";
import { MemberRepositoryInterface } from "../domain/repositories/MemberRepository";
import { PenaltyRepositoryInterface } from "../domain/repositories/PenaltyRepository";

export class PayPenaltyHandler {
    static async checkMemberPenalties(member: Member, penalties: Penalty[]) {
        return member.applyPenalties(penalties);
    }
    static async handle(
        penalties: Penalty[],
        paidMoney: Money,
        member: Member,
    ) {
        let change = paidMoney;
        for (const penalty of penalties) {
            change = penalty.pay(change);
        }
        return member.applyPenalties(penalties);
    }
}

export class PayPenaltyUseCase {
    constructor(
        readonly memberRepository: MemberRepositoryInterface,
        readonly penaltyRepository: PenaltyRepositoryInterface,
    ) {}
    async execute(memberId: string, paidAmount: number) {
        const paidMoney = new Money(paidAmount, Currency.EUR);
        const member = await this.memberRepository.findOne(
            MemberId.fromString(memberId),
        );
        if (member == null) {
            throw new Error("ERR_MEMBER_NOT_FOUND");
        }
        const penalties = await this.penaltyRepository.findByMemberId(
            member.id,
        );
        await PayPenaltyHandler.handle(penalties, paidMoney, member);
        await this.memberRepository.save(member);
        await this.penaltyRepository.save(penalties);
    }
}
