import React from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuth, isAuth }) {
  let navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      navigate("/");
    });
  };
  
  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      navigate("/");
    });
  };

  return (
    <div className="container login">
      <h2>Google Authentication</h2>

      {!isAuth ? (
        <button className="submit-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      ) : (
        <button className="submit-btn" onClick={signUserOut}>
          Sign Out
        </button>
      )}
    </div>
  );
}
