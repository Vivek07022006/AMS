import { useState } from "react";
import api from "../api/axios";

export default function TaskForm({ onCreated }){
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [deadline,setDeadline] = useState("");

  const submit = async (e)=>{
    e.preventDefault();
    const { data } = await api.post("/tasks", { title, description, deadline });
    onCreated?.(data);
    setTitle(""); setDescription(""); setDeadline("");
  };

  return (
    <form onSubmit={submit} style={{ display:"grid", gap:8 }}>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} />
      <button>Create Task</button>
    </form>
  );
}
