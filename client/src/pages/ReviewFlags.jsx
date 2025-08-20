import "./ReviewFlags.css";

export default function ReviewFlags() {
  const flagged = [
    { date: "2025-08-16", flag: "Duplicate Evidence" },
    { date: "2025-08-15", flag: "Subtasks incomplete" },
  ];

  return (
    <div className="reviewflags-container">
      <h2>Flagged Attendance</h2>
      <ul>
        {flagged.map((f, i) => (
          <li key={i}>{f.date}: {f.flag}</li>
        ))}
      </ul>
    </div>
  );
}
