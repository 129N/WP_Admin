

import"../Layout/MapView.css";
import type { participants_Interface } from "../adminPanel";

interface ParticipantProps {
    participants: participants_Interface[];
}

export default function ParticipantStack({participants} : ParticipantProps){


//----------------------
// RENDERING ZONE    
//----------------------
return(
    <>
    <div className="Stack_Container">  {/* multiple rows with 1 colmuns */}
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
    </>
);
}