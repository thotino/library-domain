import Book from "../Book";
import BookId from "../BookId";

export interface BookRepositoryInterface {
    create: (book: Book) => void;
    findOne: (id: BookId) => Promise<Book | undefined>;
    save: (book: Book) => void;
}
