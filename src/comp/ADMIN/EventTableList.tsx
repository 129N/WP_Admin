import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../App";
import Header from "../header";
import { useParams } from "react-router-dom";
import "../ADMIN/Layout/EventTableLists.css";
type Event = {
  id: number;
  event_title: string;
  description: string;
  event_date: string;
  creator_name: string;
  event_code: string;
};


 const  EventTableLists : React.FC = () => {

    const [events, setEvents] = useState<Event[]>([]);
    const [userRole, setUserRole] = useState<string|null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


  useEffect(() => {
  const fetchRole = async () => {
    const role = await localStorage.getItem("userRole");
    setUserRole(role);
  };
  fetchRole();
}, []);


const handleFetchEvents = async() => {

    setLoading(true);

    const token = await localStorage.getItem('authToken');

    try{
        const response = await fetch(`${BASE_URL}/events`, {
        headers:{
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        });

        const data = await response.json();
        if(response.ok){
            setEvents(data);
        }
        else{
            console.warn('Failed to fetch:', data);
        }
    }
    catch(error){
        console.error("Reload Error ", error);
    } finally {
      setLoading(false);
    }

};

const handleDeleteEvent = async(id:number, event_title : string ) => {
        const confirm = window.confirm(`Delete "${event_title}"?`);
    if (!confirm) return;

    const token = await localStorage.getItem('authToken');

    try{
        const response = await fetch(`${BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        });

        const data = await response.json();
        if(response.ok){
            setEvents(data);
            window.alert('Event deleted successfully');
            handleFetchEvents();
        }
        else{
            console.warn('Failed to fetch:', data);
        }
    }
    catch(error){
        console.error(error);
        window.alert("Failed to delete event.");
    }
};

  useEffect(() => {
    handleFetchEvents();
  }, []);


return (
  <main className="eventPage">
    <Header />

    <section className="eventHeader">
      <h2>Event List</h2>

      <button
        className="btn btn--primary"
        onClick={handleFetchEvents}
        disabled={loading}
      >
        {loading ? "Loading…" : "Reload"}
      </button>
    </section>

    {events.length > 0 ? (
      <section className="eventList">
        {events.map((event) => (
          <article key={event.id} className="eventCard">
            <div className="eventAccent" />

            <div className="eventMeta">
              <h3 className="eventTitle">{event.event_title}</h3>
              <p className="eventDesc">{event.description}</p>

              <div className="eventBadges">
                <span className="badge badge--date">
                  📅 {new Date(event.event_date).toLocaleString()}
                </span>
                <span className="badge badge--creator">
                  👤 {event.creator_name}
                </span>
                <span className="badge badge--code">
                  🔑 {event.event_code}
                </span>
              </div>
            </div>

            <div className="eventActions">
              <button
                className="btn btn--view"
                onClick={() => navigate(`/EventRegistration/${event.id}`)}
              >
                View
              </button>

              {userRole === "admin" && (
                <button
                  className="btn btn--danger"
                  onClick={() =>
                    handleDeleteEvent(event.id, event.event_title)
                  }
                >
                  Delete
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    ) : (
      <p className="emptyState">No events available.</p>
    )}
  </main>
);


}

export default EventTableLists