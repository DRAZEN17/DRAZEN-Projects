import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import '@/lib/leafletSetup';
import 'leaflet/dist/leaflet.css';

const NIGERIA_CENTER = { lat: 9.082, lng: 8.6753 };

function ClickCapture({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: Number(e.latlng.lat.toFixed(6)), lng: Number(e.latlng.lng.toFixed(6)) });
    },
  });
  return null;
}

export function LocationPicker({ value, onChange }) {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border">
        <MapContainer center={value || NIGERIA_CENTER} zoom={value ? 15 : 6} style={{ height: '260px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {value && <Marker position={value} />}
          <ClickCapture onSelect={onChange} />
        </MapContainer>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        {value ? `Pinned at ${value.lat}, ${value.lng}` : 'Click the map to drop a pin at the property location.'}
      </p>
    </div>
  );
}
