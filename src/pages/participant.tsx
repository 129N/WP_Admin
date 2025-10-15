import React from "react";
import { useNavigate } from "react-router-dom";
import "./Participant.css";


const Participant: React.FC = () => {

    const navigate = useNavigate();

    return(
 <div className="participant-container">
      <h2 className="participant-header">Participant Dashboard Loaded</h2>

      <div className="button-container">
        <button
          className="btn red"
          onClick={() => navigate("/")}
        >
          Back to Login
        </button>

        <button
          className="btn pink"
          onClick={() => navigate("/register")}
        >
          Registration
        </button>

        <button
          className="btn green"
          onClick={() => navigate("/events")}
        >
          Event Lists
        </button>

        <button
          className="btn blue"
          onClick={() => navigate("/gyroscope")}
        >
          Participate in Competition
        </button>

        <button
          className="btn purple"
          onClick={() => navigate("/newfileloader")}
        >
          New File Load
        </button>

        <button
          className="btn purple"
          onClick={() => navigate("/wpscreen")}
        >
          Waypoint Screen
        </button>
      </div>
    </div>
    );
};

export default Participant;