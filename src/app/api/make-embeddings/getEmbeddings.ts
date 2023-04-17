import { Configuration, OpenAIApi } from "openai";
import { Section } from "./parseSections";

const openai = new OpenAIApi(
    new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

export type SectionWithEmbedding = Section & {
    embedding: number[];
};

async function fetchEmbedding(input: string) {
    const embedding = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input,
    });

    return embedding.data.data[0].embedding;
}

async function fetchEmbeddingForSection(
    section: Section
): Promise<SectionWithEmbedding> {
    const embedding = await fetchEmbedding(
        `Title: ${section.title}; Content: ${section.content}`
    );

    return {
        ...section,
        embedding,
    };
}

export async function getEmbeddings(sections: Section[]) {
    const embeddings = await Promise.all(
        sections.map(fetchEmbeddingForSection)
    );

    return embeddings;
}
