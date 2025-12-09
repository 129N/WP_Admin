

import { useEffect, useState, type ChangeEvent } from "react";
import Header from "../comp/header";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { MdEmergency } from "react-icons/md";
import { MdOutlinePersonOff } from "react-icons/md";
import getBearing from "../comp/GPXFunction";

// import getDistance from 'geolib/es/getDistance';
import { xml2js } from "xml-js";
import { BASE_URL } from "../App";
import getDistance from "geolib/es/getPreciseDistance";

type Waypoint = {
  name: string;
  latitude: number;
  longitude: number;
}
type TrackPoint = {
  '@_lat': string;
  '@_lon': string;
};

  type Position = {
    latitude: number;
    longitude: number;
  };

const WPScreen: React.FC = () => {
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
    const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [distanceToNext, setDistanceToNext] = useState(0);
    const [bearing, setBearing] = useState(0);
    const [eta, setEta] = useState(0);
    const [speed, setSpeed] = useState(10); 



//parser manually 
const ParseGPX = (gpxText: string)=>{
    // this any removes all undeclared words
    const json: any = xml2js(gpxText, {compact:true});
    const wpt = json?.gpx?.wpt || [];
    const trkpt = json?.gpx?.trk?.trkseg?.trkpt || [];


 const parsedWaypoints : Waypoint[] = (Array.isArray(wpt) ? wpt : [wpt])
    .filter((w:any) => w && w._attributes) 
    .map((w: any) => ({
        name: w.name?._text || "Unnamed",
        latitude: parseFloat(w._attributes.lat),
        longitude: parseFloat(w._attributes.lon),
    }));

  const parsedTrackPoints = (Array.isArray(trkpt) ? trkpt : [trkpt])
  .filter((t: any) =>  t && t._attributes )
  .map((t: any) => ({
      "@_lat": t._attributes.lat,
      "@_lon": t._attributes.lon,
  }));
  return { waypoints : parsedWaypoints, trackPoints : parsedTrackPoints };
};

// GPX file upload handler for web

    const fileload_map = async(event:ChangeEvent<HTMLInputElement>) => {

        try{
            const file = event.target.files?.[0];
        if (!file || !file.name.endsWith(".gpx")) {
            alert("Please select a valid .gpx file");
            return
            }
            //change the file to texts
            const gpxText = await file.text();
            const {waypoints, trackPoints } =  ParseGPX(gpxText);
            
                setWaypoints(waypoints);
                setTrackPoints(trackPoints);


        if (waypoints.length > 0) {
            const firstWaypoint = waypoints[0];
            setCoordinates({ latitude: firstWaypoint.latitude, longitude: firstWaypoint.longitude });
            alert("FE: The waypoint uploaded successfully!");
            } else {
                alert("No waypoints found in the GPX file.");
            }

        }
        catch(map_err){
        console.error('Error picking file:', map_err);
        alert('Error picking the file. Please try again.');
        }
    };


    const BEPass = async() => {
  try {
      console.log("Preparing fetching...");
      const response = await fetch(`${BASE_URL}/waypoints`);
      const result = await response.json();
      console.log("Upload success:", result);
      alert("Fetching is success!");
    } catch (jsonErr) {
      console.error("Upload error:", jsonErr);
      alert("Server did not return valid JSON. Check Laravel logs.");
    }
  };

  const calculateBearingToNextWaypoint = () => {
    if (currentPosition && waypoints.length > 0) {
      const nextWaypoint = waypoints[1];
      if (nextWaypoint) {
        const bearing = getBearing(
          currentPosition.latitude,
          currentPosition.longitude,
          nextWaypoint.latitude,
          nextWaypoint.longitude
        );
        return bearing;
      }
    }
    return 0;
    };

      useEffect( ()=>{
      const bearing = calculateBearingToNextWaypoint();
      console.log('Bearing:', bearing);
  }, [currentPosition, waypoints] );

    const updatePosition = () => {
      // Simulate current position (e.g., GPS or mock data)
      
      setCurrentPosition({
        latitude: 46.928,
        longitude: 17.867,
      });
    };
  
    useEffect(() => {
      updatePosition();
    }, []);

    useEffect( () => { 
   
    if (currentPosition && waypoints.length > 1) {

    console.log('Current Position:', currentPosition);
    console.log('Next WP:', waypoints[1]);

      const nextWaypoint = waypoints[1]; // Assume the next waypoint is the second one
      if (nextWaypoint) {
        const bearingToNextWaypoint = getBearing(
          currentPosition.latitude,
          currentPosition.longitude,
          nextWaypoint.latitude,
          nextWaypoint.longitude
        );
        setBearing(bearingToNextWaypoint);

        const distance = getDistance(
          { latitude: currentPosition.latitude, longitude: currentPosition.longitude },
          { latitude: nextWaypoint.latitude, longitude: nextWaypoint.longitude }
        );
        setDistanceToNext(distance / 1000); // Convert meters to kilometers

        const etaInHours = distance / 1000 / speed; // ETA in hours
        setEta(etaInHours * 60); // Convert to minutes
      }
    }
  }, [currentPosition, waypoints, speed]);


  
    return(
 <div className="">
    <Header/>
      <h2>Direction to Next WP:</h2>

      {/* GPX Upload */}
      <input type="file" accept=".gpx" onChange={fileload_map} style={{ marginBottom: 10 }} />

      <button onClick={BEPass}>
        Fetch the route
      </button>

      {/* Display Data */}
      <p>Bearing: {bearing.toFixed(1)}°</p>
      <p>Distance: {distanceToNext.toFixed(2)} km</p>
      <p>ETA: {eta.toFixed(1)} minutes</p>

      {bearing !== null && (
        <div >
          <FaArrowAltCircleUp 
            size={40}
            color="blue"
            style={{ transform: `rotate(${bearing}deg)` }}
          />
          <p>Bearing: {bearing.toFixed(1)}°</p>
          <p style={{ textAlign: "center" }}>Direction</p>
        </div>
      )}

      <button >
        <MdEmergency size={20} color="white" />
        <span >HELP</span>
      </button>

      <button >
        <MdOutlinePersonOff size={20} color="white" />
        <span >Surrender</span>
      </button>
    </div>
    );
}


export default WPScreen;

