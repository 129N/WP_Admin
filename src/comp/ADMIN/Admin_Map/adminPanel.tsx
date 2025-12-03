import"./Layout/MapView.css";
import Header from "../../header";
import AdminMapView from "./MapComponent/MapView";
import ParticipantStack from "./MapComponent/participantList";
import NotificationQueue from "./MapComponent/Notification";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../App";

type Event = {
  id: number;
  event_title: string;
  description: string;
  event_date: string;
  creator_name: string;
  event_code: string;
};


export interface Waypoint {
  id: number;
  name: string | null;
  lat: number;
  lon: number;
};

export interface TrackPoint {
  id: number;
  lat: number;
  lon: number;
   ele?: number;
};


// export interface RawTrackPoint {
//   '@_lat': string;
//   '@_lon': string;
//   ele?: { '#text': string};
// };


// use interface to construct the Object.
export interface participants_Interface {
  id: number;
  user_id: number;
  name: string;
  email: string;
  team: string | null;
  status: string;
}


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

// EventId from registered Event
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<null | Event>(null);
    const [participants, setParticipants] = useState<participants_Interface[]>([]);
    const [event_code, setEventCode] = useState(''); 
    const [token, setToken] = useState("");

      const [loading, setLoading] = useState(false);
      let cancelled = false;
const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
const [trackpoints, setTrackpoints] = useState<TrackPoint[]>([]);

//----------------------
// initiate loading   
//----------------------
  useEffect(() => 
    {
        const loadUserInfo = async() => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) setToken(storedToken);
        };
            loadUserInfo();
    });


//Event code typing 
 const handleSaveEventId = async() => {
// check whether the eventId is real or not.  
    if(!event_code || !token){
        alert("Invalid EventId");
        return;
    }

    try{
        const res = await fetch(`${BASE_URL}/events/${event_code}`); // Route::get('/events/{event_code}', [EventController::class, 'showEvent']);
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
    localStorage.setItem("admin_event_id", event_code);

    // set the typed code.
    setSelectedEvent(eventData);

    // should be set with await 
    await fetchParticipants(event_code);
    alert("Event successfully loaded!");
    }catch(err){
        console.error(err);
        alert("Catch Error:Invalid Event ID. Please try again.");
    }

  };

// Fetch the event participants
const fetchParticipants  = async(event_code:string) =>{  
    console.log("Participants fetching....");
    try{
        const res = await fetch(`${BASE_URL}/events/${event_code}/participants`);
        if(!res.ok) {throw new Error("Failed to fetch Participants")};
        const data = await res.json();
        setParticipants(data);
        setLoading(false);

// Fetch the route data afterparticipants 
        await fetchRouteData(event_code);
    }
    catch(err){
        console.error("participants error:", err);
        setLoading(true);
    }
};

// check the validity 
  const fetchRouteData = async (event_code: string) => {
    try {
      const wRes = await fetch(`${BASE_URL}/events/${event_code}/waypoints`);
      const tRes = await fetch(`${BASE_URL}/events/${event_code}/trackpoints`);

      if (!wRes.ok || !tRes.ok) throw new Error("Route fetch failed");

      const wJson = await wRes.json();
      const tJson = await tRes.json();

      const wp: Waypoint[] = wJson.waypoints;
      const tr: TrackPoint[] = tJson.trackpoints;

      setWaypoints(wp);
      setTrackpoints(tr);

      console.log("Fetched WPT:", wp);
      console.log("Fetched TRK:", tr);
    } catch (err) {
      console.error("Route Fetch Error:", err);
    }
  };
    return(
    <>

        {selectedEvent ? (
          <div className="Event_information">
  
            <h3>Event title: {selectedEvent.event_title}</h3>
            <h3>Event Code: {selectedEvent.event_code}</h3>

            <h4>Admin Name: {selectedEvent.creator_name}</h4>
            <h4>Admin ID: {selectedEvent.id}</h4>

          </div>
        ) : (
        <div className="Event_information">
            <h3>Event title: N/A </h3>
            <h3>Event Code: N/A </h3>
            <h3>Admin Name: N/A  </h3>
            <h3>Admin ID: N/A  </h3>
        </div>
        )}

    <Header />


        {/* Event Input */}
      <div className="EventSelector">
        <input 
          value={event_code}
          onChange={(e) => setEventCode(e.target.value)}
          placeholder="Enter event ID"
        />
        <button onClick={handleSaveEventId}>Load Event</button>
      </div>

            <div className="admin-map-layout">

                <div className="Center">
                    <AdminMapView waypoints = {waypoints} trackpoints = {trackpoints}/> 
                </div>

                <div className="Left">
                 <ParticipantStack participants={participants}/>  {/* from participants_Interface NotificationProps */}
                </div>
                
                <div className="Bottom">
                    <NotificationQueue notification={announcements} />  {/* from Notification_Interface NotificationProps */}
                </div>

        </div>
        
    </>

    );
};