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

function splitStringIntoEqualParts(input: string, partSize: number): string[] {
    const words = input.split(" ");
    const parts = Math.ceil(words.length / partSize);

    const result: string[] = [];
    for (let i = 0; i < parts; i++) {
        const currentPart = words.slice(i * partSize, i * partSize + partSize);
        const combinedWords = currentPart.join(" ");
        result.push(combinedWords);
    }

    return result;
}

export async function getEmbeddings(sections: Section[]) {
    const embeddings: SectionWithEmbedding[] = [];

    for (const section of sections) {
        console.log(section.title);
        const chunkedSection = splitStringIntoEqualParts(section.content, 1400);
        for (const fragment of chunkedSection) {
            embeddings.push(
                await fetchEmbeddingForSection({
                    type: "section",
                    title: section.title,
                    content: fragment,
                })
            );
        }
    }

    return embeddings;
}
