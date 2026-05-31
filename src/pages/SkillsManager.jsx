import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import api from "../api/api";
import { getApiErrorMessage } from "../utils/apiError";
import { fetchList } from "../utils/fetchList";
import { verifyInList } from "../utils/verifySave";
import { viewSiteLink } from "../utils/viewSite";
import SaveAlert from "../components/SaveAlert";
import { ICON_OPTIONS, getSkillIcon } from "../utils/skillIcons";

const emptySkill = { name: "", percentage: 80, icon: "FaReact", color: "#8B5CF6" };

function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySkill);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadSkills = async () => {
    setLoading(true);
    const list = await fetchList(
      () => api.get("/skills"),
      setSkills,
      (text) => text && setMessage({ type: "error", text }),
      "skills"
    );
    setLoading(false);
    return list;
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptySkill);
    setModalOpen(true);
  };

  const openEdit = (skill) => {
    setEditing(skill);
    setForm({
      name: skill.name || "",
      percentage: skill.percentage || 80,
      icon: skill.icon || "FaReact",
      color: skill.color || "#8B5CF6",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setMessage({ type: "error", text: "Skill name is required." });
      return;
    }
    const payload = { ...form, name };
    try {
      let saved;
      if (editing) {
        const { data } = await api.put(`/skills/${editing._id}`, payload);
        saved = data;
        setMessage({ type: "success", text: "Skill updated on server.", viewLink: viewSiteLink("skills") });
      } else {
        const { data } = await api.post("/skills", payload);
        saved = data;
        setMessage({ type: "success", text: "Skill added on server.", viewLink: viewSiteLink("skills") });
      }
      setModalOpen(false);
      const list = await loadSkills();
      verifyInList(saved, list, "Skill");
    } catch (err) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(err, "Failed to save skill"),
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      setMessage({ type: "success", text: "Skill deleted" });
      await loadSkills();
    } catch {
      setMessage({ type: "error", text: "Failed to delete" });
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <>
      <SaveAlert message={message} onClose={() => setMessage({ type: "", text: "" })} />

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Skills ({skills.length})</h2>
          <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd}>
            <FaPlus /> Add Skill
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>%</th>
                <th>Color</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={5} className="empty-cell">No skills yet.</td>
                </tr>
              ) : (
                skills.map((s) => (
                  <tr key={s._id}>
                    <td data-label="Icon" style={{ color: s.color, fontSize: "1.2rem" }}>
                      {getSkillIcon(s.icon)}
                    </td>
                    <td data-label="Name">{s.name}</td>
                    <td data-label="%">{s.percentage}%</td>
                    <td data-label="Color">
                      <span className="color-badge" style={{ background: s.color }} />
                      {s.color}
                    </td>
                    <td data-label="Actions">
                      <div className="admin-table-actions">
                        <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(s)}>
                          <FaEdit />
                        </button>
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(s._id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? "Edit Skill" : "Add Skill"}</h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Percentage</label>
                  <input type="number" min="0" max="100" value={form.percentage}
                    onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })} required />
                </div>
                <div className="admin-form-group">
                  <label>Color</label>
                  <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Icon</label>
                <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                  {ICON_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
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

export default SkillsManager;
