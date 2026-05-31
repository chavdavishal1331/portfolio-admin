import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import api from "../api/api";
import { getApiErrorMessage } from "../utils/apiError";

const emptyExp = { company: "", role: "", year: "", duration: "", color: "#8B5CF6" };

function ExperienceManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyExp);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchItems = () => {
    api.get("/experience").then(({ data }) => setItems(data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyExp); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ company: item.company || "", role: item.role || "", year: item.year || "", duration: item.duration || "", color: item.color || "#8B5CF6" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/experience/${editing._id}`, form);
        setMessage({ type: "success", text: "Experience updated" });
      } else {
        await api.post("/experience", form);
        setMessage({ type: "success", text: "Experience added" });
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(err, "Failed to save experience"),
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await api.delete(`/experience/${id}`);
      setMessage({ type: "success", text: "Deleted" });
      fetchItems();
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
          <h2>Experience ({items.length})</h2>
          <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd}><FaPlus /> Add Experience</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Role</th><th>Company</th><th>Year</th><th>Duration</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr className="empty-row"><td colSpan={5} className="empty-cell">No experience yet.</td></tr>
              ) : items.map((item) => (
                <tr key={item._id}>
                  <td data-label="Role">{item.role}</td>
                  <td data-label="Company"><span style={{ color: item.color }}>{item.company}</span></td>
                  <td data-label="Year">{item.year}</td>
                  <td data-label="Duration">{item.duration}</td>
                  <td data-label="Actions">
                    <div className="admin-table-actions">
                      <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(item)}><FaEdit /></button>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(item._id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? "Edit Experience" : "Add Experience"}</h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Role</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              </div>
              <div className="admin-form-group">
                <label>Company</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Year / Period</label>
                  <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="May 2025 - Present" />
                </div>
                <div className="admin-form-group">
                  <label>Duration</label>
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="7 Months" />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Color</label>
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">{editing ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ExperienceManager;
