import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";
import HeaderBar from "@/components/Headerbar";

export default function Help() {
  return (
    <div>
      <HeaderBar />
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <h1>Aide</h1>
          <p>Help page</p>
        </div>
      </div>
    </div>
  );
}
