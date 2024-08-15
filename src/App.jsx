import "./App.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuth");
    setIsAuth(authStatus === "true");
  }, []);

  return (
    <Router>
      <Navbar isAuth={isAuth} />
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} />
        <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
        <Route
          path="/login"
          element={<Login setIsAuth={setIsAuth} isAuth={isAuth} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
