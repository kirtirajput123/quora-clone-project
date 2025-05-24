import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";

const UpvoteDownvote = ({ answerId, currentUserId }) => {
  const [userVote, setUserVote] = useState(0); // 1 = upvote, -1 = downvote, 0 = no vote
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    // Fetch current votes and user's vote on mount
    const fetchVotes = async () => {
      const answerRef = doc(db, "answers", answerId);
      const docSnap = await getDoc(answerRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const votes = data.votes || {};
        setUserVote(votes[currentUserId] || 0);
        // Calculate total votes (sum of all vote values)
        const total = Object.values(votes).reduce((acc, val) => acc + val, 0);
        setTotalVotes(total);
      }
    };
    fetchVotes();
  }, [answerId, currentUserId]);

  const handleVote = async (voteValue) => {
    const answerRef = doc(db, "answers", answerId);
    const docSnap = await getDoc(answerRef);
    if (!docSnap.exists()) return;

    let votes = docSnap.data().votes || {};

    if (votes[currentUserId] === voteValue) {
      // User clicked same vote again => remove vote
      delete votes[currentUserId];
      setUserVote(0);
    } else {
      // Add/update vote
      votes[currentUserId] = voteValue;
      setUserVote(voteValue);
    }

    // Update votes in firestore
    await updateDoc(answerRef, { votes });

    // Update total votes state
    const total = Object.values(votes).reduce((acc, val) => acc + val, 0);
    setTotalVotes(total);
  };

  return (
    <div>
      <button
        style={{ color: userVote === 1 ? "green" : "black" }}
        onClick={() => handleVote(1)}
      >
        Upvote
      </button>
      <button
        style={{ color: userVote === -1 ? "red" : "black" }}
        onClick={() => handleVote(-1)}
      >
        Downvote
      </button>
      <span>Total Votes: {totalVotes}</span>
    </div>
  );
};

export default UpvoteDownvote;
