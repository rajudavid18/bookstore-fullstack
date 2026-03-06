package com.demo.bookstore.controller;

import com.demo.bookstore.model.Book;
import com.demo.bookstore.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * BookController — REST API Layer
 * Base URL: /api/books
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  METHOD  │  URL                          │  ACTION          │
 * ├─────────────────────────────────────────────────────────────┤
 * │  GET     │  /api/books                   │  Get all books   │
 * │  GET     │  /api/books/{id}              │  Get one book    │
 * │  GET     │  /api/books/search?q=java     │  Search books    │
 * │  GET     │  /api/books/category/{cat}    │  By category     │
 * │  GET     │  /api/books/under-price/{p}   │  Cheap books     │
 * │  GET     │  /api/books/in-stock          │  In-stock only   │
 * │  GET     │  /api/books/stats             │  Statistics      │
 * │  POST    │  /api/books                   │  Create book     │
 * │  PUT     │  /api/books/{id}              │  Update book     │
 * │  PATCH   │  /api/books/{id}/stock/{qty}  │  Update stock    │
 * │  DELETE  │  /api/books/{id}              │  Delete book     │
 * └─────────────────────────────────────────────────────────────┘
 */
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*") // Allows frontend apps to call this API
public class BookController {

    @Autowired
    private BookService bookService;

    // ─────────────────────────────────────────────────────────────
    // GET — Read Operations
    // ─────────────────────────────────────────────────────────────

    /**
     * GET /api/books
     * Returns all books in the database.
     * Test: http://localhost:8080/api/books
     */
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    /**
     * GET /api/books/5
     * Returns one book by its ID. Returns 404 if not found.
     * Test: http://localhost:8080/api/books/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    /**
     * GET /api/books/search?q=java
     * Searches by keyword in title and author fields.
     * Test: http://localhost:8080/api/books/search?q=clean
     */
    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam("q") String keyword) {
        return ResponseEntity.ok(bookService.searchBooks(keyword));
    }

    /**
     * GET /api/books/category/Java
     * Returns books filtered by category.
     * Test: http://localhost:8080/api/books/category/Programming
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Book>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(bookService.getBooksByCategory(category));
    }

    /**
     * GET /api/books/under-price/40
     * Returns books priced at or below the given value.
     * Test: http://localhost:8080/api/books/under-price/40
     */
    @GetMapping("/under-price/{maxPrice}")
    public ResponseEntity<List<Book>> getBooksUnderPrice(@PathVariable Double maxPrice) {
        return ResponseEntity.ok(bookService.getBooksUnderPrice(maxPrice));
    }

    /**
     * GET /api/books/in-stock
     * Returns only books with stock > 0.
     * Test: http://localhost:8080/api/books/in-stock
     */
    @GetMapping("/in-stock")
    public ResponseEntity<List<Book>> getInStockBooks() {
        return ResponseEntity.ok(bookService.getInStockBooks());
    }

    /**
     * GET /api/books/stats
     * Returns inventory statistics — great for manager demos!
     * Test: http://localhost:8080/api/books/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(bookService.getStats());
    }

    // ─────────────────────────────────────────────────────────────
    // POST — Create
    // ─────────────────────────────────────────────────────────────

    /**
     * POST /api/books
     * Creates a new book. @Valid triggers validation annotations on Book.
     * Returns 201 Created on success.
     *
     * Postman Body (raw → JSON):
     * {
     *   "title": "Spring Security",
     *   "author": "Craig Walls",
     *   "price": 44.99,
     *   "category": "Java",
     *   "stock": 5,
     *   "isbn": "ISBN-009"
     * }
     */
    @PostMapping
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        Book savedBook = bookService.createBook(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);
    }

    // ─────────────────────────────────────────────────────────────
    // PUT — Full Update
    // ─────────────────────────────────────────────────────────────

    /**
     * PUT /api/books/1
     * Replaces all fields of book with ID 1.
     * Returns 404 if ID not found.
     *
     * Postman Body (raw → JSON):
     * {
     *   "title": "Clean Code (Updated)",
     *   "author": "Robert C. Martin",
     *   "price": 49.99,
     *   "category": "Programming",
     *   "stock": 20
     * }
     */
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id,
                                           @Valid @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    // ─────────────────────────────────────────────────────────────
    // PATCH — Partial Update (just stock)
    // ─────────────────────────────────────────────────────────────

    /**
     * PATCH /api/books/1/stock/50
     * Updates only the stock of book ID 1 to 50.
     * Test: PATCH http://localhost:8080/api/books/1/stock/50
     */
    @PatchMapping("/{id}/stock/{quantity}")
    public ResponseEntity<Book> updateStock(@PathVariable Long id,
                                            @PathVariable Integer quantity) {
        return ResponseEntity.ok(bookService.updateStock(id, quantity));
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────────────────────

    /**
     * DELETE /api/books/1
     * Deletes book with ID 1.
     * Returns 204 No Content on success, 404 if not found.
     * Test: DELETE http://localhost:8080/api/books/8
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(Map.of(
            "message", "Book deleted successfully",
            "id", id.toString()
        ));
    }
}
