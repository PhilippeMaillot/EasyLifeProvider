import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import HeaderBar from '@/components/Headerbar';

export default function Home() {
  return (
    <div>
      <HeaderBar />
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <h1>Bienvenue sur la page d'accueil</h1>
          <p>Choisissez une option dans la barre de navigation.</p>
        </div>
      </div>
    </div>
  );
}
