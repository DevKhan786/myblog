import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ isAuth }) {
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/createpost">Post</Link>
      {!isAuth ? <Link to="/login">Login</Link> : <Link to="/login">Sign out</Link> }
    </div>
  );
}
