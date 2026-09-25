import { describe, test, expect } from "vitest";
import { ReturnBookHandler } from "../ReturnBookHandler";
import Book from "../../domain/Book";
import Loan from "../../domain/Loan";
import Member from "../../domain/Member";
import Penalty from "../../domain/Penalty";
import { subDays } from "date-fns";
import DueDate from "../../domain/DueDate";

describe("ReturnBookHandler", () => {
    test("should return a null penalty if the book is returned before the due date", async () => {
        const book1 = new Book("first book");
        const member1 = new Member("first member");
        const currentDate = new Date();
        const loan = new Loan(member1.id, book1.id, new DueDate(currentDate));
        const returnBookOutcome = await ReturnBookHandler.handle(
            loan,
            book1,
            member1,
        );
        expect(returnBookOutcome).toBeUndefined()
    });
    test("should generate a penalty from a delay", async () => {
        const book1 = new Book("first book");
        const member1 = new Member("first member");
        const currentDate = new Date();
        const loan = new Loan(
            member1.id,
            book1.id,
            new DueDate(subDays(currentDate, 1)),
        );
        const returnBookOutcome = await ReturnBookHandler.handle(
            loan,
            book1,
            member1,
        );
        expect(returnBookOutcome).toBeInstanceOf(Penalty);
        expect(returnBookOutcome?.fees.amount).toEqual(1);
    });
});
