

const SearchBar = ({ setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Search questions..."
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
    />
  );
};

const QuestionList = ({ questions, searchTerm }) => {
  const filteredQuestions = questions.filter((q) =>
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {filteredQuestions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        filteredQuestions.map((q) => (
          <div key={q.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{q.questionText}</h3>
            {/* Answers or other details */}
          </div>
        ))
      )}
    </div>
  );
};

export { SearchBar, QuestionList };
