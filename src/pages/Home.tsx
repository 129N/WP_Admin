import React from "react";
import { useNavigate } from "react-router-dom";
import '../pages/layouts/Home.css';
import Header from "../comp/header";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";


const Home: React.FC = () => {
  const navigate = useNavigate();
    var username = "roles";
  return (
    <>
      <div className="header">Waypoint Tracker Admin Panel</div>
        <Header/>
      <div className="home-container">
        <h2>Welcome Back, {username}</h2>
        <p className="subtitle">
          Manage events, monitor participants, and oversee live tracking.
        </p>

        <div className="button-group">
          <button className="btn blue" onClick={() => navigate("/participant")}>
            Participant
          </button>
          <button className="btn green" onClick={() => navigate("/admin")}>
            Event Organizer
          </button>
          <button className="btn purple" onClick={() => navigate("/audience")}>
            Audience
          </button>
          <button className="btn orange" onClick={() => navigate("/register")}>
            Registration
          </button>

          <button className="btn worm" onClick={() => navigate("/login")}>
            Login
          </button>


          <button className="btn pink" onClick={() => navigate("/wpscreen")}>
            WP Button
          </button>
            <button className="btn yellow" onClick={() => navigate("/test")}>
            Test
          </button>
          <button className="btn pink" onClick={() => navigate("/Fileloader")}>
           File Loading
          </button>

        </div>
      </div>
    </>
  );
};

export default Home;
