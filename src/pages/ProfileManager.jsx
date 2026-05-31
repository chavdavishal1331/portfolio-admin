import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import { getImageUrl } from "../utils/imageUrl";
import { getApiErrorMessage } from "../utils/apiError";
import { assertSavedItem } from "../utils/fetchList";
import { usePreloadedSrc } from "../hooks/usePreloadedSrc";

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

function applyProfileToState(data, setters) {
  if (!data) return;
  const { setForm, setPreview, setCurrentResume, setImageCacheKey } = setters;

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

  const version = data.updatedAt && data.image
    ? `${data.updatedAt}-${data.image}`
    : data.image || "";
  setImageCacheKey(version);
  setPreview(data.image ? getImageUrl(data.image, version) : "");
  setCurrentResume(data.resume || "");
}

function ProfileManager() {
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [blobPreview, setBlobPreview] = useState("");
  const [imageCacheKey, setImageCacheKey] = useState("");
  const [currentResume, setCurrentResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const blobPreviewRef = useRef(null);

  const serverImageUrl =
    !blobPreview && preview ? preview : null;
  const { src: preloadedImage, ready: imagePreloaded } =
    usePreloadedSrc(serverImageUrl);

  const clearBlobPreview = () => {
    if (blobPreviewRef.current) {
      URL.revokeObjectURL(blobPreviewRef.current);
      blobPreviewRef.current = null;
    }
    setBlobPreview("");
  };

  const loadProfile = async () => {
    try {
      const { data } = await api.get("/profile");
      clearBlobPreview();
      if (data && typeof data === "object" && data._id) {
        applyProfileToState(data, {
          setForm,
          setPreview,
          setCurrentResume,
          setImageCacheKey,
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(err, "Could not load profile"),
      });
    }
  };

  useEffect(() => {
    loadProfile().finally(() => setLoading(false));
    return () => clearBlobPreview();
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

      // POST (not PUT) — multipart file upload is reliable on all hosts
      const { data } = await api.post("/profile", body);
      assertSavedItem(data, "Profile");
      clearBlobPreview();
      setImageFile(null);
      setResumeFile(null);
      applyProfileToState(data, {
        setForm,
        setPreview,
        setCurrentResume,
        setImageCacheKey,
      });
      setMessage({ type: "success", text: "Profile saved successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(err, "Failed to save profile"),
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
              <a
                href={getImageUrl(currentResume, imageCacheKey)}
                target="_blank"
                rel="noopener noreferrer"
              >
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
                clearBlobPreview();
                setImageFile(file);
                const blobUrl = URL.createObjectURL(file);
                blobPreviewRef.current = blobUrl;
                setPreview("");
                setBlobPreview(blobUrl);
              }
            }}
          />
          {blobPreview && (
            <img
              src={blobPreview}
              alt="Profile preview"
              className="admin-image-preview is-visible"
            />
          )}
          {!blobPreview && preloadedImage && imagePreloaded && (
            <img
              key={imageCacheKey}
              src={preloadedImage}
              alt="Profile preview"
              className="admin-image-preview is-visible"
            />
          )}
          {!blobPreview && preview && !imagePreloaded && (
            <div className="admin-image-preview profile-image-placeholder" />
          )}
          {imageFile && (
            <p className="file-hint">New image selected — click Save Profile to upload.</p>
          )}
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default ProfileManager;
