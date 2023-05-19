import { Configuration, OpenAIApi } from "openai";
import { Section } from "./parseSections";
import retry from "async-retry";

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
    const embedding = await retry(
        async () =>
            await fetchEmbedding(
                `Title: ${section.title}; Content: ${section.content}`
            ),
        {
            retries: 5,
            factor: 2,
            minTimeout: 500,
            maxTimeout: 10000,
        }
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
