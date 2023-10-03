import Sidebar from "../component/Sidebar";
import Map from "../component/Map";
import styles from "./Applayout.module.css";
import User from "../component/User";

function Applayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default Applayout;
