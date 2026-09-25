import Book from "../domain/Book";
import BookId from "../domain/BookId";
import { BookRepositoryInterface } from "../domain/repositories/BookRepository";

export class BookRepository implements BookRepositoryInterface {
    #books: Book[];
    constructor() {
        this.#books = new Array<Book>();
    }
    save(book: Book) {}
    async create(book: Book) {
        return this.#books.push(book);
    }
    async findOne(id: BookId) {
        return this.#books.find(book => book.id.equals(id));
    }
}
