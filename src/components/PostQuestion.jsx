import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const PostQuestion = () => {
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!questionText.trim()) {
      setError("Question cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // Add new question with empty answers array
      await addDoc(collection(db, "questions"), {
        questionText: questionText.trim(),
        answers: [],
      });
      setSuccessMsg("Question posted successfully!");
      setQuestionText("");
    } catch (err) {
      setError("Failed to post question. Try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your question here..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Question"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
    </div>
  );
};

export default PostQuestion;
