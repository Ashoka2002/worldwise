import styles from "./Map.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";

function Map() {
  const navigate = useNavigate();

  const [position, setPosition] = useSearchParams();
  const lat = position.get("lat");
  const lng = position.get("lng");
  return (
    <div className={styles.mapContainer} onClick={() => navigate("form")}>
      <h1>Map</h1>
      <h2>
        Position: {lat} {lng}
      </h2>
    </div>
  );
}

export default Map;
