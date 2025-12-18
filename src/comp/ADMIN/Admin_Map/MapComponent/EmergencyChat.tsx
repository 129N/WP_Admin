import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { BASE_URL } from "../../../../App";

interface ChatMsg {
    from: number;
    message: string;
    time: string;
    lat?: number;
    lon?: number;
}

export default function emergencyChat() {

    const location = useLocation();
    const { event_code, participant_id } = location.state || {};
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [input, setInput] = useState("");


    useEffect(() => {
        if(!event_code || !participant_id) return;

        const channleName =  `private-emergency.event.${event_code}.participant.${participant_id}`;

        const echo = new Echo({
            broadcaster: "pusher",
            key: "local",
            wsHost: "localhost",
            wsPort: 8080, // Reverb default
            wssPort: 8080,
            forceTLS: false,
            encrypted: false,
            disableStats: true,
            enabledTransports: ["ws", "wss"],
                client: new Pusher("local", {
                    cluster: "mt1",
                    wsHost: "localhost",
                    wsPort: 8080,
                    forceTLS: false,
                }), 
        });

        echo.private(channleName).listen(".emergency.message", (e:any) => {
            setMessages((prev) => [...prev, e.payload]);
        });

        return () => {
            echo.leave(channleName);
        };
       
    }, [event_code, participant_id]);


    const sendMessage = async () => {
        const token = localStorage.getItem("authToken");

        const res = await fetch(`${BASE_URL}/${event_code}/emergency/${participant_id}/message`, 
            {
                method: "POST", 
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({messages: input}),
            });

        if(!res.ok) {throw new Error("Failed to fetch")};

            setInput("");
    };

//----------------------
// RENDERING ZONE    
//----------------------
    return(
    <div>
        <h2>🚨 Emergency Chat</h2>

        <div style={{ height: 300, overflowY: "auto" }}>
            {messages.map((m, i) => (
            <div key={i}>
                <strong>User {m.from}</strong>: {m.message}
            </div>
            ))}
        </div>

        <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type response..."
        />
        <button onClick={sendMessage}>Send</button>
    </div>
    );
};