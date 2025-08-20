import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard(){
  const [rows,setRows] = useState([]);
  useEffect(()=>{
    api.get("/attendance?from=1900-01-01").then(({data})=>setRows(data));
  },[]);
  const override = async (id,status)=>{
    const { data } = await api.patch(`/attendance/${id}/override`, { status });
    setRows(prev=>prev.map(r=>r._id===id? data : r));
  };
  return (
    <div style={{ padding:24 }}>
      <h2>Admin — Attendance & Flags</h2>
      <table>
        <thead>
          <tr><th>User</th><th>Date</th><th>Status</th><th>Score</th><th>Flags</th><th>Action</th></tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r._id}>
              <td>{r.user?.name}</td>
              <td>{r.date}</td>
              <td>{r.status}</td>
              <td>{r.ai?.score?.toFixed?.(2)}</td>
              <td>{(r.ai?.flags||[]).join(", ")}</td>
              <td>
                <button onClick={()=>override(r._id,"present")}>Mark Present</button>
                <button onClick={()=>override(r._id,"absent")}>Mark Absent</button>
                <button onClick={()=>override(r._id,"pending")}>Pending</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
