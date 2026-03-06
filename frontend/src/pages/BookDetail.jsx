import { useEffect, useState } from "react";
import { bookApi } from "../api/bookApi";
import { ArrowLeft, Edit2, Trash2, Save, X, Package, Hash, Tag, DollarSign } from "lucide-react";
import Toast from "../components/Toast";
import "./BookDetail.css";

export default function BookDetail({ bookId, navigate }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!bookId) { setError("No book ID provided"); setLoading(false); return; }
    bookApi.getBookById(bookId)
      .then(r => { setBook(r.data); setForm(r.data); })
      .catch(() => setError("Book not found (404)"))
      .finally(() => setLoading(false));
  }, [bookId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await bookApi.updateBook(bookId, form);
      setBook(res.data);
      setEditing(false);
      showToast("Book updated successfully!");
    } catch {
      showToast("Failed to update book", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await bookApi.deleteBook(bookId);
      showToast("Book deleted!");
      setTimeout(() => navigate("all-books"), 1200);
    } catch {
      showToast("Delete failed", "error");
    }
  };

  if (loading) return <div className="loading-wrap"><div className="spinner" /><span>Loading book...</span></div>;
  if (error) return (
    <div>
      <button className="btn btn-ghost" onClick={() => navigate("all-books")} style={{ marginBottom: 20 }}>
        <ArrowLeft size={15} /> Back
      </button>
      <div className="error-banner">{error}</div>
    </div>
  );

  const stockColor = book.stockQuantity > 10 ? "badge-green" : book.stockQuantity > 0 ? "badge-amber" : "badge-red";

  return (
    <div className="book-detail">
      <div className="detail-nav">
        <button className="btn btn-ghost" onClick={() => navigate("all-books")}>
          <ArrowLeft size={15} /> All Books
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          {!editing ? (
            <>
              <button className="btn btn-ghost" onClick={() => { setEditing(true); setForm(book); }}>
                <Edit2 size={14} /> Edit
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                <Trash2 size={14} /> Delete
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>
                <X size={14} /> Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detail-layout">
        {/* Cover Panel */}
        <div className="detail-cover-panel card">
          <div className="big-cover">{book.title?.charAt(0)}</div>
          <h2 className="detail-book-title">{book.title}</h2>
          <p className="detail-book-author">by {book.author}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <span className="badge badge-blue">{book.category}</span>
            <span className={`badge ${stockColor}`}>{book.stockQuantity > 0 ? `${book.stockQuantity} in stock` : "Out of stock"}</span>
          </div>
          <div className="detail-price">${book.price?.toFixed(2)}</div>
        </div>

        {/* Info / Edit Panel */}
        <div className="detail-info-panel">
          {!editing ? (
            <div className="card">
              <h3 style={{ fontFamily: "Playfair Display, serif", marginBottom: 20 }}>Book Details</h3>
              <div className="detail-grid">
                {[
                  { label: "ID", value: `#${book.id}`, icon: Hash },
                  { label: "Title", value: book.title, icon: Tag },
                  { label: "Author", value: book.author, icon: Tag },
                  { label: "Category", value: book.category, icon: Tag },
                  { label: "Price", value: `$${book.price?.toFixed(2)}`, icon: DollarSign },
                  { label: "Stock Qty", value: book.stockQuantity, icon: Package },
                  { label: "ISBN", value: book.isbn || "N/A", icon: Hash },
                  { label: "Year", value: book.publishedYear || "N/A", icon: Tag },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="detail-row">
                    <div className="detail-label">
                      <Icon size={13} style={{ marginRight: 5 }} />
                      {label}
                    </div>
                    <div className="detail-val">{value}</div>
                  </div>
                ))}
              </div>
              {book.description && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                  <div className="detail-label" style={{ marginBottom: 8 }}>Description</div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>{book.description}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="card">
              <h3 style={{ fontFamily: "Playfair Display, serif", marginBottom: 20 }}>Edit Book</h3>
              <div className="grid-2">
                {[
                  { key: "title", label: "Title", type: "text" },
                  { key: "author", label: "Author", type: "text" },
                  { key: "category", label: "Category", type: "text" },
                  { key: "price", label: "Price ($)", type: "number" },
                  { key: "stockQuantity", label: "Stock Quantity", type: "number" },
                  { key: "isbn", label: "ISBN", type: "text" },
                  { key: "publishedYear", label: "Published Year", type: "number" },
                ].map(({ key, label, type }) => (
                  <div key={key} className="input-group">
                    <label className="input-label">{label}</label>
                    <input
                      type={type}
                      value={form[key] ?? ""}
                      onChange={e => setForm({ ...form, [key]: type === "number" ? +e.target.value : e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea rows={3} value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
