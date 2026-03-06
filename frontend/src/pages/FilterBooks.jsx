import { useState } from "react";
import { bookApi } from "../api/bookApi";
import { Package, Tag, DollarSign } from "lucide-react";
import BookCard from "../components/BookCard";
import "../components/BookCard.css";
import "./FilterBooks.css";

const FILTERS = [
  { id: "in-stock", label: "In Stock", icon: Package, desc: "Books with stockQuantity > 0", color: "var(--green)" },
  { id: "category", label: "By Category", icon: Tag, desc: "Filter by book category", color: "var(--blue)" },
  { id: "under-price", label: "Under Price", icon: DollarSign, desc: "Books cheaper than X", color: "var(--accent)" },
];

const CATEGORIES = ["Java", "Python", "JavaScript", "Design", "Architecture", "Soft Skills", "DevOps"];

export default function FilterBooks({ navigate }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [category, setCategory] = useState("Java");
  const [price, setPrice] = useState(40);
  const [error, setError] = useState("");

  const applyFilter = async (filterId) => {
    setActiveFilter(filterId);
    setLoading(true);
    setFetched(false);
    setError("");
    try {
      let res;
      if (filterId === "in-stock") res = await bookApi.getInStock();
      else if (filterId === "category") res = await bookApi.getByCategory(category);
      else if (filterId === "under-price") res = await bookApi.getUnderPrice(price);
      setBooks(res.data);
      setFetched(true);
    } catch {
      setError("Request failed. Make sure Spring Boot is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Filter & Browse</h1>
      <p className="page-subtitle">Use API endpoints to filter books by stock, category, or price</p>

      {/* Filter Cards */}
      <div className="filter-options">
        {FILTERS.map(({ id, label, icon: Icon, desc, color }) => (
          <div
            key={id}
            className={`filter-card card ${activeFilter === id ? "filter-active" : ""}`}
            style={activeFilter === id ? { borderColor: color } : {}}
          >
            <div className="filter-header">
              <div className="filter-icon" style={{ background: `${color}18`, color }}>
                <Icon size={18} />
              </div>
              <div>
                <div className="filter-label">{label}</div>
                <div className="filter-desc">{desc}</div>
              </div>
            </div>

            {id === "category" && (
              <div className="input-group" style={{ margin: "14px 0 0" }}>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            )}

            {id === "under-price" && (
              <div className="price-slider-wrap">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Max price</span>
                  <span style={{ fontSize: "0.9rem", color: "var(--accent)", fontWeight: 600 }}>${price}</span>
                </div>
                <input
                  type="range"
                  min="10" max="100" step="5"
                  value={price}
                  onChange={e => setPrice(+e.target.value)}
                  className="price-range"
                />
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ marginTop: 14, background: color, width: "100%" }}
              onClick={() => applyFilter(id)}
            >
              Apply Filter
            </button>
          </div>
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading && <div className="loading-wrap"><div className="spinner" /><span>Filtering...</span></div>}

      {!loading && fetched && (
        <div style={{ marginTop: 28 }}>
          <p className="page-subtitle" style={{ marginBottom: 16 }}>
            {books.length} book{books.length !== 1 ? "s" : ""} found
          </p>
          {books.length === 0 ? (
            <div className="empty-state"><h3>No books match</h3><p>Try adjusting the filter</p></div>
          ) : (
            <div className="grid-3">
              {books.map(book => (
                <BookCard key={book.id} book={book} onView={(id) => navigate("book-detail", id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
