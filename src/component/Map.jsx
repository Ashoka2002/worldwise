import styles from "./Map.module.css";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useLocalCities } from "../contexts/LocalCitiesContext";
import { useGeolocation } from "../hooks/useGeoloacation";
import Button from "../component/Button";
import Sidebar from "./Sidebar.jsx";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Flag from "./Flag.jsx";

function Map() {
  const { cities } = useLocalCities();
  const [mapPosition, setMapPosition] = useState(() => {
    const { lat, lng } = cities?.at(-1).position;
    console.log(lat, +lng);
    if (!lat || !lng) return [0, 0];
    return [+lat, +lng];
  });
  const [mapLat, mapLng] = useUrlPosition();
  const [isSatellite, setIsSatellite] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    isLoading: isLoadingPosition,
    position: geoLoacationPosition,
    getPosition,
  } = useGeolocation();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geoLoacationPosition)
      setMapPosition([geoLoacationPosition.lat, geoLoacationPosition.lng]);
  }, [geoLoacationPosition]);

  function handleToggleSatellite() {
    setIsSatellite((cur) => !cur);
  }

  return (
    <>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className={styles.mapContainer}>
        {!geoLoacationPosition && (
          <Button type="position" onClick={getPosition}>
            {isLoadingPosition ? "Loading..." : "Get Loaction"}
          </Button>
        )}

        <Button type="toggleSatellite" onClick={handleToggleSatellite}>
          Satellite Mode: {isSatellite ? "ON" : "OFF"}
        </Button>

        <MapContainer
          center={[mapLat, mapLng]}
          // center={mapPosition}
          zoom={6}
          scrollWheelZoom={true}
          className={styles.map}
        >
          {isSatellite ? (
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              // tileSize={512}
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}
          {cities.map((city) => (
            <Marker
              key={city.id}
              position={[city.position.lat, city.position.lng]}
            >
              <Popup>
                <span style={{ maxHeight: "2.8rem", height: "2.8rem" }}>
                  <Flag countryCode={city.countryCode} />
                </span>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          ))}
          <ChangeCenter position={mapPosition} />
          <DetectClick />
          <ToggleSideBar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </MapContainer>
      </div>
    </>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => {
      navigate(`form?mode=input&lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

function ToggleSideBar({ isSidebarOpen, setIsSidebarOpen }) {
  const handleClick = () => setIsSidebarOpen(true);

  useMapEvents({
    click: handleClick,
  });

  return null;
}

export default Map;
