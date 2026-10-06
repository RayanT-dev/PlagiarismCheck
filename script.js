const GROQ_API_KEY = "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";
const MODEL_NAME = "openai/gpt-oss-20b";

document.addEventListener("DOMContentLoaded", () => {
    const analyzeBtn = document.getElementById("analyzeBtn");
    analyzeBtn.addEventListener("click", analyzeText);
});

async function analyzeText() {
    const textToAnalyze = document.getElementById("textToAnalyze").value.trim();
    const analyzeBtn = document.getElementById("analyzeBtn");
    const loader = document.getElementById("loader");
    const resultBox = document.getElementById("result-box");
    const analysisResult = document.getElementById("analysisResult");

    if (!textToAnalyze) {
        alert("Please paste some text to analyze.");
        return;
    }

    analyzeBtn.disabled = true;
    loader.style.display = "block";
    resultBox.style.display = "none";
    analysisResult.innerHTML = "";

    const prompt = `
You are an expert AI content detection tool.
Carefully analyze the following text:

"${textToAnalyze}"

Provide your analysis in Markdown format using the following structure in English:

### 📊 Estimated AI Probability
*(Display a clear percentage score from 0% to 100% estimating the likelihood of AI generation)*

### 🔍 Key Findings
* **Structure & Syntax:** (Analyze phrasing regularity, complexity, and sentence structure)
* **Vocabulary & Tone:** (Identify repetitive AI patterns, buzzwords, or human elements)
* **Burstiness & Flow:** (Evaluate natural variation vs. robotic uniformity)

### 🎯 Final Verdict
*(Provide a concise, direct, one-line conclusion)*
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.2
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "An error occurred during the request.");
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        analysisResult.innerHTML = marked.parse(reply);
        resultBox.style.display = "block";

    } catch (error) {
        alert("Analysis Error: " + error.message);
    } finally {
        analyzeBtn.disabled = false;
        loader.style.display = "none";
    }
}