
import axios from 'axios';
import './App.css'
import React, { useState }  from 'react';

export const BASE_URL =import.meta.env.VITE_API_BASE_URL;


type APIs = {
pingResult : string,
statusResult: string,

};

function App() {


console.log(`The connectionURL is ${BASE_URL}`);


  const [pingResult, setPingResult] = useState<string>("");
  const [statusResult, setStatusResult] = useState<string>("");

  const PING = async()=> {
    try{
        const res = await fetch(`${BASE_URL}/ping`);
      const data = await res.json();
      setPingResult(JSON.stringify(data, null, 2));

      console.log(`Ping success ${data}`);
    }
    catch(err){
      console.error(err, "The error happned");
    }
  };

  const stauts = async() => {
    try{
        const res = await fetch(`${BASE_URL}/status`);
      const data = await res.json();
      setStatusResult(JSON.stringify(data, null, 2));

      console.log(`Ping success ${data}`);
    }
    catch(err){
      console.error(err, "The error happned");
    }
  };





  return (
    <>

      <h1>Vite + React</h1>
      <h2>{BASE_URL}</h2>

    <h1>Connection test</h1>

    <div className='BTNSection' >
      <button type="button" onClick={PING}>Click Me</button>
      <pre> {pingResult}</pre> 
    </div>
    
    <div className='BTNSection' >
      <button type="button" onClick={stauts}>Click Me</button>
      <pre> {statusResult}</pre> 
    </div>


    </>
  )
}

export default App
