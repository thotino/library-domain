export default class MemberId {
    readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    public static fromString(rawId: string) {
        return new MemberId(rawId);
    }

    public equals(other: MemberId) {
        return this.value === other.value;
    }
}
