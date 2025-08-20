import "./TaskList.css";

export default function TaskList() {
  const tasks = [
    { title: "Build Login Page", status: "done" },
    { title: "Implement Dashboard", status: "in-progress" },
  ];

  return (
    <div className="tasklist">
      <h3>My Tasks</h3>
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>
            <span>{t.title}</span>
            <span className={`status ${t.status}`}>{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
