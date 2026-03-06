package com.demo.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ================================================================
 *  BOOKSTORE API — Spring Boot Demo Application
 *  For Manager / Internship Presentation
 * ================================================================
 *
 *  Features demonstrated:
 *    - REST API (GET, POST, PUT, DELETE)
 *    - JPA + H2 In-Memory Database
 *    - Input Validation
 *    - Global Exception Handling
 *    - Search & Filter
 *    - Health Check (Actuator)
 *    - H2 Console (visual DB browser)
 *
 *  Run this class, then test at:
 *    http://localhost:8081/api/books
 *    http://localhost:8081/actuator/health
 *    http://localhost:8081/h2-console
 */
@SpringBootApplication
public class BookstoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookstoreApplication.class, args);

        System.out.println("\n");
        System.out.println("==============================================");
        System.out.println("   BOOKSTORE API IS RUNNING!");
        System.out.println("==============================================");
        System.out.println("  API Base   : http://localhost:8081/api/books");
        System.out.println("  Health     : http://localhost:8081/actuator/health");
        System.out.println("  H2 Console : http://localhost:8081/h2-console");
        System.out.println("  (H2 JDBC URL: jdbc:h2:mem:bookstoredb)");
        System.out.println("==============================================\n");
    }
}
