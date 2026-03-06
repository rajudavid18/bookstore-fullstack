# 📚 BookStore Full Stack Application

A full-stack bookstore management system built with **Spring Boot** (backend) and **React** (frontend).

## Tech Stack
- **Backend:** Java 24, Spring Boot 3.2, Spring Data JPA, H2 Database
- **Frontend:** React, Vite, Axios

## How to Run

### Backend
Open `backend/` in IntelliJ IDEA and run `BookstoreApplication.java`  
API runs on: `http://localhost:8081`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens on: `http://localhost:3000`

## API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/{id}` | Get book by ID |
| POST | `/api/books` | Add new book |
| PUT | `/api/books/{id}` | Update book |
| DELETE | `/api/books/{id}` | Delete book |
| GET | `/api/books/stats` | Statistics |
| GET | `/api/books/search?q=` | Search books |
| GET | `/api/books/in-stock` | In-stock books |
| GET | `/api/books/category/{cat}` | By category |
| GET | `/api/books/under-price/{price}` | Under price |
