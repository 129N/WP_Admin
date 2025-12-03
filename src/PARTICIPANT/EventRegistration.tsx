import type React from "react";
import "./Layout/EventRegistration.css";
import { useEffect, useState } from "react";
import { BASE_URL } from "../App";
import Header from "../comp/header";

type Event = {
  id: number;
  event_title: string;
  description: string;
  event_date: string;
  creator_name: string;
  event_code: string;
};

 const EventRegistration : React.FC = () => {

  const [mode, setMode] = useState<'single' | 'team'>('single');
  const [eventId, setEventId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([{ name: '', email: '', role: '' }]);
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [eventCode, setEventCode] = useState("");

  //loadl user info const 
  const [role, setRole] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [userId, setUserId] = useState('');

  //oarsed from EventCreeation.tsx 
  const [loadCreation, setLoadCreation] = useState<Event[]>([]);


  useEffect(() => {
    const loadUserInfo = async() => {
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('userEmail');
        const role = localStorage.getItem('userRole');
        const Id = localStorage.getItem('userId');
        const eventTitle = localStorage.getItem('event_title');
        const event_code = localStorage.getItem('event_code');
        if (name) setLeaderName(name);
        if(email) setLeaderEmail(email);
        if(role) setRole(role);
        if(eventTitle) setEventTitle(eventTitle);
        if(Id) setUserId(Id);
        if (eventId) setEventId(eventId);
        if (event_code) setEventCode(event_code);

    };
loadUserInfo();
  }, []);

  //function to/add remove 
const addMember = () => setMembers([...members, {name: '', email : '', role : '' }]);

const removemember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
};


const handleRegsiteration = async () => {

    try{
      console.log(`Debug check: UserId ${userId}, ${eventCode}`);
        const token = localStorage.getItem('authToken');
        if (!token) return alert('Please log in first');

          if (!eventCode) return alert('Please select or enter an event first');

        if(mode === 'single'){
            //POST/event_registrations

            //Controller name is EventController in php 
           const res =  await fetch(`${BASE_URL}/events/${eventCode}/register`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                }, 
                body: JSON.stringify({
                    //event_id: eventId,
                    user_id: parseInt(userId, 10),
                    group_name: 'solo',
                }),
            });

            
            const data = await res.json();
            if(res.ok){

             alert(`${name} has been registered`);
            }else{
                console.error("REG Failed:", data);
                alert("Registration failed.");
            }

        }
        // if the registration is multiple
        else{

            const team_Res = await fetch
            (`${BASE_URL}/teams`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                }, 
                body:JSON.stringify({
                    event_id: eventId,
                    team_name: teamName,
                    members: members.map((m) => ({
                        member_name : m.name,
                        member_email:m.email,
                        role: m.role,
                        })),
                    }),
                }
            );

            const data = await team_Res.json();
            if(team_Res.ok){

               const eventNumericId = data.registration.event_id;
                alert(
                  `${name} has been registered!\n\n` +
                  `Event Code: ${eventCode}\n` +
                  `Event ID: ${eventNumericId}`
                );
            }else{
                console.error("REG Failed:", data);
                alert("Registration failed.");
            }
        };

    }
    catch(err){
        console.error("Error ", err);
    }


};

    return (
    <div className="container">
        <Header/>
      <h2 className="title">Event Registration (Web)</h2>

      {/* Mode Toggle */}
      <div className="toggleContainer">
        <button
          className={`toggleBtn ${mode === 'single' ? 'active' : ''}`}
          onClick={() => setMode('single')}
        >
          Single
        </button>
        <button
          className={`toggleBtn ${mode === 'team' ? 'active' : ''}`}
          onClick={() => setMode('team')}
        >
          Team
        </button>
      </div>

   {/* Input Fields */}

      <div className="eventDetails">
        <p>You are logged in as: <b>{leaderName}</b> ({leaderEmail})</p>
        <p>Event: <b>{eventTitle || 'N/A'}</b></p>
      </div>

        <label>Event ID</label>
      <input
        type="text"
        placeholder="Enter event ID"
        value={eventCode}
        onChange={(e) => setEventCode(e.target.value)}
      />
        <label>Leader Name</label>
      <input type="text" value={leaderName} disabled />

        <label>Leader Email</label>
      <input type="text" value={leaderEmail} disabled />

      {mode === 'team' && (
        <>
          <label>Team Name</label>
    <input
      type="text"
      placeholder="Enter team name"
      value={teamName}
      onChange={(e) => setTeamName(e.target.value)}
    />

    <h3 className="memberHeader">Team Members</h3>

    {members.map((member, index) => (
      <div key={index} className="memberBox">
        <label>Member {index + 1} Name</label>
        <input
          type="text"
          placeholder="Enter name"
          value={member.name}
          onChange={(e) => {
            const updated = [...members];
            updated[index].name = e.target.value;
            setMembers(updated);
          }}
        />

        <label>Member {index + 1} Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={member.email}
          onChange={(e) => {
            const updated = [...members];
            updated[index].email = e.target.value;
            setMembers(updated);
          }}
        />

        <label>Role (optional)</label>
        <input
          type="text"
          placeholder="Runner, Support..."
          value={member.role}
          onChange={(e) => {
            const updated = [...members];
            updated[index].role = e.target.value;
            setMembers(updated);
          }}
        />

        <button className="removeBtn" onClick={() => removemember(index)}>
          Remove
        </button>
      </div>
    ))}

            <button className="addBtn" onClick={addMember}>
            + Add Member
            </button>
        </>
      )}

      <button className="submitBtn" onClick={handleRegsiteration}>
        Submit
      </button>
    </div>
 
    )

}

export default EventRegistration;