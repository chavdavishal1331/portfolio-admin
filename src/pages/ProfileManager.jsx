import { useEffect, useState } from "react";
import api from "../api/api";
import { getImageUrl } from "../utils/imageUrl";

const empty = {
  name: "",
  role: "",
  roles: "",
  shortBio: "",
  description: "",
  experience: "",
  projects: "",
  clients: "",
  email: "",
  phone: "",
  location: "",
};

function ProfileManager() {
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [currentResume, setCurrentResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    api
      .get("/profile")
      .then(({ data }) => {
        if (data) {
          setForm({
            name: data.name || "",
            role: data.role || "",
            roles: Array.isArray(data.roles) ? data.roles.join(", ") : "",
            shortBio: data.shortBio || "",
            description: data.description || "",
            experience: data.experience || "",
            projects: data.projects || "",
            clients: data.clients || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
          });
          if (data.image) setPreview(getImageUrl(data.image));
          if (data.resume) setCurrentResume(data.resume);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (imageFile) body.append("image", imageFile);
      if (resumeFile) body.append("resume", resumeFile);

      const { data } = await api.put("/profile", body);
      setMessage({ type: "success", text: "Profile saved successfully!" });
      setImageFile(null);
      setResumeFile(null);
      if (data) {
        setForm({
          name: data.name || "",
          role: data.role || "",
          roles: Array.isArray(data.roles) ? data.roles.join(", ") : "",
          shortBio: data.shortBio || "",
          description: data.description || "",
          experience: data.experience || "",
          projects: data.projects || "",
          clients: data.clients || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
        });
        if (data.image) setPreview(getImageUrl(data.image));
        if (data.resume) setCurrentResume(data.resume);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save",
      });
    } finally {
      setSaving(false);
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
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Profile — Hero & About</h2>
      </div>

      {message.text && (
        <div className={`admin-alert admin-alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Primary Role</label>
            <input name="role" value={form.role} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Animated Roles (comma separated)</label>
          <input
            name="roles"
            value={form.roles}
            onChange={handleChange}
            placeholder="MERN Stack Developer, Full Stack Developer"
          />
        </div>

        <div className="admin-form-group">
          <label>Hero Description</label>
          <textarea name="shortBio" value={form.shortBio} onChange={handleChange} />
        </div>

        <div className="admin-form-group">
          <label>About Text</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Experience Stat</label>
            <input name="experience" value={form.experience} onChange={handleChange} placeholder="8+ Months" />
          </div>
          <div className="admin-form-group">
            <label>Projects Stat</label>
            <input name="projects" value={form.projects} onChange={handleChange} placeholder="2+ Completed" />
          </div>
          <div className="admin-form-group">
            <label>Clients Stat</label>
            <input name="clients" value={form.clients} onChange={handleChange} placeholder="2+ Happy Clients" />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Resume PDF</label>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setResumeFile(file);
            }}
          />
          {resumeFile && (
            <p className="file-hint">New file: {resumeFile.name}</p>
          )}
          {currentResume && !resumeFile && (
            <p className="file-hint">
              Current resume uploaded —{" "}
              <a href={getImageUrl(currentResume)} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            </p>
          )}
        </div>

        <div className="admin-form-group">
          <label>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
          {preview && <img src={preview} alt="" className="admin-image-preview" />}
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default ProfileManager;
