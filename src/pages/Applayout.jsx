import Map from "../component/Map";
import styles from "./AppLayout.module.css";
import User from "../component/User";

function Applayout() {
  return (
    <div className={styles.app}>
      <Map />
      <User />
    </div>
  );
}

export default Applayout;
