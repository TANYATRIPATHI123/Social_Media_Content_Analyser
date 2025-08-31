import './styles.css'
import { useState } from 'react';
import ReactMarkdown from "react-markdown";

export default function Homepage() {
    const [rewriteText, setRewriteText] = useState("Your polished post");
    const [analysisText, setAnalysisText] = useState("Your post analysis will appear here... ");
    const [recommendationText, setRecommendationText] = useState("Your recommendations will appear here... ");
    const [loading, setLoading] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    function parseSections(text = "") {
        if (typeof text !== "string" || text.trim() === "") return [];
        const regex = /(^|\n)([A-Z][\w\s/&+-]{1,100}?):\s*([\s\S]*?)(?=\n[A-Z][\w\s/&+-]{1,100}?:|\s*$)/g;
        const sections = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            const title = match[2]?.trim() || "Untitled";
            let content = match[3]?.trim() || "";
            sections.push({ title, content });
        }
        if (sections.length === 0 && text.trim()) {
            sections.push({ title: "Notes", content: text });
        }
        return sections;
    }

    function formatRecommendations(text) {
        const sections = parseSections(text);
        return sections.map(({ title, content }, idx) => (
            <div key={idx} className="mb-4">
                <h5 className="fw-bold mb-2" style={{ color: "#00b4d8" }}>
                    {title}
                </h5>
                <div className="prose">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        ));
    }

    // 🔹 File upload (click + drag & drop)
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to fetch analysis");
            const data = await res.json();

            const analysis = data.analysis || {};
            setAnalysisText(`
Sentiment: ${analysis.sentiment || "N/A"}
Readability: ${analysis.readability || "N/A"}
Issues: ${(analysis.issues || []).join(", ") || "None"}
            `);

            setRecommendationText(`
Hashtags: ${(analysis.suggestions?.hashtags || []).join(" ") || "N/A"}
Call-to-Action: ${analysis.suggestions?.["call-to-action"] || "N/A"}
            `);

            setRewriteText(analysis.suggestions?.improved_post || "No rewrite returned.");
        } catch (error) {
            console.error("Error uploading file:", error);
            setAnalysisText("Error fetching analysis.");
            setRecommendationText("Error fetching recommendations.");
            setRewriteText("Error fetching rewrite.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Drag & drop events
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("drag-over");
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("drag-over");
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("drag-over");
        handleFileChange(e);
    };

    return (
        <>
            <div className='heading'>Social Media Analyser</div>
            <h2>Upload your File/Image</h2>

            {/* Upload Box */}
            <div
                className="file-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <label htmlFor="fileInput" className="upload-box">
                    <span className="upload-icon">📂</span>
                    <p className="upload-text">Drag & drop your file here or click to upload</p>
                </label>
                <input
                    id="fileInput"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    onChange={handleFileChange}
                />
            </div>
             {/* Centered Loading Message */}
            {loading && (
                <div className="loading-overlay">
                    <p>Processing your file... Please wait.</p>
                </div>
            )}

            <div className='container my-3'>
                <h2 className="section-heading">Post Analysis</h2>
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <p id="analysisText">{formatRecommendations(analysisText)}</p>
                        <button className="btn custom-btn btn-sm"
                            onClick={() => handleCopy(analysisText)}>Copy</button>
                    </div>
                </div>

                <h2 className="section-heading">Recommendations</h2>
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <p id="recommendationsText">{formatRecommendations(recommendationText)}</p>
                        <button className="btn custom-btn btn-sm"
                            onClick={() => handleCopy(recommendationText)}>Copy</button>
                    </div>
                </div>

                <h2 className="section-heading">AI Rewrite</h2>
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <p id="rewriteText">{formatRecommendations(rewriteText)}</p>
                        <button className="btn custom-btn btn-sm"
                            onClick={() => handleCopy(rewriteText)}>Copy</button>
                    </div>
                </div>
            </div>
        </>
    )
}
