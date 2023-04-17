"use client";
import styles from "./page.module.css";

export const MakeEmbeddingsButton = () => {
    async function doTheThing() {
        const res = await fetch("/api/make-embeddings").then((res) =>
            res.json()
        );

        console.log(res);
    }

    return (
        <button className={styles.thirteen} onClick={doTheThing}>
            Make embeddings
        </button>
    );
};
