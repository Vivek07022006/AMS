import ProductivityBadge from "../components/ProductivityBadge";
import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  return (
    <div className="employee-container">
      <h2>Employee Dashboard</h2>
      <p>Welcome Employee 🚀</p>
      <h3>My Productivity</h3>
      <ProductivityBadge score={0.75} />
    </div>
  );
}
