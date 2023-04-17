import { Configuration, OpenAIApi } from "openai";
import { readEmbeddingsFromCSV } from "../embeddingsCsv";
// @ts-expect-error
import cosineSimilarity from "compute-cosine-similarity";

const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    })
);

async function getEmbedding(input: string) {
    const embedding = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input,
    });

    return embedding.data.data[0].embedding;
}

async function findRelevantSections(question: string) {
    const questionEmbedding = await getEmbedding(question);
    // similarity key gets rewritten
    const haystack = await readEmbeddingsFromCSV();

    for (const item of haystack) {
        item.similarity = cosineSimilarity(questionEmbedding, item.embedding);
    }

    haystack.sort((a, b) => b.similarity - a.similarity);

    return haystack.slice(0, 20);
}

export async function POST(request: Request) {
    const question = await request.text();
    const relevantSections = await findRelevantSections(question);

    return new Response(
        JSON.stringify({
            relevantSections,
            success: "whee",
        })
    );
}
