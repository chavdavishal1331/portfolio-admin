import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import RootRedirect from "./components/RootRedirect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProfileManager from "./pages/ProfileManager";
import SkillsManager from "./pages/SkillsManager";
import ProjectsManager from "./pages/ProjectsManager";
import ExperienceManager from "./pages/ExperienceManager";
import MessagesManager from "./pages/MessagesManager";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RootRedirect />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<ProfileManager />} />
        <Route path="skills" element={<SkillsManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="experience" element={<ExperienceManager />} />
        <Route path="messages" element={<MessagesManager />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
