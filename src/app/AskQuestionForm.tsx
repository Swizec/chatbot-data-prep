"use client";
import { FormEvent, useState } from "react";
import styles from "./page.module.css";
import { useMutation } from "react-query";
import { BeatLoader } from "react-spinners";

async function getAnswer(question: string) {
    const res = await fetch("/api/ask-question", {
        method: "POST",
        body: question,
    }).then((res) => res.json());

    console.log(res);

    return res;
}

export const AskQuestionForm = () => {
    const [question, setQuestion] = useState("");
    const answer = useMutation(getAnswer);

    async function askQuestion(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!answer.isLoading) {
            await answer.mutateAsync(question);
        }
    }

    console.log(answer);

    return (
        <form
            onSubmit={askQuestion}
            className={styles.description}
            autoComplete="off"
        >
            <h2>Ask SwizBot a question</h2>

            <input
                type="text"
                name="question"
                value={question}
                onChange={(e) => setQuestion(e.currentTarget.value)}
            />
            {answer.isLoading ? (
                <BeatLoader size={25} />
            ) : (
                <button disabled={answer.isLoading}>Ask</button>
            )}

            {answer.data ? <p>{answer.data?.answer?.message.content}</p> : null}

            {/* <button className={styles.thirteen} onClick={doTheThing}>
                Make embeddings
            </button> */}
        </form>
    );
};
