import Sidebar from "../component/Sidebar";
import Map from "../component/Map";
import styles from "./Applayout.module.css";

function Applayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
    </div>
  );
}

export default Applayout;
