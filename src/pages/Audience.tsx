import { useNavigate } from 'react-router-dom';
import '../pages/layouts/Home.css';

export default function AudiencePage() {
    const navigate = useNavigate();

    return (

    <div className='AudienceContainer'>
        
        {/* <AdminPanel/>  */}

        <h1> Audience.tsx </h1>

    <div className='button-group'>
            <button className='btn red' onClick={() => navigate("/")}>
                Back Home
            </button>

            <button className='btn green'  onClick={() => navigate("/admin_control")}>
                Watch competiton
            </button>

            <button className='btn orange'  onClick={() => navigate("/")}>
                View History
            </button>

            <button className='btn blue'  onClick={() => navigate("/")}>
                Users fetched lists
            </button>

    </div>

    </div>

    );
};