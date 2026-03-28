import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leafet default icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

// Alps region bounds
const alpsBounds = [
  [43.5, 5.0], // Southwest
  [48.5, 16.5] // Northeast
];

const MapView = () => {
  return (
    <div className="map-container glass-panel" style={{ height: '100%', minHeight: '400px', padding: '0', overflow: 'hidden' }}>
      <MapContainer 
        bounds={alpsBounds} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <Rectangle bounds={alpsBounds} pathOptions={{ color: '#3b82f6', weight: 2, fillOpacity: 0.1 }} />
        
        {/* Sample Marker for a high-risk area */}
        <Marker position={[45.92, 6.86]}>
          <Popup>
            <strong>Chamonix-Mont-Blanc</strong><br/>
            High risk of glacier retreat impact.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
