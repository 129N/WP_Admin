

import { BASE_URL } from "../App";
import { useState } from "react";
import React from "react";
import '../pages/test.css';

const Test: React.FC = () => {

    
console.log(`The connectionURL is ${BASE_URL}`);


  const [pingResult, setPingResult] = useState<string>("");
  const [statusResult, setStatusResult] = useState<string>("");
    const [success, setSuccess] = useState(false);



  const PING = async()=> {
    try{
        const res = await fetch(`${BASE_URL}/ping`);

        if(res.ok){
      const data = await res.json();
      setPingResult(JSON.stringify(data));
        setSuccess(true);

      console.log(`Ping success ${data}`);
        }

        else{
            setSuccess(false);
        }

    }
    catch(err){
      console.error(err, "The error happned");
    setSuccess(false);
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


  return(
  <div className="Container">
        <h1>Vite + React</h1>
            <h2>{BASE_URL}</h2>

        <h1>Connection test</h1>

        <div className='BTNSection' >
            <button type="button" onClick={PING}>Click Me</button>
            <h3>{pingResult}</h3>
 {  success ? <h3>The fetching is successful</h3>  : <h3> Failed to fetch </h3>}
        </div>

        <div className='BTNSection' >
            <button type="button" onClick={stauts}>Click Me</button>
                <h3>{statusResult}</h3>
 {  success ? <h3>The fetching is successful</h3>  : <h3> Failed to fetch </h3>}
        </div> 

  </div>

  );

};



export default Test;