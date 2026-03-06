package com.demo.bookstore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Book Entity — maps to the BOOK table in the database.
 *
 * @Entity  tells JPA: create a DB table for this class
 * @Table   sets the table name
 * @Id      marks the primary key field
 */
@Entity
@Table(name = "book")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment ID
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 200, message = "Title must be 2-200 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Author is required")
    @Column(nullable = false)
    private String author;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    @Column(nullable = false)
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;

    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock = 0;

    private String isbn;

    // ── Constructors ────────────────────────────────────────────

    public Book() {}

    public Book(String title, String author, Double price, String category, Integer stock, String isbn) {
        this.title    = title;
        this.author   = author;
        this.price    = price;
        this.category = category;
        this.stock    = stock;
        this.isbn     = isbn;
    }

    // ── Getters & Setters ────────────────────────────────────────

    public Long getId()                    { return id; }
    public void setId(Long id)             { this.id = id; }

    public String getTitle()               { return title; }
    public void setTitle(String title)     { this.title = title; }

    public String getAuthor()              { return author; }
    public void setAuthor(String author)   { this.author = author; }

    public Double getPrice()               { return price; }
    public void setPrice(Double price)     { this.price = price; }

    public String getCategory()            { return category; }
    public void setCategory(String cat)    { this.category = cat; }

    public Integer getStock()              { return stock; }
    public void setStock(Integer stock)    { this.stock = stock; }

    public String getIsbn()                { return isbn; }
    public void setIsbn(String isbn)       { this.isbn = isbn; }

    @Override
    public String toString() {
        return "Book{id=" + id + ", title='" + title + "', author='" + author +
               "', price=" + price + ", category='" + category + "'}";
    }
}
