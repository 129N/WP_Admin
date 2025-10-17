
import { useNavigate } from "react-router-dom";
import Header from "../comp/header";
import '../pages/layouts/Home.css';

const CompetitionScreen: React.FC = ()=>{
        const navigate = useNavigate();
return(

 <div className="participant-container">
    <Header/>
          <h2 className="participant-header">Competition Dashboard</h2>
    <div className="button-group">
        <button
          className="btn red"
          onClick={() => navigate("/")}
        >
          Back to Login
        </button>

        <button
          className="btn pink"
          onClick={() => navigate("/")}
        >
          Memeber List
        </button>

        <button
          className="btn green"
          onClick={() => navigate("/events")}
        >
          Event Detail
        </button>

        <button
          className="btn blue"
          onClick={() => navigate("/gyroscope")}
        >
            Waypoint Screen
        </button>

    </div>
</div>
);
};

export default CompetitionScreen;