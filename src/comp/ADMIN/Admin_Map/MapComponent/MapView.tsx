
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
// import type { LatLngBounds, LatLngTuple } from "leaflet";
import"../Layout/MapView.css";
import type { Waypoint, TrackPoint, LiveLocation } from "../adminPanel";
import L from "leaflet";

export interface RouteProps {
    // waypoints: { waypoints : Waypoint[]} | null ;
    //  trackpoints: {trackpoints : TrackPoint[] }| null;
  waypoints: Waypoint[] | null;
  trackpoints: TrackPoint[] | null;
  livelocations: LiveLocation[] | null;
}


export default function AdminMapView({waypoints, trackpoints, livelocations}: RouteProps) {
   // const hasRoute = waypoints && waypoints.length > 0 && trackpoints && trackpoints.length > 0;


const participantIcon = new L.Icon({
  iconUrl: "/participant.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const wpts = waypoints|| [];
  const trks = trackpoints || [];
  const hasRoute = wpts.length > 0 && trks.length > 0;
  
   console.log("AdminMapView props →", { waypoints, trackpoints });
  console.log("AdminMapView lengths →", { wpts: wpts.length, trks: trks.length, hasRoute });

//----------------------
// RENDERING ZONE    
//----------------------
return(
    <div className="map-wrapper">
            <MapContainer center={[46.83, 17.7]} zoom={13} scrollWheelZoom={true}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* When route exists */}
                {hasRoute && (
                    <>
                    {/* Waypoints */}
                        {waypoints!.map((wp: any, idx: number) => (
                            <Marker key={idx} position={[wp.lat, wp.lon]} />
                        ))}
                    {/* Route PolyLine */}
                        <Polyline
                            positions={trackpoints!.map((tp:any) => [tp.lat, tp.lon])}
                            pathOptions={{ color: "red", weight: 3 }}
                        />
                    </>
                )}

                {/* Live participant locations */}
                {livelocations && livelocations.map((loc: any) => (
                <Marker
                    key={loc.user_id}
                    position={[loc.lat, loc.lon]}
                    icon={participantIcon}
                />
                ))}


                {/* When no route data */}
                {!hasRoute && (
                    <Marker position={[46.83, 17.7]} />
                )}
            </MapContainer>
        </div>


    );
};




{/* <div className="leaflet-container">
{/* When routes exist  */}
    // {hasRoute &&  (
//         <div className="leaflet-container">
//             <MapContainer center={[46.83, 17.7]} zoom={13}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* Render waypoints */}
//                 {waypoints?.map( (wpt,id) => (
//                     <Marker key={id} position={[wpt.lat, wpt.lon]} />
//                 ))}

//         {/* Render route polyline */}
//                 {trackpoints && (
//                     <Polyline
//                     positions={trackpoints.map((tp) => 
//                      [tp.lat, tp.lon])}
//                     pathOptions={{color: "red", weight: 3}}
//                     />
//                 )}
//             </MapContainer>
//         </div>
//     )
//     }
// {/* When no route data  */}
//     {!hasRoute && (
//         <div className="leaflet-container">
//             <MapContainer center={[46.83, 17.7]}  zoom={13} scrollWheelZoom={false}>
//                 <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     />
//                     <Marker position={[46.83, 17.7]}>
//                     {/* <Popup>
//                         A pretty CSS3 popup. <br /> Easily customizable.
//                     </Popup> */}
//                     </Marker>
//             </MapContainer>
//         </div>
//     )}

//</div> */}