package com.demo.bookstore.service;

import com.demo.bookstore.exception.BookNotFoundException;
import com.demo.bookstore.model.Book;
import com.demo.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * BookService — Business Logic Layer
 *
 * Rule: Controllers should NEVER talk to the repository directly.
 *       All business logic lives here.
 *
 * This class is responsible for:
 *   - CRUD operations (Create, Read, Update, Delete)
 *   - Search and filter
 *   - Statistics / reporting
 *   - Business rules (e.g., can't set price to negative)
 */
@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // ── READ Operations ──────────────────────────────────────────

    /** Get every book in the database */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /** Get one book by ID — throws 404 if not found */
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    /** Get all books in a specific category */
    public List<Book> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category);
    }

    /** Search books by title or author keyword */
    public List<Book> searchBooks(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return bookRepository.findAll();
        }
        return bookRepository.searchByKeyword(keyword.trim());
    }

    /** Get books cheaper than a given price */
    public List<Book> getBooksUnderPrice(Double maxPrice) {
        return bookRepository.findByPriceLessThanEqual(maxPrice);
    }

    /** Get books that are in stock */
    public List<Book> getInStockBooks() {
        return bookRepository.findByStockGreaterThan(0);
    }

    // ── CREATE Operation ─────────────────────────────────────────

    /** Add a new book to the database */
    public Book createBook(Book book) {
        // Business rule: trim whitespace from text fields
        book.setTitle(book.getTitle().trim());
        book.setAuthor(book.getAuthor().trim());
        book.setCategory(book.getCategory().trim());
        return bookRepository.save(book);
    }

    // ── UPDATE Operation ─────────────────────────────────────────

    /** Update an existing book — throws 404 if ID not found */
    public Book updateBook(Long id, Book updatedBook) {
        // First verify the book exists (throws 404 if not)
        Book existingBook = getBookById(id);

        // Update only the fields that were provided
        existingBook.setTitle(updatedBook.getTitle().trim());
        existingBook.setAuthor(updatedBook.getAuthor().trim());
        existingBook.setPrice(updatedBook.getPrice());
        existingBook.setCategory(updatedBook.getCategory().trim());
        existingBook.setStock(updatedBook.getStock());

        if (updatedBook.getIsbn() != null) {
            existingBook.setIsbn(updatedBook.getIsbn());
        }

        return bookRepository.save(existingBook);
    }

    /** Update only the stock quantity of a book */
    public Book updateStock(Long id, Integer newStock) {
        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
        Book book = getBookById(id);
        book.setStock(newStock);
        return bookRepository.save(book);
    }

    // ── DELETE Operation ─────────────────────────────────────────

    /** Delete a book by ID — throws 404 if not found */
    public void deleteBook(Long id) {
        // Verify exists before deleting
        getBookById(id);
        bookRepository.deleteById(id);
    }

    // ── STATISTICS ───────────────────────────────────────────────

    /** Returns summary statistics for the manager dashboard */
    public Map<String, Object> getStats() {
        List<Book> allBooks = bookRepository.findAll();

        double totalValue  = allBooks.stream().mapToDouble(b -> b.getPrice() * b.getStock()).sum();
        double avgPrice    = allBooks.stream().mapToDouble(Book::getPrice).average().orElse(0);
        long   inStock     = allBooks.stream().filter(b -> b.getStock() > 0).count();
        long   outOfStock  = allBooks.stream().filter(b -> b.getStock() == 0).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBooks",        allBooks.size());
        stats.put("inStockBooks",      inStock);
        stats.put("outOfStockBooks",   outOfStock);
        stats.put("averagePrice",      String.format("%.2f", avgPrice));
        stats.put("totalInventoryValue", String.format("%.2f", totalValue));
        stats.put("programmingBooks",  bookRepository.countByCategory("Programming"));
        stats.put("javaBooks",         bookRepository.countByCategory("Java"));
        return stats;
    }
}
