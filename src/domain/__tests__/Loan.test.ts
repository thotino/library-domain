import { addDays } from "date-fns";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import BookId from "../BookId";
import DueDate from "../DueDate";
import Loan from "../Loan";
import MemberId from "../MemberId";
import Penalty from "../Penalty";

describe("Loan", () => {
    const memberId = MemberId.fromString("member-1");
    const bookId = BookId.fromString("book-1");

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("should start active and preserve its member, book, and due date", () => {
        const dueDate = new DueDate(new Date("2026-01-15T00:00:00.000Z"));
        const loan = new Loan(memberId, bookId, dueDate);

        expect(loan.id).toEqual(expect.any(String));
        expect(loan.memberId).toBe(memberId);
        expect(loan.bookId).toBe(bookId);
        expect(loan.isActive).toBe(true);
        expect(loan.dueDate.value).toEqual(dueDate.value);
    });

    test("should set the default due date fourteen days from creation", () => {
        const now = new Date("2026-01-01T00:00:00.000Z");
        vi.setSystemTime(now);

        const loan = new Loan(memberId, bookId);

        expect(loan.dueDate.value).toEqual(addDays(now, Loan.nbOfDays));
    });

    test("should close once and reject a second close", () => {
        const loan = new Loan(memberId, bookId);

        loan.close();

        expect(loan.isActive).toBe(false);
        expect(() => loan.close()).toThrow("ERR_LOAN_ALREADY_COMPLETED");
    });

    test("should not create a penalty before or exactly at the due date", () => {
        const dueDate = new Date("2026-01-15T00:00:00.000Z");
        const loan = new Loan(memberId, bookId, new DueDate(dueDate));

        vi.setSystemTime(new Date("2026-01-14T00:00:00.000Z"));
        expect(loan.createPenalty()).toBeUndefined();

        vi.setSystemTime(dueDate);
        expect(loan.createPenalty()).toBeUndefined();
    });

    test("should create one euro of penalty per late day", () => {
        const loan = new Loan(
            memberId,
            bookId,
            new DueDate(new Date("2026-01-15T00:00:00.000Z")),
        );
        vi.setSystemTime(new Date("2026-01-18T00:00:00.000Z"));

        const penalty = loan.createPenalty();

        expect(penalty).toBeInstanceOf(Penalty);
        expect(penalty?.loanId).toBe(loan.id);
        expect(penalty?.memberId).toBe(memberId);
        expect(penalty?.fees.amount).toBe(3);
    });

    test("should not create a penalty after the loan is closed", () => {
        const loan = new Loan(
            memberId,
            bookId,
            new DueDate(new Date("2026-01-15T00:00:00.000Z")),
        );
        vi.setSystemTime(new Date("2026-01-18T00:00:00.000Z"));

        loan.close();

        expect(loan.createPenalty()).toBeUndefined();
    });
});
