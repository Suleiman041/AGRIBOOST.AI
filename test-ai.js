import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC9vHRMKKBFTXanoFALzNcY_nspIYN8xtc";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    console.log("--- Testing Models ---");
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];

    for (const m of models) {
        try {
            console.log(`Testing ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const probe = await model.generateContent("Hi");
            console.log(`[PASS] ${m}: ${probe.response.text().substring(0, 20)}...`);
        } catch (err) {
            console.log(`[FAIL] ${m}: ${err.message.split('\n')[0]}`);
        }
    }
}

listModels();
