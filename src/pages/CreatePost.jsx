import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc
} from "firebase/firestore";

import { db, auth } from "../firebase-config";

export default function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");

  let navigate = useNavigate();

  const postCollection = collection(db, "posts");

  const onPost = async () => {
    if (!title || !postText) {
      alert("You must enter both fields.");
    } else {
      await addDoc(postCollection, {
        title,
        postText,
        timestamp: new Date(),
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
      });
      navigate("/");
    }
  };

  return (
    <div className="container create-post">
      <h2>Create a New Post</h2>

      <input
        type="text"
        id="title"
        name="title"
        placeholder="Post Title"
        className="input-field"
        onChange={(e) => setTitle(e.target.value)}
      />
      
      <textarea
        id="content"
        name="content"
        rows="4"
        placeholder="Post Content (Markdown supported)"
        className="input-field"
        onChange={(e) => setPostText(e.target.value)}
      ></textarea>
      {isAuth ? (
        <button type="submit" className="submit-btn" onClick={onPost}>
          Submit Post
        </button>
      ) : (
        <span>You are not logged in</span>
      )}
    </div>
  );
}
