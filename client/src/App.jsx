import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-indigo-600">
        🚀 AI Task & Attendance
      </h1>
      <p className="mt-2 text-gray-600">Navigate through the app:</p>
      <nav className="flex gap-4 mt-4">
        <Link className="text-blue-600 hover:underline" to="/login">Login</Link>
        <Link className="text-blue-600 hover:underline" to="/employee">Employee Dashboard</Link>
        <Link className="text-blue-600 hover:underline" to="/admin">Admin Dashboard</Link>
        <Link className="text-blue-600 hover:underline" to="/tasks">Tasks</Link>
        <Link className="text-blue-600 hover:underline" to="/attendance">Attendance</Link>
        <Link className="text-blue-600 hover:underline" to="/review-flags">Review Flags</Link>
      </nav>
    </div>
  );
}
