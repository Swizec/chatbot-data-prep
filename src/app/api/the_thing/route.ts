import { getEmbeddings } from "./getEmbeddings";
import { parseMdxIntoSections } from "./parseSections";

export async function GET(request: Request) {
    const filename = `${process.cwd()}/data/______websites_swizec_com_src_pages_blog__coding-is-the-easy-part_index.mdx`;

    const sections = await parseMdxIntoSections(filename);
    const embeddings = await getEmbeddings(sections);

    console.log(embeddings);

    return new Response(JSON.stringify(embeddings));
}
