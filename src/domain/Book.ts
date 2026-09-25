import BookId from "./BookId";

export default class Book {
    #id: BookId;
    #isAvailable: boolean = true;
    constructor(id: string) {
        this.#id = BookId.fromString(id);
    }
    get id() {
        return this.#id;
    }
    isAvailable() {
        return this.#isAvailable;
    }
    markAsAvailable() {
        if (this.#isAvailable === false) {
            this.#isAvailable = true;
        }
    }
    markAsUnavailable() {
        if (this.#isAvailable === true) {
            this.#isAvailable = false;
        }
    }
}
