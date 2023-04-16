import fs from "fs";
import { SectionWithEmbedding } from "./getEmbeddings";

const csv = require("csv");

export async function writeEmbeddingsToCSV(embeddings: SectionWithEmbedding[]) {
    const columns = ["title", "content", "embedding"];

    const writeStream = fs.createWriteStream("./data/embedded_sections.csv");
    const stringifier = csv.stringify({ header: true, columns });

    for await (const { title, content, embedding } of embeddings) {
        stringifier.write([title, content, embedding]);
    }

    stringifier.pipe(writeStream);
}
