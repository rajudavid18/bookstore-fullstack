package com.demo.bookstore.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * BookNotFoundException — thrown when a book ID does not exist in the database.
 *
 * @ResponseStatus(HttpStatus.NOT_FOUND) automatically returns HTTP 404
 * when this exception is thrown from a controller.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class BookNotFoundException extends RuntimeException {

    public BookNotFoundException(Long id) {
        super("Book not found with ID: " + id);
    }

    public BookNotFoundException(String message) {
        super(message);
    }
}
