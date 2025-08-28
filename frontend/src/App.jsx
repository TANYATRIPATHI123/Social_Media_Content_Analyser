import { useState } from "react";
import DropUpload from "./components/DropUpload.jsx";
import { uploadFile } from "./api.js";
import "./styles.css";

export default function App() {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [pdfResult, setPdfResult] = useState("");
  const [imgResult, setImgResult] = useState("");
  const [toast, setToast] = useState("");

  const handlePDF = async (file) => {
    try {
      setPdfLoading(true);
      setToast("");
      const res = await uploadFile(file);
      setPdfResult(res.extracted_text || "(no text found)");
    } catch (e) {
      setToast("PDF extraction failed. Check backend & file.");
      console.log(e);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleImage = async (file) => {
    try {
      setImgLoading(true);
      setToast("");
      const res = await uploadFile(file);
      setImgResult(res.extracted_text || "(no text found)");
    } catch (e) {
      setToast("Image OCR failed. Check backend & Tesseract path.");
      console.log(e);
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <div className="page">
      <header>
        <h1>Social Media Content Analyzer</h1>
      </header>

      {toast && <div className="toast">{toast}</div>}

      <div className="grid">
        {/* PDF SECTION */}
        <section className="card">
          <h2>PDF Upload</h2>
          <DropUpload
            label="Drop PDF here"
            accept=".pdf,application/pdf"
            maxSizeMB={20}
            onFileSelected={handlePDF}
          />
          <button
            className="clear"
            onClick={() => setPdfResult("")}
            disabled={!pdfResult || pdfLoading}
          >
            Clear PDF Result
          </button>
          <div className="result">
            <div className="result-title">
              {pdfLoading ? "Processing PDF..." : "Extracted PDF Text"}
            </div>
            <pre className={`result-box ${pdfLoading ? "loading" : ""}`}>
              {pdfLoading ? "Please wait..." : pdfResult}
            </pre>
          </div>
        </section>

        {/* IMAGE SECTION */}
        <section className="card">
          <h2>Image Upload</h2>
          <DropUpload
            label="Drop Image here"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            maxSizeMB={15}
            onFileSelected={handleImage}
          />
          <button
            className="clear"
            onClick={() => setImgResult("")}
            disabled={!imgResult || imgLoading}
          >
            Clear Image Result
          </button>
          <div className="result">
            <div className="result-title">
              {imgLoading ? "Processing Image..." : "Extracted Image Text"}
            </div>
            <pre className={`result-box ${imgLoading ? "loading" : ""}`}>
              {imgLoading ? "Please wait..." : imgResult}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
