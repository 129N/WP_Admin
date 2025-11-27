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

//The data is coming from adminPanel.tsx
//----------------------
// RENDERING ZONE    
//----------------------
return(
    <>
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
    </>
);
}