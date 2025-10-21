import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngBounds, LatLngTuple } from "leaflet";


type Waypoint = {
  id: number | string;
  name: string;
  lat: number;
  lon: number;
};

type TrackPoint = {
  lat: number;
  lon: number;
};

type TrackMapProps = {
  Waypoints?: Waypoint[];
  trackPoints?: TrackPoint[];
};


function ForceResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);
  return null;
}


const TrackMap: React.FC<TrackMapProps> = ({ Waypoints = [], trackPoints = [] }) => {
  // Optimize rendering by sampling every 5th trackpoint
  const optimization = useMemo(() => {
    if (!trackPoints || trackPoints.length === 0) return [];
    return trackPoints.filter((_, i) => i % 5 === 0)
    .map(tp => [tp.lat, tp.lon] as LatLngTuple);
  }, [trackPoints]);

// ✅ Default center = Lake Balaton
const BALATON_CENTER: LatLngTuple = [46.83, 17.7];

const center: LatLngTuple = optimization.length
  ? optimization[0]
  : BALATON_CENTER;


  return (
 <div style={{ width: "400%", height: "85vh" }}>

    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Draw route polyline */}
      {optimization.length > 0 && (
        <Polyline positions={optimization} color="blue" weight={3} />
      )}

      {/* Waypoints markers */}
      {Waypoints.map((wp) => (
        <Marker key={wp.id} position={[wp.lat, wp.lon]}>
          <Popup>{wp.name}</Popup>
        </Marker>
      ))}
    </MapContainer>



 </div>

  );
};

export default TrackMap;
