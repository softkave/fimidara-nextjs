import type { NextPage } from "next";
import WebHeader from "../components/web/WebHeader";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <WebHeader />
    </div>
  );
};

export default Home;
