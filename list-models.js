import fetch from 'node-fetch'; // wait, node-fetch might not be installed. 
// I'll use the built-in fetch if node version is recent enough.
async function listModels() {
    const key = "AIzaSyC9vHRMKKBFTXanoFALzNcY_nspIYN8xtc";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}
listModels();
