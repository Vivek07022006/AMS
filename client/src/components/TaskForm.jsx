import { useState } from "react";
import "./TaskForm.css";

export default function TaskForm() {
  const [title, setTitle] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    alert(`Task added: ${title}`);
    setTitle("");
  };

  return (
    <form className="task-form" onSubmit={addTask}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" />
      <button>Add</button>
    </form>
  );
}
