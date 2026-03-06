package com.demo.bookstore.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler — Catches ALL exceptions across every controller.
 *
 * Without this: Spring returns ugly HTML error pages.
 * With this:    Spring returns clean, professional JSON error responses.
 *
 * @RestControllerAdvice = applies to all @RestController classes
 * @ExceptionHandler     = handles a specific exception type
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles: Book not found (404)
     * Triggered by: throw new BookNotFoundException(id)
     */
    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleBookNotFound(BookNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    /**
     * Handles: Validation errors (400)
     * Triggered by: @Valid failing on request body
     * Example: sending blank title, negative price, etc.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        // Collect all field-level validation errors
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status",    400);
        body.put("error",     "Validation Failed");
        body.put("details",   fieldErrors);

        return ResponseEntity.badRequest().body(body);
    }

    /**
     * Handles: Any other unexpected exception (500)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR,
                          "An unexpected error occurred: " + ex.getMessage());
    }

    // Helper method to build a consistent error response body
    private ResponseEntity<Map<String, Object>> buildError(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status",    status.value());
        body.put("error",     status.getReasonPhrase());
        body.put("message",   message);
        return ResponseEntity.status(status).body(body);
    }
}
