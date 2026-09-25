import { describe, test, expect } from "vitest";
import { BorrowBookHandler } from "../BorrowBookHandler";
import Member from "../../domain/Member";
import Book from "../../domain/Book";

describe("BorrowBookHandler", () => {
    test("should mark the book as unavailable after a loan", async () => {
        const member1 = new Member("first member");
        const book1 = new Book("first book");
        await BorrowBookHandler.handle(member1, book1);
        expect(book1.isAvailable()).toEqual(false);
    });
    test.skip("should prevent a member to borrow after a suspension", async () => {
        const member1 = new Member("first member");
        const book1 = new Book("first book");
        const book2 = new Book("second book");
        await BorrowBookHandler.handle(member1, book1);
        expect(member1.activeLoans).toEqual(1);
        expect(book1.isAvailable()).toEqual(false);
        // member1.markAsSuspended()
        await expect(() =>
            BorrowBookHandler.handle(member1, book2),
        ).rejects.toThrow("ERR_CANNOT_BE_BORROWED");
    });
    test.skip("should prevent a suspended member to borrow a book", async () => {
        const member1 = new Member("first member");
        const book1 = new Book("first book");
        // member1.markAsSuspended();
        await expect(() =>
            BorrowBookHandler.handle(member1, book1),
        ).rejects.toThrow("ERR_CANNOT_BE_BORROWED");
    });
    test("should prevent an unavailable book to be borrowed", async () => {
        const member1 = new Member("first member");
        const book1 = new Book("first book");
        book1.markAsUnavailable();
        await expect(() =>
            BorrowBookHandler.handle(member1, book1),
        ).rejects.toThrow("ERR_CANNOT_BE_BORROWED");
    });
    test("should prevent a member to have more than 3 active loans", async () => {
        const member1 = new Member("first member");
        const book1 = new Book("first book");
        const book2 = new Book("second book");
        const book3 = new Book("third book");
        const book4 = new Book("fourth book");
        expect(member1.activeLoans).toEqual(0);
        await BorrowBookHandler.handle(member1, book1);
        expect(member1.activeLoans).toEqual(1);
        await BorrowBookHandler.handle(member1, book2);
        expect(member1.activeLoans).toEqual(2);
        await BorrowBookHandler.handle(member1, book3);
        expect(member1.activeLoans).toEqual(3);
        await expect(() =>
            BorrowBookHandler.handle(member1, book4),
        ).rejects.toThrow("ERR_CANNOT_BE_BORROWED");
        expect(member1.activeLoans).toEqual(3);
    });
});
