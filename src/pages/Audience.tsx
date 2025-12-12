import { useNavigate } from 'react-router-dom';
import '../pages/layouts/Home.css';
import Header from '../comp/header';

export default function AudiencePage() {
    const navigate = useNavigate();

    return (

    <div className='AudienceContainer'>
        
        {/* <AdminPanel/>  */}
<Header/>
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

    </div>

    </div>

    );
};