
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { LatLngBounds, LatLngTuple } from "leaflet";
import"../Layout/MapView.css";


export default function AdminMapView() {


// ✅ Default center = Lake Balaton
const BALATON_CENTER: LatLngTuple = [46.83, 17.7];



//----------------------
// RENDERING ZONE    
//----------------------
    return(
        <>

        <div className="leaflet-container">
            <MapContainer center={[46.83, 17.7]}  zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[46.83, 17.7]}>
                    {/* <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup> */}
                    </Marker>
            </MapContainer>
        </div>
        
        </>

    );
};