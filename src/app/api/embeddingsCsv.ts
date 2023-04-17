import fs from "fs";
import { SectionWithEmbedding } from "./make-embeddings/getEmbeddings";

const csv = require("csv");

const CSV_FILE = `${process.cwd()}/data/embedded_sections.csv`;

export async function writeEmbeddingsToCSV(embeddings: SectionWithEmbedding[]) {
    const columns = ["title", "content", "embedding"];

    const writeStream = fs.createWriteStream(CSV_FILE);
    const stringifier = csv.stringify({ header: true, columns });

    for await (const { title, content, embedding } of embeddings) {
        stringifier.write([title, content, embedding]);
    }

    stringifier.pipe(writeStream);
}

export async function readEmbeddingsFromCSV() {
    const readStream = fs
        .createReadStream(CSV_FILE)
        .pipe(csv.parse({ from_line: 2 }));

    const data = [];

    for await (const row of readStream) {
        const [label, description, embedding] = row;
        data.push({
            label,
            description,
            embedding: JSON.parse(embedding),
            similarity: 0,
        });
    }

    return data;
}
