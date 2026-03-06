import { Package, Eye } from "lucide-react";

export default function BookCard({ book, onView }) {
  const stockColor = book.stockQuantity > 10 ? "badge-green" : book.stockQuantity > 0 ? "badge-amber" : "badge-red";
  const stockText = book.stockQuantity > 0 ? `${book.stockQuantity} in stock` : "Out of stock";

  return (
    <div className="book-card card" onClick={() => onView(book.id)}>
      <div className="book-card-top">
        <div className="book-cover">
          <span>{book.title?.charAt(0) || "B"}</span>
        </div>
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <span className={`badge badge-blue`} style={{ marginTop: 6 }}>
            {book.category}
          </span>
        </div>
      </div>
      <div className="book-card-footer">
        <div className="book-price">${book.price?.toFixed(2)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`badge ${stockColor}`}>
            <Package size={10} style={{ marginRight: 3 }} />
            {stockText}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onView(book.id); }}>
            <Eye size={13} /> View
          </button>
        </div>
      </div>
    </div>
  );
}
