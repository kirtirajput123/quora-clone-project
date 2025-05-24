import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";  // Your Firebase config
import { SearchBar, QuestionList } from "../components/SearchComponents"; 

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, "questions"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(data);
      } catch (err) {
        setError("Failed to fetch questions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Filter questions based on searchTerm (case insensitive)
  const filteredQuestions = questions.filter((q) =>
    q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.body?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <SearchBar setSearchTerm={setSearchTerm} />
      {loading && <p>Loading questions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <QuestionList questions={filteredQuestions} searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default Home;
