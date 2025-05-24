import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const QuestionForm = () => {
  const [question, setQuestion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      await addDoc(collection(db, "questions"), {
        questionText: question,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setQuestion("");
    } catch (error) {
      alert("Error adding question: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Ask your question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={3}
      />
      <button type="submit">Post Question</button>
    </form>
  );
};

export default QuestionForm;
