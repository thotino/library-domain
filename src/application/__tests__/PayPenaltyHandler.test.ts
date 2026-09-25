import { describe, test, expect } from "vitest";
import { PayPenaltyHandler } from "../PayPenaltyHandler";
import Member from "../../domain/Member";
import Loan from "../../domain/Loan";
import Book from "../../domain/Book";
import { subDays } from "date-fns";
import Money, { Currency } from "../../domain/Money";
import DueDate from "../../domain/DueDate";

describe("PayPenaltyHandler", () => {
    test("should suspend a member", async () => {
        const member1 = new Member("first member");
        const book1 = new Book("first book");
        const loan1 = new Loan(
            member1.id,
            book1.id,
            new DueDate(subDays(new Date(), 25)),
        );
        const penalty1 = loan1.createPenalty()!;
        await PayPenaltyHandler.checkMemberPenalties(member1, [penalty1]);
        expect(member1.isSuspended).toEqual(true);
    });
    test("should unsuspend member after paying penalties", async () => {
        const member1 = new Member("first member");
        const book1 = new Book("first book");
        const loan1 = new Loan(
            member1.id,
            book1.id,
            new DueDate(subDays(new Date(), 25)),
        );
        const penalty1 = loan1.createPenalty()!;
        expect(penalty1).toBeDefined();
        expect(penalty1.fees.amount).toEqual(25);
        member1.applyPenalties([penalty1]);
        expect(member1.isSuspended).toEqual(true);

        await PayPenaltyHandler.handle(
            [penalty1],
            new Money(25, Currency.EUR),
            member1,
        );
        member1.applyPenalties([penalty1]);
        expect(member1.isSuspended).toEqual(false);
        expect(penalty1.isPaid).toEqual(true);
    });
});
