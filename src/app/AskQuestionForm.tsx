"use client";
import { FormEvent, useState } from "react";
import styles from "./page.module.css";

export const AskQuestionForm = () => {
    const [question, setQuestion] = useState("");

    async function askQuestion(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const res = await fetch("/api/ask-question", {
            method: "POST",
            body: question,
        }).then((res) => res.json());

        console.log(res);
    }

    return (
        <form onSubmit={askQuestion} className={styles.description}>
            <h2>Ask SwizBot a question</h2>

            <input
                type="text"
                name="question"
                value={question}
                onChange={(e) => setQuestion(e.currentTarget.value)}
            />
            <button>Ask</button>

            {/* <button className={styles.thirteen} onClick={doTheThing}>
                Make embeddings
            </button> */}
        </form>
    );
};
