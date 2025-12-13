import React from "react";
import { useNavigate } from "react-router-dom";
import '../pages/layouts/Home.css';
import Header from "../comp/header";



type Action = {
  title: string;
  description: string;
  route: string;
  icon: string;
};

const Participant: React.FC = () => {
  const navigate = useNavigate();

  const actions: Action[] = [
    {
      title: "Event List",
      description: "Browse available competitions and events",
      route: "/eventlist",
      icon: "📋",
    },
    {
      title: "Participate",
      description: "Join and track your active competition",
      route: "/competiton",
      icon: "🏃",
    },
    {
      title: "Waypoint Screen",
      description: "Navigation & waypoint guidance",
      route: "/wpscreen",
      icon: "📍",
    },
    {
      title: "Registration",
      description: "Register or update your participant info",
      route: "/register",
      icon: "📝",
    },
    {
      title: "Upload File",
      description: "Upload GPX or competition files",
      route: "/Fileloader",
      icon: "🗺️",
    },
    {
      title: "Experimental",
      description: "Temporary or test-only features",
      route: "/EventRegistration",
      icon: "🧪",
    },
  ];

  return (
    <div className="homePage">
      {/* Top bar */}
      <div className="topBar">
        <div className="topBarLeft">
          <div className="brandDot brandDot--participant" />
          <div className="brandText">
            <div className="brandTitle">Waypoint Tracker</div>
            <div className="brandSub">Participant Dashboard</div>
          </div>
        </div>

        <div className="topBarRight">
          <div className="statusChip ok">● Ready</div>
          <button className="ghostBtn" onClick={() => navigate("/")}>
            Logout
          </button>
        </div>
      </div>

      <Header />

      {/* Content */}
      <main className="content">
        <div className="hero hero--participant">
          <h2>Participant Dashboard Loaded</h2>
          <p className="subtitle">
            Join events, follow waypoints, and track your progress in real time.
          </p>
        </div>

        <section className="grid">
          {actions.map((a) => (
            <button
              key={a.route}
              className="card"
              onClick={() => navigate(a.route)}
            >
              <div className="cardIcon">{a.icon}</div>
              <div className="cardBody">
                <div className="cardTitle">{a.title}</div>
                <div className="cardDesc">{a.description}</div>
              </div>
              <div className="cardArrow">→</div>
            </button>
          ))}
        </section>

        {/* Destructive / secondary action */}
        <div style={{ marginTop: "18px" }}>
          <button className="dangerBtn" onClick={() => navigate("/")}>
            ⟵ Back to Login
          </button>
        </div>
      </main>
    </div>
  );
};

export default Participant;
