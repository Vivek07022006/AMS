import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Attendance(){
  const [rows,setRows] = useState([]);
  useEffect(()=>{
    api.get("/attendance/mine").then(({data})=>setRows(data));
  },[]);
  return (
    <div style={{ padding:24 }}>
      <h2>My Attendance</h2>
      <table>
        <thead><tr><th>Date</th><th>Status</th><th>Score</th><th>Source</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r._id}>
              <td>{r.date}</td>
              <td>{r.status}</td>
              <td>{r.ai?.score?.toFixed?.(2)}</td>
              <td>{r.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
