import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { getApiErrorMessage } from "../utils/apiError";
import BackendStatus from "../components/BackendStatus";

function Dashboard() {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    experience: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [clearing, setClearing] = useState(false);

  const loadStats = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/skills"),
      api.get("/projects"),
      api.get("/experience"),
      api.get("/contact"),
    ])
      .then(([skills, projects, experience, messages]) => {
        setStats({
          skills: Array.isArray(skills.data) ? skills.data.length : 0,
          projects: Array.isArray(projects.data) ? projects.data.length : 0,
          experience: Array.isArray(experience.data)
            ? experience.data.length
            : 0,
          messages: Array.isArray(messages.data) ? messages.data.length : 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleClearAll = async () => {
    if (
      !window.confirm(
        "Delete ALL portfolio content (profile, skills, projects, experience, messages)? Admin login will stay."
      )
    ) {
      return;
    }
    setClearing(true);
    setNotice({ type: "", text: "" });
    try {
      const { data } = await api.post("/admin/clear-content");
      setNotice({
        type: "success",
        text: data.message || "All content deleted",
      });
      loadStats();
    } catch (err) {
      setNotice({
        type: "error",
        text: getApiErrorMessage(err, "Could not clear content"),
      });
    } finally {
      setClearing(false);
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
      <BackendStatus />
      {notice.text && (
        <div className={`admin-alert admin-alert-${notice.type}`}>{notice.text}</div>
      )}

      <div className="admin-stats">
        <div className="admin-stat-card">
          <h3>{stats.skills}</h3>
          <p>Skills</p>
        </div>
        <div className="admin-stat-card">
          <h3>{stats.projects}</h3>
          <p>Projects</p>
        </div>
        <div className="admin-stat-card">
          <h3>{stats.experience}</h3>
          <p>Experience</p>
        </div>
        <div className="admin-stat-card">
          <h3>{stats.messages}</h3>
          <p>Messages</p>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="admin-quick-links">
          <Link to="/profile" className="admin-quick-link">
            <strong>Profile</strong>
            <span>Name, bio, contact info</span>
          </Link>
          <Link to="/skills" className="admin-quick-link">
            <strong>Skills</strong>
            <span>Add or edit skills</span>
          </Link>
          <Link to="/projects" className="admin-quick-link">
            <strong>Projects</strong>
            <span>Manage portfolio projects</span>
          </Link>
          <Link to="/experience" className="admin-quick-link">
            <strong>Experience</strong>
            <span>Work history timeline</span>
          </Link>
          <Link to="/messages" className="admin-quick-link">
            <strong>Messages</strong>
            <span>Contact form submissions</span>
          </Link>
        </div>

        <div className="admin-danger-zone">
          <h3>Danger zone</h3>
          <p>Remove all portfolio content and start fresh. Your admin account is kept.</p>
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={handleClearAll}
            disabled={clearing}
          >
            {clearing ? "Deleting..." : "Delete all content"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
