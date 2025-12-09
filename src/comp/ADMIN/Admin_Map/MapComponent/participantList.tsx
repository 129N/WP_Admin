

import { useEffect, useState } from "react";
import"../Layout/MapView.css";
import type { participants_Interface } from "../adminPanel";

interface ParticipantProps {
    participants: participants_Interface[] | null ;
    //participants: any[] | null;
}

export default function ParticipantStack({participants} : ParticipantProps){
  // Filtering System 
  const [filteredParticipants, setFilteredParticipants] = useState<participants_Interface[]>([]);
  
  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

useEffect(() => {
  applyFilters();
}, [participants, filterName, filterTeam, filterStatus]);


function applyFilters() {

  if(!participants) {
    setFilteredParticipants([]);
    return;
  }

let list = participants ?  [...participants] : [];

  // Filter by name
  if (filterName.trim() !== "") {
    list = list.filter((p) =>
      (p.name ?? "").toLowerCase().includes(filterName.toLowerCase())
    );
  }

  // Filter by team
  if (filterTeam !== "all") {
    list = list.filter((p) => p.team === filterTeam);
  }

  // Filter by status
  if (filterStatus !== "all") {
    list = list.filter((p) => p.status === filterStatus);
  }

  setFilteredParticipants(list);
};

// No participants detected
  if (!participants || participants.length === 0) {
    return (
      <div className="Stack_Container">
        <h2>Participants</h2>
        <p>No participants registered for this event.</p>
      </div>
    );
  }

//----------------------
// RENDERING ZONE    
//----------------------
return(
    
<div className="List_Container">  {/* multiple rows with 1 colmuns */}

  <div className="Stack_Container">
    <h2>Participants List</h2>
    <div style={{ marginBottom: "10px" }}>
{/* FILTERS */}
      <input
        type="text"
        placeholder="Search name..."
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
        style={{ width: "100%", padding: "4px", marginBottom: "6px" }}
      />
{/*TEAM FILTERS */}
      <select
        value={filterTeam}
        onChange={(e) => setFilterTeam(e.target.value)}
        style={{ width: "100%", padding: "4px", marginBottom: "6px" }}
      >
        <option value="all">All Teams</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </select>
{/* STATUS FILTER */}
      <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: "100%", padding: "4px" }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="offline">Offline</option>
          <option value="finished">Finished</option>
      </select>
    </div>

{/* LIST */}
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {filteredParticipants.map((p) => (
        <li
          key={p.id}
          style={{
            padding: "4px 8px",
            marginBottom: "4px",
            border: "1px solid #ccc",
            fontSize: "0.9rem",
          }}
        >
          <div><strong>Name:</strong> {p.name ?? "N/A"}</div>
          <div><strong>Team:</strong> {p.team ?? "N/A"}</div>
          <div><strong>Status:</strong> {p.status}</div>
        </li>
      ))}
      </ul>
  </div>


</div>

);
}



// useEffect(() =>{

//     if(!event_code) return; 
//     let cancelled = false;

// // run the fetching
// setLoading(true);
//     const fetchParticipants  = async() =>{  
//     console.log("Participants fetching....");
//     try{
//         const res = await fetch(`${BASE_URL}/events/${event_code}/participants`);
//         if(!res.ok) {throw new Error("Failed to fetch Participants")};
//         const data = await res.json();
//         if(!cancelled){setParticipants(data);}
//         setLoading(false);
//     }
//     catch(err){
//         console.error("participants error:", err);
//         setLoading(true);
//     }
// };
//   fetchParticipants();

// return () => {cancelled = true;}
// }, [event_code]);


// const fetchLocations = async () => {
//    console.log();
//     try{
//         const res = await fetch(`${BASE_URL}/events/${eventId}/locations`);
//             if(!res.ok) {throw new Error("Failed to fetch locations")};
//         const data = await res.json();
//             if (!cancelled) setLocations(data);
//         setLocations(data);
//     } 
//     catch(error){
//         console.error("locations error:", error);
//     }
// };