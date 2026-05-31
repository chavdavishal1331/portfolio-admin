import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "../api/api";

function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchMessages = () => {
    api.get("/contact").then(({ data }) => setMessages(data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessage({ type: "success", text: "Message deleted" });
      fetchMessages();
    } catch {
      setMessage({ type: "error", text: "Failed to delete" });
    }
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  return (
    <>
      {message.text && <div className={`admin-alert admin-alert-${message.type}`}>{message.text}</div>}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Contact Messages ({messages.length})</h2>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr className="empty-row"><td colSpan={6} className="empty-cell">No messages yet.</td></tr>
              ) : messages.map((m) => (
                <tr key={m._id}>
                  <td data-label="Name">{m.name}</td>
                  <td data-label="Email">{m.email}</td>
                  <td data-label="Subject">{m.subject}</td>
                  <td data-label="Message" className="msg-cell">{m.message}</td>
                  <td data-label="Date">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(m._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default MessagesManager;
