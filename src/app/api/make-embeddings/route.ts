import * as glob from "glob";
import { writeEmbeddingsToCSV } from "../embeddingsCsv";
import { SectionWithEmbedding, getEmbeddings } from "./getEmbeddings";
import { parseMdxIntoSections } from "./parseSections";

export async function GET(request: Request) {
    const files = glob.sync(`${process.cwd()}/data/*.mdx`, {});

    let sectionsWithEmbeddings: SectionWithEmbedding[][] = [];

    for (const filename of files) {
        console.log("doing", filename);

        const sections = await parseMdxIntoSections(filename);
        const embeddings = await getEmbeddings(sections);
        sectionsWithEmbeddings.push(embeddings);
    }

    await writeEmbeddingsToCSV(sectionsWithEmbeddings.flat());

    return new Response(
        JSON.stringify({
            success: "CSV dataset created",
        })
    );
}
