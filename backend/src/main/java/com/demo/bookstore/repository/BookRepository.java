package com.demo.bookstore.repository;

import com.demo.bookstore.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * BookRepository — Database Access Layer
 *
 * By extending JpaRepository<Book, Long>, Spring automatically provides:
 *   findAll()           → SELECT * FROM book
 *   findById(id)        → SELECT * FROM book WHERE id = ?
 *   save(book)          → INSERT or UPDATE
 *   deleteById(id)      → DELETE FROM book WHERE id = ?
 *   count()             → SELECT COUNT(*) FROM book
 *   existsById(id)      → SELECT 1 FROM book WHERE id = ?
 *
 * You write ZERO SQL for these!
 *
 * Below are CUSTOM queries you define yourself.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Spring auto-generates SQL from method name!
    // findBy + Category = WHERE category = ?
    List<Book> findByCategory(String category);

    // findBy + Author + Containing = WHERE author LIKE '%name%'
    List<Book> findByAuthorContainingIgnoreCase(String author);

    // findBy + Title + Containing = WHERE title LIKE '%title%'
    List<Book> findByTitleContainingIgnoreCase(String title);

    // findBy + Price + LessThanEqual = WHERE price <= ?
    List<Book> findByPriceLessThanEqual(Double maxPrice);

    // findBy + Stock + GreaterThan = WHERE stock > ?
    List<Book> findByStockGreaterThan(Integer minStock);

    // Custom JPQL query — search across title AND author at once
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> searchByKeyword(@Param("keyword") String keyword);

    // Count books in a specific category
    long countByCategory(String category);
}
