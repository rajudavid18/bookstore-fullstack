import { useEffect, useState } from "react";
import { bookApi } from "../api/bookApi";
import { Eye, Trash2, LayoutGrid, LayoutList, RefreshCw } from "lucide-react";
import BookCard from "../components/BookCard";
import Toast from "../components/Toast";
import "../components/BookCard.css";
import "./AllBooks.css";

export default function AllBooks({ navigate }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    setLoading(true);
    bookApi.getAllBooks()
      .then(r => setBooks(r.data))
      .catch(() => showToast("Failed to load books", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this book?")) return;
    setDeleting(id);
    try {
      await bookApi.deleteBook(id);
      showToast("Book deleted successfully");
      load();
    } catch {
      showToast("Failed to delete book", "error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Books</h1>
          <p className="page-subtitle">{books.length} books in catalog</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /> Refresh</button>
          <button className={`btn btn-ghost btn-sm ${view === "grid" ? "active-view" : ""}`} onClick={() => setView("grid")}><LayoutGrid size={14} /></button>
          <button className={`btn btn-ghost btn-sm ${view === "list" ? "active-view" : ""}`} onClick={() => setView("list")}><LayoutList size={14} /></button>
          <button className="btn btn-primary" onClick={() => navigate("add-book")}>+ Add Book</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /><span>Loading books...</span></div>
      ) : books.length === 0 ? (
        <div className="empty-state"><h3>No books found</h3><p>Add some books to get started</p></div>
      ) : view === "grid" ? (
        <div className="grid-3">
          {books.map(book => (
            <BookCard key={book.id} book={book} onView={(id) => navigate("book-detail", id)} />
          ))}
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Title</th><th>Author</th><th>Category</th>
                <th>Price</th><th>Stock</th><th>ISBN</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td style={{ color: "var(--text-dim)" }}>#{book.id}</td>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{book.title}</td>
                  <td>{book.author}</td>
                  <td><span className="badge badge-blue">{book.category}</span></td>
                  <td style={{ color: "var(--accent)", fontWeight: 600 }}>${book.price?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${book.stockQuantity > 10 ? "badge-green" : book.stockQuantity > 0 ? "badge-amber" : "badge-red"}`}>
                      {book.stockQuantity}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{book.isbn}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate("book-detail", book.id)}>
                        <Eye size={13} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => handleDelete(book.id, e)}
                        disabled={deleting === book.id}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
