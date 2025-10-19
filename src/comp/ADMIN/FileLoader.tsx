import React, { useState } from "react";
import { xml2js } from "xml-js";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";


import "./Layout/FileLoader.css"; // external stylesheet
import { BASE_URL } from "../../App";

//API provider 
import { GoogleMap, LoadScript, } from '@react-google-maps/api';
// import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';


type Coordinates = {
  latitude: number;
  longitude: number;
};

type Waypoint = {
  name: string;
  latitude: number;
  longitude: number;
};

type TrackPoint = {
  latitude: number;
  longitude: number;
};

// type TrackPoint = {
//   '@_lat': string;
//   '@_lon': string;
// };

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

//   const handleDelete = () => {
//     setWaypoints([]);
//     setTrackPoints([]);
//     setCoordinates(null);
//   };

  const BEPass = async () => {
    console.log("Uploading to backend");
    try {

        const token = await localStorage.getItem("token");

        if(!selectedFile){
            alert("No GPX file selected for upload.");
            return;
        }

        const formdata = new FormData();
         formdata.append("gpx_file", selectedFile); // ✅ Laravel expects this exact key name

        const response = await fetch(`${BASE_URL}/gpx-upload`, {
        method: "POST",
        headers: { 
             Authorization: `Bearer ${token}`,
        },
        body : formdata,
      });

      const result = await response.json();
      if(response.ok){
        console.log("Upload success!", result);
        alert('File uploaded to backend successfully!');
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

const defaultCenter = { latitude: 46.8333, longitude: 17.75 }; // Tokyo Station as example

  return (
    <div className="gpx-container">
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
          <button className="uploadBtn" onClick={BEPass}>
            Upload to BE
          </button>

          <MapContainer
            className="map"
            center={[coordinates.latitude, coordinates.longitude]}
            zoom={13}
            scrollWheelZoom={false}
          >
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
        <div className="map-wrapper">
            <MapContainer
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

        </MapContainer>

        {/* <LoadScript googleMapsApiKey="">
                <div>React Google Map</div>
        </LoadScript> */}

        
      </div>

        
      )}
    </div>
  );
};

export default GPXLoader;
