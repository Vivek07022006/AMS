import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ReviewFlags() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/attendance?from=1900-01-01").then(({ data }) => {
      // only keep flagged ones
      const flagged = data.filter(r => (r.ai?.flags || []).length > 0);
      setRows(flagged);
    });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Flagged Attendance Records</h2>
      {rows.length === 0 ? (
        <p>No AI flags detected 🚀</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
              <th>Flags</th>
              <th>AI Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id}>
                <td>{r.user?.name}</td>
                <td>{r.date}</td>
                <td>{r.status}</td>
                <td>{(r.ai?.flags || []).join(", ")}</td>
                <td>{r.ai?.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
