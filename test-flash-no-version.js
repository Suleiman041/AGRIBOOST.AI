import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyC9vHRMKKBFTXanoFALzNcY_nspIYN8xtc";
const genAI = new GoogleGenerativeAI(API_KEY);
async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const probe = await model.generateContent("Hi");
        console.log("SUCCESS:", probe.response.text());
    } catch (err) {
        console.log("FAILED:", err.message);
    }
}
test();
