import { useState } from "react";
import { bookApi } from "../api/bookApi";
import { PlusCircle, ArrowLeft } from "lucide-react";
import Toast from "../components/Toast";

const CATEGORIES = ["Java", "Python", "JavaScript", "Design", "Architecture", "Soft Skills", "DevOps", "Other"];

const defaultForm = {
  title: "", author: "", category: "Java", price: "", stockQuantity: "",
  isbn: "", publishedYear: new Date().getFullYear(), description: ""
};

export default function AddBook({ navigate }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (!form.price || form.price <= 0) e.price = "Valid price required";
    if (!form.stockQuantity && form.stockQuantity !== 0) e.stockQuantity = "Stock qty required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity),
        publishedYear: parseInt(form.publishedYear),
      };
      await bookApi.createBook(payload);
      showToast("Book added successfully!");
      setForm(defaultForm);
      setErrors({});
      setTimeout(() => navigate("all-books"), 1500);
    } catch {
      showToast("Failed to add book. Check if Spring Boot is running.", "error");
    } finally {
      setSaving(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: e => {
      setForm({ ...form, [key]: e.target.value });
      setErrors({ ...errors, [key]: null });
    }
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button className="btn btn-ghost" onClick={() => navigate("all-books")}>
          <ArrowLeft size={15} /> Back
        </button>
        <div>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Add New Book</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>POST /api/books</p>
        </div>
      </div>

      <div style={{ maxWidth: 720 }}>
        <div className="card">
          <div className="grid-2">
            {[
              { key: "title", label: "Book Title", type: "text", placeholder: "e.g. Clean Code" },
              { key: "author", label: "Author", type: "text", placeholder: "e.g. Robert C. Martin" },
              { key: "price", label: "Price ($)", type: "number", placeholder: "e.g. 39.99" },
              { key: "stockQuantity", label: "Stock Quantity", type: "number", placeholder: "e.g. 50" },
              { key: "isbn", label: "ISBN (optional)", type: "text", placeholder: "e.g. 978-0-13-235088-4" },
              { key: "publishedYear", label: "Published Year", type: "number", placeholder: "e.g. 2023" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className="input-group">
                <label className="input-label">{label}</label>
                <input type={type} placeholder={placeholder} {...field(key)} />
                {errors[key] && <span style={{ color: "var(--red)", fontSize: "0.75rem" }}>{errors[key]}</span>}
              </div>
            ))}
          </div>

          <div className="input-group">
            <label className="input-label">Category</label>
            <select {...field("category")}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Description (optional)</label>
            <textarea rows={3} placeholder="Brief description of the book..." {...field("description")} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              <PlusCircle size={15} /> {saving ? "Adding..." : "Add Book"}
            </button>
            <button className="btn btn-ghost" onClick={() => setForm(defaultForm)}>
              Reset Form
            </button>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
