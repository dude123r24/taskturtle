import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are a test assistant.`;

async function test() {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: SYSTEM_PROMPT,
        });

        const response = await model.generateContent("hello");
        console.log("Response:", response.response.text());
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
