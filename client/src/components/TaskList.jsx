import { useEffect, useState } from "react";
import api from "../api/axios";

export default function TaskList({ onSelect }){
  const [tasks,setTasks] = useState([]);

  const load = async ()=> {
    const { data } = await api.get("/tasks");
    setTasks(data);
  };
  useEffect(()=>{ load(); },[]);

  const update = async (task, patch)=>{
    const { data } = await api.patch(`/tasks/${task._id}`, patch);
    setTasks(prev => prev.map(t=>t._id===task._id? data : t));
  };

  return (
    <div style={{ display:"grid", gap:12 }}>
      {tasks.map(t=>(
        <div key={t._id} style={{ border:"1px solid #ddd", padding:12 }}>
          <b>{t.title}</b> — {t.status} — {t.progress}%
          <div>{t.description}</div>
          <button onClick={()=>onSelect?.(t)}>Upload Evidence</button>
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <button onClick={()=>update(t,{ status:"in-progress" })}>In‑Progress</button>
            <button onClick={()=>update(t,{ status:"done", progress:100 })}>Mark Done</button>
          </div>
        </div>
      ))}
    </div>
  );
}
