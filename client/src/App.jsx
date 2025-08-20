import { Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app-container">
      <h1 className="title">🚀 AI Task & Attendance</h1>
      {!user ? (
        <p><Link to="/login">Login</Link></p>
      ) : (
        <>
          <p>Hello, {user.name} ({user.role})</p>
          <nav className="nav-links">
            {user.role === "admin" ? <Link to="/admin">Admin</Link> : <Link to="/employee">Employee</Link>}
            <Link to="/tasks">Tasks</Link>
            <Link to="/attendance">Attendance</Link>
            {user.role === "admin" && <Link to="/review-flags">Review Flags</Link>}
            <button onClick={logout}>Logout</button>
          </nav>
        </>
      )}
    </div>
  );
}
