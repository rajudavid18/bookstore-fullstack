import { useState } from "react";
import { bookApi } from "../api/bookApi";
import { Search, BookOpen } from "lucide-react";
import BookCard from "../components/BookCard";
import "../components/BookCard.css";

export default function SearchBooks({ navigate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await bookApi.searchBooks(query);
      setResults(res.data);
      setSearched(true);
    } catch {
      setError("Search failed. Make sure your Spring Boot server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Search Books</h1>
      <p className="page-subtitle">Search by title, author, or keyword — hits /api/books/search?q=</p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            placeholder='Try "Clean", "Java", "Robert"...'
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading || !query.trim()}>
            <Search size={15} /> {loading ? "Searching..." : "Search"}
          </button>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Clean", "Java", "Robert", "Design", "Python"].map(q => (
            <button
              key={q}
              className="btn btn-ghost btn-sm"
              onClick={() => { setQuery(q); }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading && <div className="loading-wrap"><div className="spinner" /><span>Searching...</span></div>}

      {!loading && searched && (
        <>
          <p className="page-subtitle" style={{ marginBottom: 16 }}>
            {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
          </p>
          {results.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <h3>No books found</h3>
              <p>Try a different search term</p>
            </div>
          ) : (
            <div className="grid-3">
              {results.map(book => (
                <BookCard key={book.id} book={book} onView={(id) => navigate("book-detail", id)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
