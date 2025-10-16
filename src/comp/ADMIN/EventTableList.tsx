import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../App";

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
            Accept: 'application/json',
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
        console.error("Error ", error);
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
    <main className="event-container">
      <h2 className="header">Fetched Event List</h2>

      <button className="fetch-button" onClick={handleFetchEvents}>
        {loading ? "Loading..." : "Reload"}
      </button>

      {events.length > 0 ? (
        <div className="event-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-info">
                <h3>{event.event_title}</h3>
                <p>{event.description}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(event.event_date).toLocaleString()}
                </p>
                <p>
                  <strong>Created by:</strong> {event.creator_name}
                </p>
                <p>
                  <strong>Event Code:</strong> {event.event_code}
                </p>
              </div>

              <div className="button-row">
                <button
                  className="view-button"
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  View
                </button>

                {userRole === "admin" && (
                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteEvent(event.id, event.event_title)
                    }
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-text">No events yet.</p>
      )}
    </main>
  );
}

export default EventTableLists