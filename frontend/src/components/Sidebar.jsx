import { BookOpen, LayoutDashboard, List, Search, Filter, PlusCircle, BarChart2, ChevronLeft, ChevronRight } from "lucide-react";
import "./Sidebar.css";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "all-books", label: "All Books", icon: List },
  { id: "search", label: "Search", icon: Search },
  { id: "filter", label: "Filter & Browse", icon: Filter },
  { id: "statistics", label: "Statistics", icon: BarChart2 },
  { id: "add-book", label: "Add Book", icon: PlusCircle },
];

export default function Sidebar({ currentPage, navigate, isOpen, toggle }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand" onClick={() => navigate("dashboard")}>
          <div className="brand-icon">
            <BookOpen size={18} />
          </div>
          {isOpen && <span className="brand-name">BookStore</span>}
        </div>
        <button className="toggle-btn" onClick={toggle}>
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${currentPage === id ? "active" : ""}`}
            onClick={() => navigate(id)}
            title={!isOpen ? label : ""}
          >
            <Icon size={18} />
            {isOpen && <span>{label}</span>}
            {currentPage === id && <div className="active-bar" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isOpen && (
          <div className="api-status">
            <div className="status-dot" />
            <span>API: localhost:8081</span>
          </div>
        )}
      </div>
    </aside>
  );
}
