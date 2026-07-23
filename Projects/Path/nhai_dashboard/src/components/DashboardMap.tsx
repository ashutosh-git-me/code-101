'use client';
import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#ff8f00" }] },
  { "featureType": "road.highway", "elementType": "labels", "stylers": [{ "visibility": "on" }] },
  { "featureType": "road.highway", "elementType": "labels.icon", "stylers": [{ "visibility": "on" }] },
  { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#37474f" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

export default function DashboardMap({ telemetryData }: { telemetryData: any[] }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState<any>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  // TASK 3: Center near Surat
  const center = useMemo(() => ({ lat: 21.1702, lng: 72.8311 }), []); 
  
  const onLoad = useCallback(function callback(mapContainer: any) {
    setMap(mapContainer);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-[500px] bg-[#020617] rounded-lg border border-white/5 flex items-center justify-center -translate-y-4">
        <span className="text-white font-mono animate-pulse">Initializing Google Maps...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] bg-[#020617] rounded-lg overflow-hidden shadow-2xl relative z-10 border border-white/5">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={6.5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true,
          backgroundColor: '#212121',
        }}
      >
        {telemetryData.filter(d => d.incident).map((data, index) => {
          const severity = data.incident?.severity?.toUpperCase() || 'LOW';
          let color = '#3B82F6';
          if (severity === 'CRITICAL') color = '#EF4444';
          else if (severity === 'MODERATE') color = '#F59E0B';

          return (
            <Marker
              key={data.event_id || index}
              position={{ lat: data.location.lat, lng: data.location.lng }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: color,
                fillOpacity: 0.9,
                scale: 7,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
              onClick={() => setSelectedIncident(data)}
            />
          );
        })}

        {selectedIncident && (
          <InfoWindow
            position={{ lat: selectedIncident.location.lat, lng: selectedIncident.location.lng }}
            onCloseClick={() => setSelectedIncident(null)}
          >
            <div className="p-2 min-w-48 font-sans bg-[#212121] text-white overflow-hidden shadow-2xl">
              <h3 className="font-bold tracking-widest text-emerald-400 uppercase text-[11px] mb-2 border-b border-white/10 pb-1">
                {selectedIncident.location.highway || 'UNKNOWN ROAD'}
              </h3>
              <div className="text-[10px] text-slate-300 mb-2 leading-relaxed">
                {selectedIncident.location.segment && <div>Seg: {selectedIncident.location.segment}</div>}
                {selectedIncident.incident?.extent && <div className="mt-1 font-mono text-[9.5px] text-amber-500 font-semibold">{selectedIncident.incident.extent}</div>}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
