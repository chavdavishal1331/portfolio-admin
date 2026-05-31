import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Dashboard() {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    experience: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/skills"),
      api.get("/projects"),
      api.get("/experience"),
      api.get("/contact"),
    ])
      .then(([skills, projects, experience, messages]) => {
        setStats({
          skills: skills.data?.length || 0,
          projects: projects.data?.length || 0,
          experience: experience.data?.length || 0,
          messages: messages.data?.length || 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <>
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
      </div>
    </>
  );
}

export default Dashboard;
