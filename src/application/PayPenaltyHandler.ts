import Member from "../domain/Member";
import MemberId from "../domain/MemberId";
import Money, { Currency } from "../domain/Money";
import Penalty from "../domain/Penalty";
import {
    memberRepository,
    penaltyRepository,
} from "../infrastructure/InMemoryRepositories";

export class PayPenaltyHandler {
    static async checkMemberPenalties(member: Member, penalties: Penalty[]) {
        return member.applyPenalties(penalties);
    }
    static paySinglePenalty(penalty: Penalty, money: Money) {
        if (!penalty.isPaid && money.isGreaterThanOrEqual(penalty.fees)) {
            penalty.markAsPaid();
            return money.subtract(penalty.fees);
        } else {
            return money;
        }
    }
    static async handle(
        penalties: Penalty[],
        paidMoney: Money,
        member: Member,
    ) {
        let change = paidMoney;
        for (const penalty of penalties) {
            change = PayPenaltyHandler.paySinglePenalty(penalty, change);
        }
        return member.applyPenalties(penalties);
    }
}

export class PayPenaltyUseCase {
    static async execute(memberId: string, paidAmount: number) {
        const paidMoney = new Money(paidAmount, Currency.EUR);
        const member = await memberRepository.findOne(
            MemberId.fromString(memberId),
        );
        if (member == null) {
            throw new Error("ERR_MEMBER_NOT_FOUND");
        }
        const penalties = await penaltyRepository.findByMemberId(member.id);
        // await PayPenaltyHandler.checkMemberPenalties(member, penalties);
        await PayPenaltyHandler.handle(penalties, paidMoney, member);
        // await PayPenaltyHandler.checkMemberPenalties(member, penalties)
    }
}
