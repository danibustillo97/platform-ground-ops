import styles from "./Loader.module.css";

const HomePage = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <h1 className={styles.loaderText}>Comprobando Estado del Usuario</h1>
    </div>
  );
};

export default HomePage;
