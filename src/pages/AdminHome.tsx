import { useNavigate } from 'react-router-dom';
import '../pages/layouts/Home.css';
import Header from "../comp/header";

export default function AdminHome() {
    const navigate = useNavigate();

    return (

    <div className='AdminContainer'>
        <Header/>
        {/* <AdminPanel/>  */}

        <h1> AdminHome.tsx </h1>


        <div className='button-group'>

          
                <button className='btn red' onClick={() => navigate("/")}>
                    Back Home
                </button>

                <button className='btn blue' onClick={() => navigate("/eventCreation")}>
                    Create Event
                </button>

                <button className='btn green' onClick={() => navigate("/admin_control")}>
                    Manage Event
                </button>

                <button className='btn orange' onClick={() => navigate("/Datalist")}>
                    Users fetched lists
                </button>

                
                <button className='btn lew' onClick={() => navigate("/GpxFileList")}>
                    Users fetched lists
                </button>


        </div>

    </div>

    );
};