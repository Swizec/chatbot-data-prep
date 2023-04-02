"use client";
import styles from "./page.module.css";

export const TheButton = () => {
    async function doTheThing() {
        const res = await fetch("/api/the_thing").then((res) => res.json());

        console.log(res);
    }

    return (
        <button className={styles.thirteen} onClick={doTheThing}>
            Do the thing
        </button>
    );
};
