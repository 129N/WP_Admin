import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../comp/header";

type QuickLink = {
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const username = "roles"; // later: from auth context/store

  const links: QuickLink[] = [
    { title: "Participants", description: "View & manage participant list", route: "/participant", icon: "🧍" },
    { title: "Event Organizer", description: "Create, edit, and manage events", route: "/admin", icon: "📅" },
    { title: "Audience", description: "Spectator view & public status", route: "/audience", icon: "👀" },
    { title: "Registration", description: "Register users and assign roles", route: "/register", icon: "📝" },
    { title: "Waypoints", description: "Waypoint screen and navigation tools", route: "/wpscreen", icon: "📍" },
    { title: "GPX Upload", description: "Upload route files and verify parsing", route: "/Fileloader", icon: "🗺️" },
    { title: "Test", description: "Sandbox utilities & dev tools", route: "/test", icon: "🧪" },
    { title: "Login", description: "Switch account / role", route: "/login", icon: "🔐" },
  ];

  return (
    <div className="homePage">
      {/* Top bar */}
      <div className="topBar">
        <div className="topBarLeft">
          <div className="brandDot brandDot--home" />
          <div className="brandText">
            <div className="brandTitle">Waypoint Tracker</div>
            <div className="brandSub">Home Panel</div>
          </div>
        </div>

        <div className="topBarRight">
          <div className="statusChip ok">● API Online</div>
          <div className="statusChip warn">● GPS Idle</div>
          <div className="userChip">
            <div className="avatar">{username.slice(0, 1).toUpperCase()}</div>
            <div className="userMeta">
              <div className="userName">{username}</div>
              <div className="userRole">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Your existing component if you still want it */}
      <Header />

      {/* Content */}
      <main className="content">
        <div className="hero hero--normal">
          <h2>Welcome back, {username}</h2>
          <p className="subtitle">Manage events, monitor participants, and oversee live tracking.</p>

          <div className="primaryActions">
            <button className="primaryBtn" onClick={() => navigate("/admin")}>+ Create / Manage Event</button>
            <button className="ghostBtn" onClick={() => navigate("/Fileloader")}>Upload GPX</button>
          </div>
        </div>
{/* MAP STYLE RENDERING */}
        <section className="grid">
          {links.map((l) => (
            <button key={l.route} className="card" onClick={() => navigate(l.route)}>
              <div className="cardIcon">{l.icon}</div>
              <div className="cardBody">
                <div className="cardTitle">{l.title}</div>
                <div className="cardDesc">{l.description}</div>
              </div>
              <div className="cardArrow">→</div>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;

