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

interface DeleteGpxResponse {
  message: string;
}

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
  event_id: number;
  event_code: string;
  participant_id: number;
  type: "emergency" | "surrender" | "waypoint" | "offline" | "system";
  message: string;
  timestamp: string;
  created_at: string;
  updated_at: string;
  participant?: {
    id: number;
    name: string;
    email?: string;
  };
}

export interface LiveLocation {
  user_id: number;
  lat: number;
  lon: number;
  speed?: number;
  heading?: number;
}

export default function AdminPanel() {

// EventId from registered Event
    const [selectedEvent, setSelectedEvent] = useState<null | Event>(null);
    const [participants, setParticipants] = useState<participants_Interface[]>([]);
    const [event_code, setEventCode] = useState(''); 
    const [token, setToken] = useState("");

    const [loading, setLoading] = useState(false);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
    const [trackpoints, setTrackpoints] = useState<TrackPoint[]>([]);

//Notification 
  const [locations, setLocations] = useState();
  const [eventId, setEventId] = useState(''); 
  const [notifications, setNotifications] = useState<Notification_Interface[]> ([]);

//Location
  const [livelocations, setLiveLocations] = useState<LiveLocation[]>([]);

//Page change
const role = localStorage.getItem("userRole");
const isAdmin = role === "admin";

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
// THIS IS THE OLD VERSION UPDATE
//Notification
// useEffect(() =>{
//       if(!eventId) return; 

//   const interval = setInterval(() => {
//   fetchNotifications(event_code);
//   }, 3000);
// return () => clearInterval(interval);
// }, [eventId]);


useEffect(() => {
   if (!event_code) return;

   fetchParticipants(event_code);
   fetchNotifications(event_code);
   fetchRouteData(event_code);
   fetchLiveLocation(event_code);

   const interval = setInterval(() => {
      fetchParticipants(event_code);
      fetchNotifications(event_code);
      fetchRouteData(event_code);
      fetchLiveLocation(event_code);
   }, 3000);

   return () => clearInterval(interval);
}, [event_code]);


//----------------------
// Event code typing  
//----------------------
const handleSaveEventId = async() => {
// check whether the eventId is real or not.  
    if(!event_code ){
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
    await fetchNotifications(event_code);
    alert("Event successfully loaded!");
    }catch(err){
        console.error(err);
        alert("Catch Error:Invalid Event ID. Please try again.");
    }

  };

//----------------------
// Fetch the event participants 
//----------------------
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

//----------------------
// check the validity 
//----------------------
const fetchRouteData = async (event_code: string) => {
    try {

      const wRes = await fetch(`${BASE_URL}/events/${event_code}/waypoints`); //Route::get('/events/{event_code}/waypoints', [WPReactController::class, 'getEventWaypoints']); 
      const tRes = await fetch(`${BASE_URL}/events/${event_code}/trackpoints`); //        Route::get('/events/{event_code}/trackpoints', [WPReactController::class, 'getEventTrackpoints']); 

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


//----------------------
// EVENT DELETE. from Route::delete('/events/{event_code}/gpx', [WPReactController::class, 'deleteEventGpx']);
//----------------------
const handleDeleteGpx = async() =>{
  if(!event_code){
    alert("No event selected.");
    return;
  }

 const confirmDelete = window.confirm(
    `Are you sure you want to DELETE all GPX data for Event ${event_code}?\n` +
    `This action cannot be undone.`
  );

  if (!confirmDelete) return;

  try{
    const token = localStorage.getItem("authToken");
    if (!token) return alert("You must be logged in as admin.");

    const res = await fetch(`${BASE_URL}/events/${event_code}/gpx`,{
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if(!res.ok)throw new Error("Failed to delete GPX");

  // The message comes from deleteEventGpx Controller return 
    const data: DeleteGpxResponse = await res.json();
     alert(data.message);

    // Clear map
    setWaypoints([]);
    setTrackpoints([]);

    console.log("GPX deleted: ", data);

  }catch(err){
    console.error("GPX DELETE ERROR:", err);
    alert("Error deleting GPX. Check console.");
  }
};

//----------------------
// NOTIFICAION
//----------------------
const fetchNotifications = async(event_code: string) =>{
    try{
        const res = await fetch(`${BASE_URL}/events/${event_code}/notifications`);
            if(!res.ok) {throw new Error("Failed to fetch notifications")};
        const data = await res.json();
        setLocations(data);
        setNotifications(data);
    } 
    catch(error){
        console.error("notifications error:", error);
    }
};

//----------------------
// LOCATION
//----------------------

const fetchLiveLocation = async(event_code:string) => {
  try{
    const res = await fetch(`${BASE_URL}/events/${event_code}/locations`);
    if(!res.ok) throw new Error("Failed to fetch locations");

    const data = await res.json();
    setLiveLocations(data);
  }
  catch (err) {
    console.error("Live location error:", err);
  }
};




//----------------------
// RENDERING
//---------------------- 
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
{/* Event Load Button */}
        <button onClick={handleSaveEventId}>Load Event</button>

{/* Event Delete Button */}
        <button onClick={handleDeleteGpx} style={{ backgroundColor: "red", color: "white" }}>
          Delete GPX for this Event
        </button>

      </div>

        <div className="admin-map-layout">
{/* 1. Map (everyone sees) */}
          <div className="Center">
              <AdminMapView waypoints = {waypoints} trackpoints = {trackpoints} livelocations = {livelocations}/> 
          </div>
{/* 2. Participant list (everyone sees) */}
          <div className="Left">
            <ParticipantStack participants={participants}/>  {/* from participants_Interface NotificationProps */}
          </div>
{/* 3. Notifications (Admins sees) */}         
          { isAdmin && (<div className="Bottom">
                <NotificationQueue notification={notifications} />  {/* from Notification_Interface NotificationProps */}
          </div>)}

        </div>
        
    </>

    );
};