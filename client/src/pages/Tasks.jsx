import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import "./Tasks.css";

export default function Tasks() {
  return (
    <div className="tasks-container">
      <h2>Tasks</h2>
      <TaskForm />
      <TaskList />
    </div>
  );
}
