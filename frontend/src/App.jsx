import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AllBooks from "./pages/AllBooks";
import BookDetail from "./pages/BookDetail";
import SearchBooks from "./pages/SearchBooks";
import FilterBooks from "./pages/FilterBooks";
import AddBook from "./pages/AddBook";
import Statistics from "./pages/Statistics";
import "./index.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = (page, id = null) => {
    setCurrentPage(page);
    setSelectedBookId(id);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard navigate={navigate} />;
      case "all-books": return <AllBooks navigate={navigate} />;
      case "book-detail": return <BookDetail bookId={selectedBookId} navigate={navigate} />;
      case "search": return <SearchBooks navigate={navigate} />;
      case "filter": return <FilterBooks navigate={navigate} />;
      case "add-book": return <AddBook navigate={navigate} />;
      case "statistics": return <Statistics />;
      default: return <Dashboard navigate={navigate} />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        isOpen={sidebarOpen}
        toggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="page-wrapper">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
