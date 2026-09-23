import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '@/lib/leafletSetup';
import 'leaflet/dist/leaflet.css';

const NIGERIA_CENTER = [9.082, 8.6753];

export function PropertyMap({ markers = [], height = '420px', zoom = 6 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <MapContainer center={NIGERIA_CENTER} zoom={zoom} style={{ height, width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
