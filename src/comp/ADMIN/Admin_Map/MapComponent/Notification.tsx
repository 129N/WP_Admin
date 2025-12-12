import"../Layout/MapView.css";
import type { Notification_Interface } from "../adminPanel";

interface NotificationProps {
    notification: Notification_Interface[];
}


export default function NotificationQueue({notification} : NotificationProps){
//The data is coming from adminPanel.tsx

// initial activate sentence 
const systemNotification: Notification_Interface = 
   {
      id: 0,
      name: "System",
      event_id: 0,
      event_code: "",
      participant_id: 0,
      type: "system", // TODO fix the BaeckEnd to segment the type of notification
      message: "Notification channel activated.",
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Sort real notifications (newest first)
  const sorted = [...notification].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Final display list = system + real notifications
  const displayList = [systemNotification, ...sorted];

//----------------------
// INITIAL ACTIVATION    
//----------------------


//----------------------
// RENDERING ZONE    
//----------------------
return(
    <div className="Stack_Container">  {/* multiple rows with 1 colmuns */}
        <h2>Notifications</h2>
      <div style={{maxHeight: "100%",overflowY: "auto"}}>
        {displayList.map((n) => (
          <div
           key={n.id + "-" + n.created_at}
            style={{
              border: "1px solid #ccc",
              padding: "4px 8px",
              marginBottom: "4px",
              fontSize: "0.9rem",
            }}
          >
            <div> <strong>{n.type.toUpperCase()}</strong> [{n.created_at}] </div>
            <div> {(n.participant?.name ?? `User ${n.participant_id}`)} has declared {n.type}</div>
            <div>{ `User ${n.participant_id}`}</div>
            <div> Participant {n.participant_id}  </div>
            <strong>{n.message}</strong>
          </div>
        ))}
      </div>
    </div>
 
);
}