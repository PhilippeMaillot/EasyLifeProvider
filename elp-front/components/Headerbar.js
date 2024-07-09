import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/HeaderBar.module.css';
import StorageIcon from '@mui/icons-material/Storage';

const HeaderBar = () => {
  return (
    <div className={styles.headerBar}>
      <div className={styles.logo}>ELP <StorageIcon style={{ marginLeft: '6px', marginBottom: '4px' }} /></div>
    </div>
  );
};

export default HeaderBar;
