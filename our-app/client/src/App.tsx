import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import InitialSetup from "./pages/InitialSetup";
import CustomQuiz from "./components/CustomQuiz";
import BasicQuiz from "./components/BasicQuiz";

const App: React.FC = () => {
  return (
  <>
      <Navbar />
      <Routes>
        <Route path="/initial-setup" element={<InitialSetup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/users/:userId/quiz" element={<CustomQuiz />} />
        <Route path="/users/:userId/:language/:quizLevel/:topic" element={<BasicQuiz />} />
      </Routes>
  </>
  );
};

export default App;
