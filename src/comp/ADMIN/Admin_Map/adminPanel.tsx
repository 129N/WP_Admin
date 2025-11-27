import"./Layout/MapView.css";
import Header from "../../header";
import AdminMapView from "./MapComponent/MapView";
import ParticipantStack from "./MapComponent/participantList";
import NotificationQueue from "./MapComponent/Notification";

// use interface to construct the Object.
export interface participants_Interface { //use import type to use in other file.
    id: number,
    name: string,
    team: string | null,
    status: "active" | "offline" | "finished";
}

const mockParticipants: participants_Interface[] = [
  { id: 12, name: "John Doe", team: "Red", status: "active" },
  { id: 21, name: "Maria Blue", team: "Blue", status: "offline" },
  { id: 33, name: "Chris Green", team: "Green", status: "finished" },
]

export interface Notification_Interface {
    id: number;
    name: string;
    type: "emergency" | "surrender" | "waypoint" | "offline";
    message: string;
    timestamp: string;
}

const announcements: Notification_Interface[] = [
    { id: 12, name: "John Doe", type: "emergency", message: "Red", timestamp: "active" },
    { id: 21, name: "Maria Blue", type: "surrender", message: "Blue", timestamp: "offline" },
    { id: 33, name: "Chris Green",type: "waypoint", message: "Green", timestamp: "finished" },
]; 

export default function AdminPanel() {
    return(
        <>
        <h1>AdminPanel</h1>
        <h3>This is demo competion; ID AAAAA</h3>
        <h4>Admin; name, ID</h4>
        <Header />
            <div className="admin-map-layout">

                <div className="Center">
                    <AdminMapView/> 
                </div>

                <div className="Left">
                    <ParticipantStack participants={mockParticipants}/> {/* from participants_Interface NotificationProps */}
                </div>
                
                <div className="Bottom">
                    <NotificationQueue notification={announcements} />  {/* from Notification_Interface NotificationProps */}
                </div>

        </div>
        
        
        </>

    );
};