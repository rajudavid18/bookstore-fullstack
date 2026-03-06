import { useEffect, useState } from "react";
import { bookApi } from "../api/bookApi";
import { BookOpen, TrendingUp, Package, DollarSign, ArrowRight, Activity } from "lucide-react";
import "./Dashboard.css";

export default function Dashboard({ navigate }) {
  const [stats, setStats] = useState(null);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([bookApi.getStats(), bookApi.getAllBooks()])
      .then(([statsRes, booksRes]) => {
        setStats(statsRes.data);
        setRecentBooks(booksRes.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-wrap">
      <div className="spinner" />
      <span>Loading dashboard...</span>
    </div>
  );

  const p = (val) => parseFloat(val || 0);

  const statCards = [
    { label: "Total Books", value: stats?.totalBooks ?? "—", icon: BookOpen, color: "var(--accent)" },
    { label: "In Stock Books", value: stats?.booksInStock ?? "—", icon: Package, color: "var(--green)" },
    { label: "Avg Price", value: stats?.averagePrice ? `$${p(stats.averagePrice).toFixed(2)}` : "—", icon: DollarSign, color: "var(--blue)" },
    { label: "Total Revenue", value: stats?.totalInventoryValue ? `$${p(stats.totalInventoryValue).toFixed(0)}` : "—", icon: TrendingUp, color: "var(--purple)" },
  ];

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome to your BookStore Manager — Spring Boot + React</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("add-book")}>
          + Add New Book
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card card">
            <div className="stat-icon" style={{ background: `${color}18`, color }}>
              <Icon size={20} />
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Books</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("all-books")}>
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div className="recent-list">
            {recentBooks.map(book => (
              <div key={book.id} className="recent-item" onClick={() => navigate("book-detail", book.id)}>
                <div className="recent-cover">{book.title?.charAt(0)}</div>
                <div className="recent-info">
                  <span className="recent-title">{book.title}</span>
                  <span className="recent-author">{book.author}</span>
                </div>
                <div className="recent-price">${p(book.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            {[
              { label: "Browse All Books", desc: "View complete catalog", page: "all-books", icon: BookOpen },
              { label: "Search Books", desc: "Find by title or author", page: "search", icon: Activity },
              { label: "Filter & Browse", desc: "By category, price, stock", page: "filter", icon: Package },
              { label: "View Statistics", desc: "Detailed analytics", page: "statistics", icon: TrendingUp },
            ].map(({ label, desc, page, icon: Icon }) => (
              <button key={page} className="quick-action-btn" onClick={() => navigate(page)}>
                <div className="qa-icon"><Icon size={16} /></div>
                <div>
                  <div className="qa-label">{label}</div>
                  <div className="qa-desc">{desc}</div>
                </div>
                <ArrowRight size={14} className="qa-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
