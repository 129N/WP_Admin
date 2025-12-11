import  { useEffect, useState } from "react";
import { BASE_URL } from "../../App";
import "./Layout/GPXFileLayout.css";
import Header from "../header";


type GPXFileItem = {
    id: number;
    route_name: string;
    created_at: string;
}; 
export default function GpxFileList() {
  const [files, setFiles] = useState<GPXFileItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load ALL GPX list Route::get('/ADM_GPX_LIST', [GpxController::class, 'list']);
  const loadFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/ADM_GPX_LIST`);
      const json = await res.json();
      setFiles(json);
    } catch (err) {
      console.error("❌ Error loading GPX list:", err);
      alert("Error fetching GPX files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

// DELETE Route::delete('/ADM_GPX_DELETE/{file_id}', [GpxController::class, 'delete']);
  const deleteFile = async (fileId: number) => {
    if (!window.confirm(`Delete GPX File #${fileId}?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/ADM_GPX_DELETE/${fileId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Deleted successfully");
        loadFiles(); // refresh
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Delete failed due to error.");
    }
  };



// DOWNLOAD one GPX file.  Route::get('/ADM_GPX_DOWNLOAD{file_id}', [GpxController::class, 'download']);
const downloadFile = async(fileId:number) =>{
    window.location.href = `${BASE_URL}/ADM_GPX_DOWNLOAD/${fileId}`;
};

  return (
    <div className="gpx-wrapper">
      <Header/>
      <h1 className="gpx-header">📁 GPX File List</h1>

      {loading && <p>Loading files...</p>}

      <div className="gpx-list">
        {files.map((file) => (
          <div key={file.id} className="gpx-card">
            <p><b>ID:</b> {file.id}</p>
            <p><b>Name:</b> {file.route_name}</p>
            <p><b>Created:</b> {file.created_at}</p>

            <button
              className="gpx-delete-btn"
              onClick={() => downloadFile(file.id)}
            >
              Downloan
            </button>

            <button
              className="gpx-delete-btn"
              onClick={() => deleteFile(file.id)}
            >
              Delete
            </button>

          </div>
        ))}

        {files.length === 0 && !loading && (
          <p>No GPX files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
