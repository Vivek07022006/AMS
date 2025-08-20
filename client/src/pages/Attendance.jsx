import "./Attendance.css";

export default function Attendance() {
  const dummy = [
    { date: "2025-08-18", status: "present" },
    { date: "2025-08-17", status: "absent" },
  ];

  return (
    <div className="attendance-container">
      <h2>My Attendance</h2>
      <table>
        <thead>
          <tr><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          {dummy.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td className={r.status}>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
