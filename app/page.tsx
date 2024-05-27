"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

interface weather {}

export default function Home() {
  const [data, setData] = useState<string>();

  useEffect(() => {
    console.log("Realtime page loaded");
    const eventSource = new EventSource("/stream");
    eventSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      console.table(data);
      if (data.hasOwnProperty("message")) {
        // console.log("Connection established")
        // alert("Connection established");
        return;
      }

      setData((prevData) => data.condition);
      // alert(`New data received ${data.condition}`);
    });

    return () => {
      eventSource.close();
    };
  }, []);
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Welcome to&nbsp;
          <code className={styles.code}>SSE Weather App</code>
        </p>
      </div>

      <div className={styles.center}>
        <div className={styles.description}>
          <p>
            Weather at Bengaluru:&nbsp;
            <code className={styles.code}>{data}</code>
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>Cuurent Weather</h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a> */}
      </div>
    </main>
  );
}
