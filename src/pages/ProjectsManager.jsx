import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import api from "../api/api";
import { getImageUrl } from "../utils/imageUrl";
import { getApiErrorMessage } from "../utils/apiError";

const emptyProject = { title: "", description: "", tech: "", githubLink: "", liveLink: "" };

function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const fetchProjects = () => {
    api.get("/projects").then(({ data }) => setProjects(data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyProject);
    setImageFile(null);
    setPreview("");
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title || "",
      description: p.description || "",
      tech: p.tech || "",
      githubLink: p.githubLink || "",
      liveLink: p.liveLink || "",
    });
    setImageFile(null);
    setPreview(p.image ? getImageUrl(p.image, p.updatedAt) : "");
    setModalOpen(true);
  };

  const buildFormData = () => {
    const body = new FormData();
    body.append("title", form.title);
    body.append("description", form.description);
    body.append("tech", form.tech || "");
    if (form.githubLink.trim()) body.append("githubLink", form.githubLink.trim());
    if (form.liveLink.trim()) body.append("liveLink", form.liveLink.trim());
    if (imageFile) body.append("image", imageFile);
    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const body = buildFormData();
      if (editing) {
        await api.post(`/projects/${editing._id}`, body);
        setMessage({ type: "success", text: "Project updated" });
      } else {
        await api.post("/projects", body);
        setMessage({ type: "success", text: "Project added" });
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(err, "Failed to save project"),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setMessage({ type: "success", text: "Project deleted" });
      fetchProjects();
    } catch {
      setMessage({ type: "error", text: "Failed to delete" });
    }
  };

  if (loading) {
    return <div className="admin-loading"><div className="admin-spinner" /></div>;
  }

  return (
    <>
      {message.text && <div className={`admin-alert admin-alert-${message.type}`}>{message.text}</div>}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Projects ({projects.length})</h2>
          <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd}>
            <FaPlus /> Add Project
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Image</th><th>Title</th><th>Tech</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr className="empty-row"><td colSpan={4} className="empty-cell">No projects yet.</td></tr>
              ) : projects.map((p) => (
                <tr key={p._id}>
                  <td data-label="Image">{p.image ? <img src={getImageUrl(p.image, p.updatedAt)} alt="" className="admin-project-thumb" key={p.updatedAt} /> : "—"}</td>
                  <td data-label="Title">{p.title}</td>
                  <td data-label="Tech">{p.tech}</td>
                  <td data-label="Actions">
                    <div className="admin-table-actions">
                      <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(p)}><FaEdit /></button>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(p._id)}><FaTrash /></button>
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
            <h3>{editing ? "Edit Project" : "Add Project"}</h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="admin-form-group">
                <label>Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="admin-form-group">
                <label>Tech Stack (optional)</label>
                <input value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} placeholder="React • Node.js • MongoDB" />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>GitHub Link (optional)</label>
                  <input
                    type="url"
                    value={form.githubLink}
                    onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Live Demo Link (optional)</label>
                  <input
                    type="url"
                    value={form.liveLink}
                    onChange={(e) => setForm({ ...form, liveLink: e.target.value })}
                    placeholder="https://yourproject.com"
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Project Image (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
                }} />
                {preview && <img src={preview} alt="" className="admin-image-preview admin-image-preview-lg" />}
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectsManager;
