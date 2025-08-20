import { useState } from "react";
import api from "../api/axios";

export default function UploadProof({ task, onUploaded }){
  const [file,setFile] = useState(null);
  const [msg,setMsg] = useState("");

  const submit = async (e)=>{
    e.preventDefault();
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api.post(`/evidence/${task._id}/upload`, fd, {
      headers: { "Content-Type":"multipart/form-data" }
    });
    setMsg(`AI score: ${data.attendance?.ai?.score ?? "—"} | status: ${data.attendance?.status}`);
    onUploaded?.(data);
  };

  return (
    <form onSubmit={submit} style={{ display:"grid", gap:8, marginTop:8 }}>
      <input type="file" accept="image/*,application/pdf" onChange={e=>setFile(e.target.files[0])} />
      <button disabled={!file}>Upload & Analyze</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}
