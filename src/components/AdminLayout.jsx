import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaCode,
  FaProjectDiagram,
  FaBriefcase,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
  { to: "/profile", icon: <FaUser />, label: "Profile" },
  { to: "/skills", icon: <FaCode />, label: "Skills" },
  { to: "/projects", icon: <FaProjectDiagram />, label: "Projects" },
  { to: "/experience", icon: <FaBriefcase />, label: "Experience" },
  { to: "/messages", icon: <FaEnvelope />, label: "Messages" },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-root admin-layout">
      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close menu"
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <h2>
            VC<span>.</span> Admin
          </h2>
          <small>Portfolio Control Panel</small>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href={
              import.meta.env.VITE_FRONTEND_URL ||
              "https://portfolio-frontend-oc7t.onrender.com"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-outline admin-btn-full"
          >
            <FaExternalLinkAlt /> View Site
          </a>
          <button
            type="button"
            className="admin-btn admin-btn-danger admin-btn-full"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="admin-header-titles">
              <h1>Welcome, {admin?.name || "Admin"}</h1>
              <span className="admin-email">{admin?.email}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
