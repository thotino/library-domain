import { addDays, isBefore, isAfter } from "date-fns";

export default class DueDate {
    readonly value: Date;
    constructor(rawDate: Date) {
        this.value = new Date(rawDate);
    }
    isBefore(other: DueDate) {
        return isBefore(this.value, other.value);
    }
    isAfter(other: DueDate) {
        return isAfter(this.value, other.value);
    }
    addDays(numberOfDays: number) {
        return new DueDate(addDays(this.value, numberOfDays));
    }
}
