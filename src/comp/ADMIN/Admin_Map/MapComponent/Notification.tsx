import { useEffect, useState } from "react";
import { BASE_URL } from "../../../../App";
import"../Layout/MapView.css";
import type { Notification_Interface } from "../adminPanel";

interface NotificationProps {
    notification: Notification_Interface[];
}


// export interface Notification_Interface {
//     id: number;
//     name: string;
//     type: "emergency" | "surrender" | "waypoint" | "offline";
//     message: string;
//     timestamp: string;
// }

export default function NotificationQueue({notification} : NotificationProps){
  const [eventId, setEventId] = useState(''); 
  const [locations, setLocations] = useState();
      const [loading, setLoading] = useState(false);

//The data is coming from adminPanel.tsx


useEffect(() =>{
      if(!eventId) return; 

  const interval = setInterval(() => {
  fetchNotifications();
  }, 3000);
return () => clearInterval(interval);
}, [eventId]);


const fetchNotifications = async() =>{
    try{
        const res = await fetch(`${BASE_URL}/events/${eventId}/notifications`);
            if(!res.ok) {throw new Error("Failed to fetch notifications")};
        const data = await res.json();
        setLocations(data);
    } 
    catch(error){
        console.error("notifications error:", error);
    }
};



if (!eventId) {
    return (
      <div className="List_Container">
        <h2>Participants</h2>
        <p>Please enter an Event ID.</p>
      </div>
    );
  }

  if (loading || !locations) {
    return (
      <div className="List_Container">
        <h2>Participants</h2>
        <p>Loading...</p>
      </div>
    );
  };


//----------------------
// RENDERING ZONE    
//----------------------
return(
    
    <div className="Stack_Container">  {/* multiple rows with 1 colmuns */}
        <h2>List</h2>
<h3>Notifications</h3>
      <div
        style={{
          maxHeight: "100%",
          overflowY: "auto",
        }}
      >
        {notification.map((n) => (
          <div
            key={n.id}
            style={{
              border: "1px solid #ccc",
              padding: "4px 8px",
              marginBottom: "4px",
              fontSize: "0.9rem",
            }}
          >
            <div>
              <strong>{n.type.toUpperCase()}</strong> [{n.timestamp}]
            </div>
            <div>{n.name} has declared {n.type}</div>
          </div>
        ))}
      </div>
    </div>
 
);
}