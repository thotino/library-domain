export default class BookId {
    readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    public static fromString(rawId: string) {
        return new BookId(rawId);
    }

    public equals(other: BookId) {
        return this.value === other.value;
    }
}
