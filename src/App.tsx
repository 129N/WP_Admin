

import './App.css'
import { BrowserRouter ,  Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import Participant from './pages/participant';
import Test from './pages/test';
import AdminHome from './pages/AdminHome';
import AudiencePage from './pages/Audience';
import Registration from './pages/Register';
import ProfileLogin from './Authentication/ProfileLogin';
import WPScreen from './PARTICIPANT/TrackingScreen';
import CompetitionScreen from './PARTICIPANT/Competition';
import EventTableLists from './comp/ADMIN/EventTableList';
import EventCreation from './comp/ADMIN/EventCreation';
import EventRegistration from './PARTICIPANT/EventRegistration';
import GPXLoader from './comp/ADMIN/FileLoader';
import TrackMap from './comp/ADMIN/FileLoadOPT';
import Datalist from './comp/ADMIN/admin_DataList';
export const BASE_URL =import.meta.env.VITE_API_BASE_URL;

function App() {

  return (
    <>

  <BrowserRouter>
    <Routes>

       <Route path="/" element={<Home />} />

      <Route path="/participant" element={<Participant />} />
      <Route path="/test" element={<Test />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/audience" element={<AudiencePage />} />
      <Route path="/register" element={<Registration/>} /> 
      <Route path="/login" element={<ProfileLogin/>} /> 
      <Route path="/login" element={<ProfileLogin/>} />
      <Route path="/wpscreen" element={<WPScreen />} />
      <Route path="/competiton" element={<CompetitionScreen />} />
      <Route path="/eventlist" element={<EventTableLists />} />
      <Route path="/eventCreation" element={<EventCreation />} />
      <Route path="/EventRegistration/:id" element={<EventRegistration />} />
      <Route path="/Fileloader" element={<GPXLoader />} />
      <Route path="/MapView" element={<TrackMap />} />
      <Route path="/Datalist" element={<Datalist />} />
    </Routes>
  </BrowserRouter>


    </>
  )
}

export default App
