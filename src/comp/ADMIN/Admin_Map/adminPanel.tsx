import"./Layout/MapView.css";
import Header from "../../header";
import AdminMapView from "./MapComponent/MapView";
import ParticipantStack from "./MapComponent/participantList";
import NotificationQueue from "./MapComponent/Notification";
import { useState } from "react";
import { BASE_URL } from "../../../App";


type Event = {
  id: number;
  event_title: string;
  description: string;
  event_date: string;
  creator_name: string;
  event_code: string;
};



// use interface to construct the Object.
export interface participants_Interface { //use import type to use in other file.
    id: number,
    name: string,
    team: string | null,
    status: "active" | "offline" | "finished";
}

// const mockParticipants: participants_Interface[] = [
//   { id: 12, name: "John Doe", team: "Red", status: "active" },
//   { id: 21, name: "Maria Blue", team: "Blue", status: "offline" },
//   { id: 33, name: "Chris Green", team: "Green", status: "finished" },
// ]

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
// TODO It should be handled with the EventID. If there is no eventId, it should be displayed the no Event Id.
export default function AdminPanel() {

// EventId from registered Event
    const [events, setEvents] = useState<Event[]>([]);
     const [eventId, setEventId] = useState(localStorage.getItem("event_id") || "");

 const handleSaveEventId = async() => {
// cheks whether the eventId is real or not.  
    if(!eventId){
        alert("Invalid EventId");
        return;
    }

    try{

        const res = await fetch(`${BASE_URL}/events/${eventId}`);
        if(!res.ok){ throw new Error("Event not found")};

        const eventData: Event = await res.json();

// Confirmation popup
        const confirmLoad = window.confirm(
        `Load Event:
            Title: ${eventData.event_title}
            Creator: ${eventData.creator_name}
            Date: ${eventData.event_date}

            Proceed?`
        );

        if (!confirmLoad) return;

    // Save event ID locally
    localStorage.setItem("admin_event_id", eventId);
    alert("Event successfully loaded!");

    }catch(err){
        console.error(err);
    alert("Catch Error:Invalid Event ID. Please try again.");
    }
// then we will show the event title and admin's name. So we need to access the eventList
    //   {events.length > 0 ? (
    //     <div className="event-list">
    //       {events.map((event) => (
    //         <div key={event.id} className="event-card">
    //           <div className="event-info">
    //             <h3>{event.event_title}</h3>
    //             <p>{event.description}</p>
    //             <p></p>




  };

    return(
        <>
        <h1>AdminPanel</h1>
        <h3>This is demo competion; ID AAAAA</h3>
        <h4>Admin; name, ID</h4>
        <Header />


        {/* Event Input */}
      <div className="EventSelector">
        <input 
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          placeholder="Enter event ID"
        />
        <button onClick={handleSaveEventId}>Load Event</button>
      </div>

            <div className="admin-map-layout">

                <div className="Center">
                    <AdminMapView/> 
                </div>

                <div className="Left">
                  {/* <ParticipantStack participants={mockParticipants}/>:/}   {/* from participants_Interface NotificationProps */}
                </div>
                
                <div className="Bottom">
                    <NotificationQueue notification={announcements} />  {/* from Notification_Interface NotificationProps */}
                </div>

        </div>
        
        
        </>

    );
};