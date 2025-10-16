


import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/layouts/Home.css';
import AdminPanel from '../comp/ADMIN/adminPanel';

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

            <button className='btn green'  onClick={() => navigate("/")}>
                View map
            </button>

            <button className='btn orange'  onClick={() => navigate("/")}>
                Get Digit code
            </button>

            <button className='btn blue'  onClick={() => navigate("/")}>
                Users fetched lists
            </button>

    </div>





    </div>

    );
};