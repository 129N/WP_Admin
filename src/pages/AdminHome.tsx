



import { useNavigate, useRoutes } from 'react-router-dom';
import '../pages/layouts/Home.css';
import AdminPanel from '../comp/ADMIN/adminPanel';
import Header from "../comp/header";
import { useState } from 'react';


export default function AdminHome() {
    const navigate = useNavigate();
    const [role, setRole] = useState();

    return (

    <div className='AdminContainer'>
        <Header/>
        {/* <AdminPanel/>  */}

        <h1> Admin.tsx </h1>


        <div className='button-group'>

          
                <button className='btn red' onClick={() => navigate("/")}>
                    Back Home
                </button>

                <button className='btn blue' onClick={() => navigate("/eventCreation")}>
                    Create Event
                </button>

                <button className='btn green' onClick={() => navigate("/")}>
                    Manage Event
                </button>

                <button className='btn orange' onClick={() => navigate("/")}>
                    Users fetched lists
                </button>


        </div>




    </div>

    );
};