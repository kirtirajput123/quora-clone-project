import React, { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // to generate unique id for answer

const PostAnswer = ({ questionId }) => {
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answerText.trim()) {
      setError("Answer cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const questionRef = doc(db, "questions", questionId);
      const newAnswer = {
        id: uuidv4(), // unique id for answer
        text: answerText.trim(),
        votes: 0,
      };

      // Append new answer to answers array using arrayUnion
      await updateDoc(questionRef, {
        answers: arrayUnion(newAnswer),
      });

      setSuccessMsg("Answer posted successfully!");
      setAnswerText("");
    } catch (err) {
      setError("Failed to post answer. Try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write your answer..."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          style={{ width: "80%", padding: "6px", marginRight: "6px" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Answer"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
    </div>
  );
};

export default PostAnswer;
