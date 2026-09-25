import { describe, expect, test } from "vitest";
import Money, { Currency } from "../Money";

describe("Money", () => {
    test("should create zero and positive amounts", () => {
        expect(new Money(0, Currency.EUR).amount).toBe(0);
        expect(new Money(12.5, Currency.EUR).amount).toBe(12.5);
    });

    test("should reject negative amounts", () => {
        expect(() => new Money(-1, Currency.EUR)).toThrow(
            "ERR_NEGATIVE_AMOUNT_MONEY_OPERATION",
        );
    });

    test("should add amounts in the same currency without mutating either value", () => {
        const first = new Money(8, Currency.EUR);
        const second = new Money(5, Currency.EUR);

        const result = first.add(second);

        expect(result).toEqual(new Money(13, Currency.EUR));
        expect(first).toEqual(new Money(8, Currency.EUR));
        expect(second).toEqual(new Money(5, Currency.EUR));
    });

    test("should subtract amounts in the same currency", () => {
        const result = new Money(8, Currency.EUR).subtract(
            new Money(5, Currency.EUR),
        );

        expect(result).toEqual(new Money(3, Currency.EUR));
    });

    test("should reject a subtraction resulting in a negative amount", () => {
        expect(() =>
            new Money(5, Currency.EUR).subtract(new Money(8, Currency.EUR)),
        ).toThrow("ERR_NEGATIVE_AMOUNT_MONEY_OPERATION");
    });

    test.each([
        ["add", (money: Money) => money.add(new Money(1, Currency.USD))],
        [
            "subtract",
            (money: Money) => money.subtract(new Money(1, Currency.USD)),
        ],
        [
            "isGreaterThan",
            (money: Money) => money.isGreaterThan(new Money(1, Currency.USD)),
        ],
        [
            "isGreaterThanOrEqual",
            (money: Money) =>
                money.isGreaterThanOrEqual(new Money(1, Currency.USD)),
        ],
        ["equals", (money: Money) => money.equals(new Money(1, Currency.USD))],
    ])("should reject different currencies for %s", (_, operation) => {
        expect(() => operation(new Money(2, Currency.EUR))).toThrow(
            "ERR_INVALID_MONEY_OPERATION",
        );
    });

    test("should compare amounts with strict and inclusive boundaries", () => {
        const amount = new Money(10, Currency.EUR);

        expect(amount.isGreaterThan(new Money(9, Currency.EUR))).toBe(true);
        expect(amount.isGreaterThan(new Money(10, Currency.EUR))).toBe(false);
        expect(amount.isGreaterThanOrEqual(new Money(10, Currency.EUR))).toBe(
            true,
        );
        expect(amount.isGreaterThanOrEqual(new Money(11, Currency.EUR))).toBe(
            false,
        );
        expect(amount.equals(new Money(10, Currency.EUR))).toBe(true);
        expect(amount.equals(new Money(9, Currency.EUR))).toBe(false);
    });
});
