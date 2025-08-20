import { useState } from "react";
import "./UploadProof.css";

export default function UploadProof() {
  const [file, setFile] = useState(null);

  const upload = (e) => {
    e.preventDefault();
    alert(`Uploaded file: ${file?.name}`);
  };

  return (
    <form className="upload-proof" onSubmit={upload}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button disabled={!file}>Upload</button>
    </form>
  );
}
