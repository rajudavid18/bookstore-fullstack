import { CheckCircle, XCircle } from "lucide-react";

export default function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`toast ${type}`}>
      {type === "success" ? <CheckCircle size={16} color="var(--green)" /> : <XCircle size={16} color="var(--red)" />}
      {message}
    </div>
  );
}
