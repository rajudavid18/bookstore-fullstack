import { useEffect, useState } from "react";
import { bookApi } from "../api/bookApi";
import { BarChart2, TrendingUp, Package, BookOpen, DollarSign, Activity } from "lucide-react";
import "./Statistics.css";

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([bookApi.getStats(), bookApi.getAllBooks()])
      .then(([s, b]) => { setStats(s.data); setBooks(b.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner" /><span>Loading statistics...</span></div>;

  const p = (val) => parseFloat(val || 0);

  const categoryCounts = books.reduce((acc, b) => {
    acc[b.category] = (acc[b.category] || 0) + 1;
    return acc;
  }, {});
  const maxCat = Math.max(...Object.values(categoryCounts), 1);

  const priceBuckets = { "<$30": 0, "$30-50": 0, "$50-70": 0, ">$70": 0 };
  books.forEach(b => {
    const price = p(b.price);
    if (price < 30) priceBuckets["<$30"]++;
    else if (price < 50) priceBuckets["$30-50"]++;
    else if (price < 70) priceBuckets["$50-70"]++;
    else priceBuckets[">$70"]++;
  });
  const maxPrice = Math.max(...Object.values(priceBuckets), 1);

  const topBooks = [...books].sort((a, b) => p(b.price) - p(a.price)).slice(0, 5);

  const COLORS = ["var(--accent)", "var(--blue)", "var(--green)", "var(--purple)", "var(--red)"];

  return (
    <div>
      <h1 className="page-title">Statistics</h1>
      <p className="page-subtitle">Data from /api/books/stats — visual overview of your catalog</p>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: "Total Books", value: stats?.totalBooks, icon: BookOpen, color: "var(--accent)" },
          { label: "Books In Stock", value: stats?.booksInStock, icon: Package, color: "var(--green)" },
          { label: "Out of Stock", value: (stats?.totalBooks || 0) - (stats?.booksInStock || 0), icon: Activity, color: "var(--red)" },
          { label: "Avg Price", value: `$${p(stats?.averagePrice).toFixed(2)}`, icon: DollarSign, color: "var(--blue)" },
          { label: "Most Expensive", value: `$${p(stats?.mostExpensivePrice).toFixed(2)}`, icon: TrendingUp, color: "var(--purple)" },
          { label: "Total Inv. Value", value: `$${p(stats?.totalInventoryValue).toFixed(0)}`, icon: BarChart2, color: "var(--accent)" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-chip card">
            <div className="chip-icon" style={{ color, background: `${color}18` }}><Icon size={18} /></div>
            <div>
              <div className="chip-value">{value}</div>
              <div className="chip-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 className="chart-title">Books by Category</h3>
          <div className="bar-chart">
            {Object.entries(categoryCounts).map(([cat, count], i) => (
              <div key={cat} className="bar-row">
                <div className="bar-label">{cat}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(count / maxCat) * 100}%`, background: COLORS[i % COLORS.length] }} />
                </div>
                <div className="bar-val">{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="chart-title">Price Distribution</h3>
          <div className="bar-chart">
            {Object.entries(priceBuckets).map(([range, count], i) => (
              <div key={range} className="bar-row">
                <div className="bar-label">{range}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(count / maxPrice) * 100}%`, background: COLORS[i] }} />
                </div>
                <div className="bar-val">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="chart-title" style={{ marginBottom: 16 }}>Top 5 Most Expensive Books</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Rank</th><th>Title</th><th>Author</th><th>Category</th><th>Price</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {topBooks.map((book, i) => (
                <tr key={book.id}>
                  <td>
                    <span className="rank-badge" style={{ background: i === 0 ? "var(--accent-dim)" : "var(--surface2)", color: i === 0 ? "var(--accent)" : "var(--text-dim)" }}>
                      #{i + 1}
                    </span>
                  </td>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{book.title}</td>
                  <td>{book.author}</td>
                  <td><span className="badge badge-blue">{book.category}</span></td>
                  <td style={{ color: "var(--accent)", fontWeight: 700 }}>${p(book.price).toFixed(2)}</td>
                  <td><span className={`badge ${book.stockQuantity > 0 ? "badge-green" : "badge-red"}`}>{book.stockQuantity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
