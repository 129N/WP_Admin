import React, { useEffect, useState } from "react";
import "./Layout/EventCreation.css";
import Header from "../header";

import { BASE_URL } from "../../App";

const EventCreation: React.FC = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adminID, setAdminID] = useState("");
  const [adminName, setAdminName] = useState("");
  const [role, setRole] = useState("");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0]);
  const [token, setToken] = useState("");

  // Load user info from localStorage (mirrors AsyncStorage)
  useEffect(() => {

    const loadUserInfo = async() => {
        const storedRole = localStorage.getItem("userRole");
        const storedId = localStorage.getItem("userId");
        const storedName = localStorage.getItem("name");
        const storedToken = localStorage.getItem("authToken");

        if (storedRole) setRole(storedRole);
        if (storedId) setAdminID(storedId);
        if (storedName) setAdminName(storedName);
        if (storedToken) setToken(storedToken);
    };
loadUserInfo();

  }, []);

  const handleCreateEvent = async () => {
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    try {

        const response = await fetch(`${BASE_URL}/events`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Accept : 'application/json', 
            Authorization: `Bearer ${token}`, 
            }, 
            body: JSON.stringify({
            event_title: eventTitle,
            description,
            event_date: eventDate.toString(), // formatted
            }),
        });

        const data = await response.json();
            if (response.ok) {
                console.log( "Event has been created", data);
                alert("Event created successfully!");
            } else {
            console.error("Failed:", data);
            alert("Event creation failed.");
        }


      //debug 
      console.log("Sending headers:", {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        });
      alert("Event created successfully!");
    } catch (error: any) {
      console.error("Failed to create event:", error.response?.data || error.message);
      alert("Event creation failed. Check console for details.");
    }
  };

  return (
    <div className="event-container">
        <Header/>
      <h2>Event Creation Page</h2>
      <p className="loggedInText">Logged in as: <b>{adminName || "Unknown"}</b></p>

      <div className="input-group">
        <label>Event Title</label>
        <input
          type="text"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          placeholder="Enter event title"
        />
      </div>

      <div className="input-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain the competition"
        />
      </div>

      <div className="input-group">
        <label>Event Date</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>

      <button className="create-button" onClick={handleCreateEvent}>
        Create Event
      </button>
    </div>
  );
};

export default EventCreation;
