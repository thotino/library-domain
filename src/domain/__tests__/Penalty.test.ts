import { describe, expect, test } from "vitest";
import MemberId from "../MemberId";
import Money, { Currency } from "../Money";
import Penalty from "../Penalty";

describe("Penalty", () => {
    const memberId = MemberId.fromString("member-1");

    test("should expose its identity, fees, and unpaid state", () => {
        const penalty = new Penalty("loan-1", memberId, 3);

        expect(penalty.id).toEqual(expect.any(String));
        expect(penalty.loanId).toBe("loan-1");
        expect(penalty.memberId).toBe(memberId);
        expect(penalty.fees).toEqual(new Money(3, Currency.EUR));
        expect(penalty.isPaid).toBe(false);
    });

    test("should leave the penalty unpaid when the payment is insufficient", () => {
        const penalty = new Penalty("loan-1", memberId, 3);
        const payment = new Money(2, Currency.EUR);

        const change = penalty.pay(payment);

        expect(change).toBe(payment);
        expect(penalty.isPaid).toBe(false);
    });

    test.each([
        [new Money(3, Currency.EUR), 0],
        [new Money(5, Currency.EUR), 2],
    ])("should mark the penalty paid and return change", (payment, change) => {
        const penalty = new Penalty("loan-1", memberId, 3);

        const result = penalty.pay(payment);

        expect(result).toEqual(new Money(change, Currency.EUR));
        expect(penalty.isPaid).toBe(true);
    });

    test("should reject payment in a different currency", () => {
        const penalty = new Penalty("loan-1", memberId, 3);

        expect(() => penalty.pay(new Money(3, Currency.USD))).toThrow(
            "ERR_INVALID_MONEY_OPERATION",
        );
        expect(penalty.isPaid).toBe(false);
    });

    test("should return a repeated payment without changing an already paid penalty", () => {
        const penalty = new Penalty("loan-1", memberId, 3);
        const firstPayment = new Money(3, Currency.EUR);
        const secondPayment = new Money(4, Currency.EUR);

        penalty.pay(firstPayment);
        const result = penalty.pay(secondPayment);

        expect(result).toBe(secondPayment);
        expect(penalty.isPaid).toBe(true);
    });

    test("should calculate only unpaid fees", () => {
        const unpaid = new Penalty("loan-1", memberId, 3);
        const paid = new Penalty("loan-2", memberId, 5);
        paid.pay(new Money(5, Currency.EUR));

        expect(Penalty.calculateFees([])).toEqual(new Money(0, Currency.EUR));
        expect(Penalty.calculateFees([unpaid, paid])).toEqual(
            new Money(3, Currency.EUR),
        );
    });
});
