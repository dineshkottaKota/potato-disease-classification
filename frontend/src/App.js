import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // For previewing the image
  const [responseData, setResponseData] = useState(null); // For storing API response
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Generate a URL for previewing the uploaded file (image)
    if (selectedFile) {
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponseData(res.data); // Store response data
    } catch (err) {
      setResponseData({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Potato Leaf Disease Classification</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>

      {/* Show uploaded image preview */}
      {filePreview && (
        <div className="file-preview">
          <h2>Uploaded File Preview</h2>
          <img src={filePreview} alt="Preview" className="uploaded-image" />
        </div>
      )}

      {/* Show response */}
      {responseData && !responseData.error && (
        <div className="result-card">
          <h2>Prediction Result</h2>
          <div className="result-details">
            <p>
              <strong>Class: </strong> {responseData.class}
            </p>
            <p>
              <strong>Confidence: </strong> {(responseData.confidence * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Show error message */}
      {responseData && responseData.error && (
        <div className="error-message">
          <p>{responseData.error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
