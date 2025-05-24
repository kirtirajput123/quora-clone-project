import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />           {/* Home Feed */}
        <Route path="/login" element={<Login />} />     {/* Login Page */}
        <Route path="/register" element={<Register />} /> {/* Register Page */}
      </Routes>
    </Router>
  );
};

export default App;
