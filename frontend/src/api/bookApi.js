import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8081/api/books" });

export const bookApi = {
  getAllBooks: () => api.get(""),
  getBookById: (id) => api.get(`/${id}`),
  getStats: () => api.get("/stats"),
  getInStock: () => api.get("/in-stock"),
  getByCategory: (category) => api.get(`/category/${category}`),
  searchBooks: (q) => api.get(`/search?q=${encodeURIComponent(q)}`),
  getUnderPrice: (price) => api.get(`/under-price/${price}`),
  createBook: (book) => api.post("", book),
  updateBook: (id, book) => api.put(`/${id}`, book),
  deleteBook: (id) => api.delete(`/${id}`),
};
