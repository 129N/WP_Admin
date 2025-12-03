

import"../Layout/MapView.css";
import type { participants_Interface } from "../adminPanel";

interface ParticipantProps {
    participants: participants_Interface[] | null ;
    //participants: any[] | null;
}

export default function ParticipantStack({participants} : ParticipantProps){
  
//----------------------
// RENDERING ZONE    
//----------------------
return(
    
<div className="List_Container">  {/* multiple rows with 1 colmuns */}
  {!participants || participants.length === 0 ? (
  <div className="Stack_Container">
    <h2>Participants</h2>
    <p>No participants registered for this event.</p>
    <p>Please enter an Event CODE.</p>
  </div>
) : (
  <div className="Stack_Container">
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
                <div>Name  {p.name ?? "N/A"}</div>
                <div>Team: {p.team}</div>
                <div>Status: {p.status}</div>
            </li>
        ))}
        </ul>
  </div>
)}
    


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