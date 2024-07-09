import Link from "next/link";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <Link href="/create" className={styles.link}>
        Créer
      </Link>
      <Link href="/edit" className={styles.link}>
        Modifier
      </Link>
      <Link href="/list" className={styles.link}>
        Liste des bases
      </Link>
    </div>
  );
};

export default Navbar;
