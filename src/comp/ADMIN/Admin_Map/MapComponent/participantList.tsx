

import { useEffect, useState } from "react";
import"../Layout/MapView.css";
import type { participants_Interface } from "../adminPanel";
import { BASE_URL } from "../../../../App";

interface ParticipantProps {
    participants: participants_Interface[] | null | undefined;
}

export default function ParticipantStack({participants} : ParticipantProps){


    const [eventId, setEventId] = useState(''); //coming from getItem?? 
    const [competitiotrs, setParticipants] = useState();
    const [loading, setLoading] = useState(false);

    // const [locations, setLocations] = useState();
//----------------------
// initiate loading   
//----------------------


useEffect(() =>{

    if(!eventId) return; 
    let cancelled = false;

// run the fetching
setLoading(true);
    const fetchParticipants  = async() =>{  
    console.log("Participants fetching....");
    try{
        const res = await fetch(`${BASE_URL}/events/${eventId}/participants`);
        if(!res.ok) {throw new Error("Failed to fetch Participants")};
        const data = await res.json();
        if(!cancelled){setParticipants(data);}
        setLoading(false);
    }
    catch(err){
        console.error("participants error:", err);
        setLoading(true);
    }
};
  fetchParticipants();

return () => {cancelled = true;}
}, [eventId]);


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



if (loading || !participants) {
    return (
      <div className="List_Container">
        <h2>Participants</h2>
        <p>Loading...</p>
      </div>
    );
  };


if (!eventId) {
    return (
      <div className="List_Container">
        <h2>Participants</h2>
        <p>Please enter an Event ID.</p>
      </div>
    );
  }


//----------------------
// RENDERING ZONE    
//----------------------
return(
    
    <div className="List_Container">  {/* multiple rows with 1 colmuns */}
        <h2>List</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {participants.map((p) => (
            <li
            key={p.id}
             style={{
              padding: "4px 8px",
              marginBottom: "4px",
              border: "1px solid #ccc",
              fontSize: "0.9rem",
            }}
            >
                <div>[{p.id}] {p.name}</div>
                <div>Team: {p.team}</div>
                <div>Status: {p.status}</div>
            </li>
        ))}
        </ul>

    </div>

);
}