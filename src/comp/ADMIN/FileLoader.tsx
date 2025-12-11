import React, {  useState } from "react";
import { xml2js } from "xml-js";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";

import TrackMap from "./FileLoadOPT";

import "./Layout/FileLoader.css"; // external stylesheet
import { BASE_URL } from "../../App";
import Header from "../header";


type Coordinates = {
  latitude: number;
  longitude: number;
};

type Waypoint = {
  name: string;
  latitude: number;
  longitude: number;
};


type RawTrackPoint  = {
  '@_lat': string;
  '@_lon': string;
  ele?: { '#text': string};
};




const GPXLoader: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null >(null);
  const [trackPoints, setTrackPoints] = useState<RawTrackPoint[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [eventCode, setEventCode] = useState("");

const [fileId, setFileId] = useState<number | null>(null);
const [uploadFileID, setUploadedFileId] = useState();

  const ParseGPX = (gpxText: string)=>{
    // this any removes all undeclared words
    const json: any = xml2js(gpxText, {compact:true});

    const wpt = json?.gpx?.wpt || [];
    const trk = json?.gpx?.trk || [];


 const parsedWaypoints : Waypoint[] = (Array.isArray(wpt) ? wpt : [wpt])
    .filter((w:any) => w && w._attributes) 
    .map((w: any) => ({
        name: w.name?._text || "Unnamed",
        latitude: parseFloat(w._attributes.lat),
        longitude: parseFloat(w._attributes.lon),

    }));

    const extractTrackPints = (trkData: any) : RawTrackPoint[]=>{

        const segments = Array.isArray(trkData) ? trkData.flatMap((t: any) => t.trkseg)
      : trkData.trkseg;

      const trkpts = Array.isArray(segments) ? segments.flatMap((seg : any) => seg.trkpt)
      : segments?.trkpt || [];

       return (Array.isArray(trkpts) ? trkpts : [trkpts])
      .filter((t: any) => t && t._attributes)
      .map((t: any) => ({
        "@_lat": t._attributes.lat,
        "@_lon": t._attributes.lon,
      }));

    };

//   const parsedTrackPoints = (Array.isArray(trkpt) ? trkpt : [trkpt])
//   .filter((t: any) =>  t && t._attributes )
//   .map((t: any) => ({
//       "@_lat": t._attributes.lat,
//       "@_lon": t._attributes.lon,
//   }));


const parsedTrackPoints : RawTrackPoint []= extractTrackPints(trk);
  return { waypoints : parsedWaypoints, trackPoints : parsedTrackPoints };
};


  // --- pick and parse file ---
  const pickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {

      const file = event.target.files?.[0];
      if (!file || !file.name.endsWith(".gpx")) {
        alert("Please select a valid .gpx file");
        return;
      }
    setSelectedFile(file);

    const gpxText = await file.text();
    const {waypoints, trackPoints } =  ParseGPX(gpxText);
            
            setWaypoints(waypoints);
            setTrackPoints(trackPoints);


      if (waypoints.length > 0) {
        setCoordinates({
          latitude: waypoints[0].latitude,
          longitude: waypoints[0].longitude,
        });
        alert("GPX file loaded successfully!");
      } else {
        alert("No waypoints & TrackPoints found in this file.");
      }
    } catch (err) {
      console.error("Error loading GPX:", err);
      alert("Error parsing GPX file.");
    }
  };

// OLD UPLOAD METHOD
  const handleGeneric = async () => {
    console.log("GENERIC VERSION \n Uploading to backend with gpx id");
    try {

        const token =  localStorage.getItem("authToken"); // or token

        if(!selectedFile){
            alert("No GPX file selected for upload.");
            return;
        }

        const formdata = new FormData();
         formdata.append("gpx_file", selectedFile); // ✅ Laravel expects this exact key name
         formdata.append("route_name", "Web Upload " + Date.now()); // optional for UI
          // LARAVEL SIDE  Route::post('/ADM_GPX_UPLOAD', [GpxController::class, 'store']); // reuse the store
          if (fileId) formdata.append("file_id", String(fileId));

        const response = await fetch(`${BASE_URL}/ADM_GPX_UPLOAD`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`,},
        body : formdata,
      });

      const result = await response.json();
      if(response.ok){
        console.log("Upload success!", result);
        setUploadedFileId(result.file_id);
        setFileId(result.file_id);

        alert( `GPX upload complete\nRoute: ${result.route_name ?? "Unnamed"}\nfile_id: ${result.file_id}`);

      }
      else{
        console.log("Upload Error", result);
        alert('File uploaidng error.');
      }

    } catch (err) {

      console.error('Upload error:', err);
      alert('Server did not. Check Laravel logs.');
    }
  };

// NEW UPLOAD METHOD

const handleForEvent = async() =>{
    console.log("EVENT VERSION \n Uploading to backend");
    if (!eventCode.startsWith("EV")) {
   return alert("Event code format invalid (expected EV01)");
}

    try{
        const token =  localStorage.getItem("token");

        if(!selectedFile) return alert("No GPX file selected for upload.");
        if (!eventCode) return alert("Enter event code first");

          const formdata = new FormData();
         formdata.append("gpx_file", selectedFile); 

      const res = await fetch(`${BASE_URL}/events/${eventCode}/gpx-upload`, {
          method: "POST",
          headers: {Authorization: `Bearer ${token}`,},
          body : formdata,
      });
      const result = await res.json();
      if(res.ok){ // OPTIMIZATION add the confirmation alert to show the info of which event it will be added.
          console.log("Upload success!", result);
          alert('File uploaded to backend successfully!');
      }
      else{
          console.log("Upload Error", result);
          alert('File uploaidng error.');
      }
    }
    catch(err){
      console.error('Upload error:', err);
      alert('Server did not. Check Laravel logs.');
    }
};

  const handleDelete = async () => {
          console.log('Delete is in the process');

  try {

//Token for auth:sanctum
// get token from storage
    const token = await localStorage.getItem('token');

    const response = await fetch(`${BASE_URL}/delete`, {
      method: 'POST',
      headers:{
        Authorization: `Bearer ${token}`, // add token
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Data deleted successfully!');
      alert('Data deleted successfully!');
    } else {
      console.error('Delete failed:', result);
      alert('Error deleting data');
    }
  } catch (error) {
    console.error('Request failed:', error);
    alert('Failed to connect to server');
  }
};

// const defaultCenter = { latitude: 46.8333, longitude: 17.75 }; // Tokyo Station as example

  return (
    <div className="gpx-container">
      <Header/>
      <h2 className="title">NEWfileloader</h2>

      <label className="fileLabel">
        Load GPX File
        <input type="file" accept=".gpx" onChange={pickFile} hidden />
      </label>

      <button className="primaryBtn" onClick={handleDelete}>
        Delete Data
      </button>
      

      {coordinates ? (
        <div className="map-wrapper">

        <input className="Inputter"
          placeholder="Event Code (EV01)"
          value={eventCode}
          onChange={(e) => setEventCode(e.target.value)}
        />
        <button  className="EVUploadBtn" onClick={handleForEvent}>Upload to Event</button>
<br />
          <button className="uploadBtn" onClick={handleGeneric}>
            Upload to BE
          </button>
        <div style={{ marginTop: "20px" }}>

      </div>

   <MapContainer center={[coordinates.latitude, coordinates.longitude]}
   zoom={13} style={{ height: "80%", width: "100%" }}>
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Draw Track Line */}
            <Polyline
              positions={trackPoints.map((pt) => [
                parseFloat(pt["@_lat"]),
                parseFloat(pt["@_lon"]),
                            
            ])}
              pathOptions={{ color: "red", weight: 3 }}
            />

            {/* Draw Waypoints */}
            {waypoints.map((wpt, i) => (
              <Marker key={i} position={[wpt.latitude, wpt.longitude]}>
                <Popup>{wpt.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
          <TrackMap />
      )}
    </div>
  );
};

export default GPXLoader;
            {/* <MapContainer
            center={[
                //default is set at Balaton.
                    defaultCenter.latitude,
                    defaultCenter.longitude,
            ]}
            zoom={13}
            preferCanvas={true}
            className="map"
            >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
          />

        </MapContainer> */}

        {/* <LoadScript googleMapsApiKey="">
                <div>React Google Map</div>
        </LoadScript> */}