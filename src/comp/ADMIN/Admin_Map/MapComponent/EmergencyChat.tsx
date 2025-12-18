import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import Echo from "laravel-echo";
import "../Layout/EmergencyChat.css";
import { BASE_URL } from "../../../../App";
import Pusher from "pusher-js";

(window as any).Pusher = Pusher;

interface ChatMsg {
    from: number;
    message: string;
    time: string;
    lat?: number;
    lon?: number;
}

export default function EmergencyChat() {

  const { event_code, participant_id } = useParams<{
  event_code: string;
  participant_id: string;
}>();


    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if(!event_code || !participant_id) return;
        console.log("event_code:", event_code);
        console.log("participant_id:", participant_id);

        const CH =`emergency.event.${event_code}.participant.${participant_id}`;

        const echo = new Echo({
            broadcaster: "reverb",
            key: "local",
            wsHost: "localhost",
            wsPort: 8080,
            forceTLS: false,
            encrypted: false,
                        
            authEndpoint: `${BASE_URL}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                }, 
        }  });

        echo.private(CH).listen(".emergency.message", (e:any) => {
            console.log("🔥 RECEIVED:", e);

            const p = e.payload; // REAL DATA IS HERE

                setMessages(prev => [...prev, {
                    from: p.from,
                    message: p.message,
                    time: p.time,
                    lat: p.lat,
                    lon: p.lon,
                }]);
            });

        return () => {
            echo.leave(CH);
        };
       
    }, [event_code, participant_id]);


    const sendMessage = async () => {

        const trimmed = input.trim();
        if(!trimmed) return;

        console.log(trimmed);

        const token = localStorage.getItem("authToken");

        const res = await fetch(`${BASE_URL}/event/${event_code}/emergency/${participant_id}/message`, 
            {
                method: "POST", 
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message: input}),
            });

        if(!res.ok) {throw new Error("Failed to fetch")};
            setInput("");
    };

//----------------------
// RENDERING ZONE    
//----------------------
return (
  <div className="emergency-chat-container">
    <h2 className="emergency-chat-title">🚨 Emergency Chat</h2>

    <div className="emergency-chat-messages">
      {messages.length === 0 && (
        <div className="emergency-chat-empty">
          No messages yet.
        </div>
      )}

      {messages.map((m, i) => (
        <div key={i} className="emergency-chat-message">
          <span className="emergency-chat-user">
            User {m.from}
          </span>
          <span className="emergency-chat-text">
            {m.message}
          </span>
          <span className="emergency-chat-time">
            {new Date(m.time).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>

    <div className="emergency-chat-input">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type response..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  </div>
);

};