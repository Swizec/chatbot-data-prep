import * as glob from "glob";
import { writeEmbeddingsToCSV } from "../embeddingsCsv";
import { SectionWithEmbedding, getEmbeddings } from "./getEmbeddings";
import { parseMdxIntoSections } from "./parseSections";

const SWIZ_CSV_FILE = `${process.cwd()}/data/swiz_embedded_sections.csv`;
const JSTARK_CSV_FILE = `${process.cwd()}/data/jstark_embedded_sections.csv`;

export async function GET(request: Request) {
    // const files = glob.sync(`${process.cwd()}/data/*.mdx`, {});
    const files = glob.sync(`${process.cwd()}/data/jstark/*.md`, {});

    let sectionsWithEmbeddings: SectionWithEmbedding[][] = [];

    for (const filename of files) {
        console.log("doing", filename);

        const sections = await parseMdxIntoSections(filename);
        const embeddings = await getEmbeddings(sections);
        sectionsWithEmbeddings.push(embeddings);
    }

    await writeEmbeddingsToCSV(JSTARK_CSV_FILE, sectionsWithEmbeddings.flat());

    return new Response(
        JSON.stringify({
            success: "CSV dataset created",
        })
    );
}
