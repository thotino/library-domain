import { addDays } from "date-fns";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Book from "../Book";
import Loan from "../Loan";
import Member from "../Member";
import Money, { Currency } from "../Money";
import Penalty from "../Penalty";

describe("Member", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("should start active with no loans", () => {
        const member = new Member("member-1");

        expect(member.id.value).toBe("member-1");
        expect(member.isSuspended).toBe(false);
        expect(member.activeLoans).toBe(0);
    });

    test("should borrow an available book and create an active loan", () => {
        const member = new Member("member-1");
        const book = new Book("book-1");

        const loan = member.borrow(book);

        expect(loan.memberId.equals(member.id)).toBe(true);
        expect(loan.bookId.equals(book.id)).toBe(true);
        expect(loan.isActive).toBe(true);
        expect(book.isAvailable()).toBe(false);
        expect(member.activeLoans).toBe(1);
    });

    test("should reject borrowing an unavailable book without changing state", () => {
        const member = new Member("member-1");
        const book = new Book("book-1");
        book.markAsUnavailable();

        expect(() => member.borrow(book)).toThrow("ERR_CANNOT_BE_BORROWED");
        expect(book.isAvailable()).toBe(false);
        expect(member.activeLoans).toBe(0);
    });

    test("should accept three active loans and reject the fourth", () => {
        const member = new Member("member-1");
        const books = [
            new Book("book-1"),
            new Book("book-2"),
            new Book("book-3"),
            new Book("book-4"),
        ];

        books.slice(0, 3).forEach(book => member.borrow(book));

        expect(() => member.borrow(books[3])).toThrow("ERR_CANNOT_BE_BORROWED");
        expect(member.activeLoans).toBe(3);
        expect(books[3].isAvailable()).toBe(true);
    });

    test("should reject borrowing while suspended", () => {
        const member = new Member("member-1");
        const book = new Book("book-1");
        const penalty = new Penalty("loan-1", member.id, 21);
        member.applyPenalties([penalty]);

        expect(member.isSuspended).toBe(true);
        expect(() => member.borrow(book)).toThrow("ERR_CANNOT_BE_BORROWED");
        expect(member.activeLoans).toBe(0);
        expect(book.isAvailable()).toBe(true);
    });

    test("should close a loan and return the book without a penalty on time", () => {
        const member = new Member("member-1");
        const book = new Book("book-1");
        const loan = member.borrow(book);

        const penalty = member.handleLoanClosing(loan, book);

        expect(penalty).toBeUndefined();
        expect(loan.isActive).toBe(false);
        expect(book.isAvailable()).toBe(true);
        expect(member.activeLoans).toBe(0);
    });

    test("should create and apply a penalty when a loan is returned late", () => {
        const member = new Member("member-1");
        const book = new Book("book-1");
        const loan = member.borrow(book);
        vi.setSystemTime(addDays(new Date(), Loan.nbOfDays + 1));

        const penalty = member.handleLoanClosing(loan, book);

        expect(penalty).toBeInstanceOf(Penalty);
        expect(penalty?.fees).toEqual(new Money(1, Currency.EUR));
        expect(loan.isActive).toBe(false);
        expect(book.isAvailable()).toBe(true);
        expect(member.activeLoans).toBe(0);
        expect(member.isSuspended).toBe(false);
    });

    test.each([
        "a closed loan",
        "a loan owned by another member",
        "a loan for another book",
    ])("should reject returning %s without mutation", invalidCase => {
        const member = new Member("member-1");
        const book = new Book("book-1");
        const loan = member.borrow(book);
        const otherMember = new Member("member-2");
        const otherBook = new Book("book-2");

        if (invalidCase === "a closed loan") {
            loan.close();
        }
        if (invalidCase === "a loan owned by another member") {
            expect(() => otherMember.handleLoanClosing(loan, book)).toThrow(
                "ERROR_CANNOT_TREAT_LOAN",
            );
        }
        if (invalidCase === "a loan for another book") {
            expect(() => member.handleLoanClosing(loan, otherBook)).toThrow(
                "ERROR_CANNOT_TREAT_LOAN",
            );
        }
        if (invalidCase === "a closed loan") {
            expect(() => member.handleLoanClosing(loan, book)).toThrow(
                "ERROR_CANNOT_TREAT_LOAN",
            );
        }

        expect(book.isAvailable()).toBe(false);
        expect(member.activeLoans).toBe(1);
        expect(loan.isActive).toBe(invalidCase !== "a closed loan");
        expect(otherBook.isAvailable()).toBe(true);
    });

    test("should suspend a member only when unpaid fees exceed twenty euros", () => {
        const member = new Member("member-1");

        member.applyPenalties([new Penalty("loan-1", member.id, 20)]);
        expect(member.isSuspended).toBe(false);

        member.applyPenalties([new Penalty("loan-2", member.id, 21)]);
        expect(member.isSuspended).toBe(true);
    });

    test("should reactivate a member after all penalties are paid", () => {
        const member = new Member("member-1");
        const penalty = new Penalty("loan-1", member.id, 21);
        member.applyPenalties([penalty]);
        penalty.pay(new Money(21, Currency.EUR));

        member.applyPenalties([penalty]);

        expect(member.isSuspended).toBe(false);
    });
});
