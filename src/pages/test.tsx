import { BASE_URL } from "../App";
import { useState } from "react";
import React from "react";
import "../pages/layouts/test.css";
import Header from "../comp/header";

const Test: React.FC = () => {

    
console.log("Fetching from:", `${BASE_URL}/ping`);

  const [pingResult, setPingResult] = useState<string>("");
  const [statusResult, setStatusResult] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const PING = async()=> {

    console.log("Fetching is in progress");
    try{
        const res = await fetch(`${BASE_URL}/ping`,{
          headers :{ Accept :"application/json"},
        });
  const data = await res.json();
  console.log("Ping success:", data);
    // const contentType = res.headers.get("content-type");

    if (res.ok) {
      setPingResult(JSON.stringify(data, null, 2));
      setSuccess(false);
    }
    else {
        const text = await res.text();
        console.warn("Non-OK response:", text.slice(0, 120));
        setSuccess(false);
        return;
    }

    // if (contentType && contentType.includes("application/json")) {
    //   const data = await res.json();
    //   setPingResult(JSON.stringify(data));
    //   setSuccess(true);
    //   console.log("Ping success", data);
    // } 

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
    <Header/>
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