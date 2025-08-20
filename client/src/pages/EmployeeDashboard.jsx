import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductivityBadge from "../components/ProductivityBadge";
import TaskList from "../components/TaskList";
import Attendance from "./Attendance";

export default function EmployeeDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get("/attendance/mine");
      setAttendance(data);

      if (data.length > 0) {
        // take last day's score
        const last = data[0];
        setScore(last.ai?.score ?? null);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <h2>Employee Dashboard</h2>

      {score !== null && (
        <div>
          <h3>My Productivity Score (last update)</h3>
          <ProductivityBadge score={score} />
        </div>
      )}

      <div>
        <h3>My Tasks</h3>
        <TaskList />
      </div>

      <div>
        <h3>My Attendance</h3>
        <Attendance />
      </div>
    </div>
  );
}
