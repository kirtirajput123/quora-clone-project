import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Your firebase config file
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const QuestionList = ({ searchTerm }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "questions"));
      const qList = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setQuestions(qList);
      setLoading(false);
    };

    fetchQuestions();
  }, []);
  
{filteredQuestions.map((q) => (
  <div key={q.id} style={{ /* styling */ }}>
    <h3>{q.questionText}</h3>
    {/* ... existing answers display ... */}
    <PostAnswer questionId={q.id} />
  </div>
))}

  // Filter questions based on searchTerm
  const filteredQuestions = questions.filter(q =>
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle upvote/downvote
  const handleVote = async (questionId, answerId, delta) => {
    // Find question and answer index
    const qIndex = questions.findIndex(q => q.id === questionId);
    if (qIndex === -1) return;

    const aIndex = questions[qIndex].answers.findIndex(a => a.id === answerId);
    if (aIndex === -1) return;

    // Update local state first (optimistic UI)
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers[aIndex].votes += delta;

    // Prevent votes going below zero
    if (updatedQuestions[qIndex].answers[aIndex].votes < 0) {
      updatedQuestions[qIndex].answers[aIndex].votes = 0;
    }

    setQuestions(updatedQuestions);

    // Update Firestore
    try {
      const questionRef = doc(db, "questions", questionId);

      // Update answers array in Firestore with new votes
      // Because Firestore does not support partial update inside arrays,
      // we replace the entire answers array with updated one.
      await updateDoc(questionRef, {
        answers: updatedQuestions[qIndex].answers,
      });
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  };

  if (loading) return <p>Loading questions...</p>;

  return (
    <div>
      {filteredQuestions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        filteredQuestions.map((q) => (
          <div
            key={q.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
              borderRadius: "6px",
            }}
          >
            <h3>{q.questionText}</h3>
            <div>
              <h4>Answers:</h4>
              {q.answers && q.answers.length > 0 ? (
                q.answers.map((answer) => (
                  <div
                    key={answer.id}
                    style={{
                      borderTop: "1px solid #eee",
                      marginTop: "8px",
                      paddingTop: "6px",
                    }}
                  >
                    <p>{answer.text}</p>
                    <div>
                      <button
                        onClick={() => handleVote(q.id, answer.id, +1)}
                        style={{ marginRight: "8px" }}
                      >
                        Upvote
                      </button>
                      <button
                        onClick={() => handleVote(q.id, answer.id, -1)}
                        style={{ marginRight: "8px" }}
                      >
                        Downvote
                      </button>
                      <span>Votes: {answer.votes}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No answers yet.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionList;
