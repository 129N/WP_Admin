
import axios from 'axios';
import './App.css'
import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter ,  Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home';
import Participant from './pages/participant';
import Test from './pages/test';


export const BASE_URL =import.meta.env.VITE_API_BASE_URL;


function App() {



  return (
    <>
  <BrowserRouter>
    <Routes>
       <Route path="/" element={<Home />} />

      <Route path="/participant" element={<Participant />} />
      <Route path="/test" element={<Test />} />

           {/*<Route path="/admin" element={<AdminPage />} />
        <Route path="/audience" element={<AudiencePage />} />
        <Route path="/wp-screen" element={<WPScreen />} />
        <Route path="/register" element={<RegisterPage />} /> */}
    </Routes>
  </BrowserRouter>


    </>
  )
}

export default App
