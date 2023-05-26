import fs from "fs";
import { SectionWithEmbedding } from "./make-embeddings/getEmbeddings";

const csv = require("csv");

export async function writeEmbeddingsToCSV(
    filename: string,
    embeddings: SectionWithEmbedding[]
) {
    const columns = ["title", "content", "embedding"];

    const writeStream = fs.createWriteStream(filename);
    const stringifier = csv.stringify({ header: true, columns });

    for await (const { title, content, embedding } of embeddings) {
        stringifier.write([title, content, embedding]);
    }

    stringifier.pipe(writeStream);
}

export async function readEmbeddingsFromCSV(filename: string) {
    const readStream = fs
        .createReadStream(filename)
        .pipe(csv.parse({ from_line: 2 }));

    const data = [];

    for await (const row of readStream) {
        const [title, content, embedding] = row;
        data.push({
            title,
            content,
            embedding: JSON.parse(embedding),
            similarity: 0,
        });
    }

    return data;
}
