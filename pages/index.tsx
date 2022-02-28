import type { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Link href="/account/signup">signup</Link>
      <br />
      <Link href="/account/login">login</Link>
      <br />
      <Link href="/account/forgot-password">forgot-password</Link>
      <br />
      <Link href="/account/change-password">change-password</Link>
      <br />
      <Link href="/account/verify-email">verify-email</Link>
      <br />
      <Link href="/account/change-password">change-password</Link>
      <br />
    </div>
  );
};

export default Home;
