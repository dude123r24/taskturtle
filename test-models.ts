async function test() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        const models = data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
        console.log("Available models:", models.map(m => m.name));
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
