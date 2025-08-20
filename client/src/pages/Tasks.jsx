import { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import UploadProof from "../components/UploadProof";

export default function Tasks(){
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding:24, display:"grid", gap:24 }}>
      <h2>Tasks</h2>
      <TaskForm onCreated={()=>location.reload()}/>
      <TaskList onSelect={setSelected}/>
      {selected && (
        <div style={{ border:"1px dashed #aaa", padding:12 }}>
          <h3>Upload Evidence for: {selected.title}</h3>
          <UploadProof task={selected} onUploaded={()=>{}}/>
        </div>
      )}
    </div>
  );
}
