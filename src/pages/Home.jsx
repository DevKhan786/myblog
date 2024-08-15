import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { marked } from "marked";

export default function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedText, setEditedText] = useState("");

  const postCollection = collection(db, "posts");

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    setPostList(postLists.filter((post) => post.id !== id));
  };

  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditedTitle(post.title);
    setEditedText(post.postText);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
  };

  const saveEdit = async (id) => {
    const postDoc = doc(db, "posts", id);
    await updateDoc(postDoc, {
      title: editedTitle,
      postText: editedText,
    });
    setPostList(
      postLists.map((post) =>
        post.id === id
          ? { ...post, title: editedTitle, postText: editedText }
          : post
      )
    );
    setEditingPostId(null);
  };

  useEffect(() => {
    const getPosts = async () => {
      const q = query(postCollection, orderBy("timestamp", "desc"));
      const data = await getDocs(q);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-GB"); 
  };

  return (
    <div className="container home">
      <h1>Home Page</h1>

      {postLists.map((post) => (
        <div key={post.id} className="post">
          {editingPostId === post.id ? (
            <>
              <input
                type="text"
                className="editable-title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <textarea
                className="editable-text"
                value={editedText}
                rows="4"
                onChange={(e) => setEditedText(e.target.value)}
              ></textarea>
              <div className="edit-actions">
                <button className="save-btn" onClick={() => saveEdit(post.id)}>
                  Save
                </button>{" "}
                <button className="cancel-btn" onClick={cancelEditing}>
                  Cancel
                </button>{" "}
              </div>
            </>
          ) : (
            <>
              <div className="postTitle">{post.title}</div>

              <div
                className="postText"
                dangerouslySetInnerHTML={{ __html: marked(post.postText) }}
              />
              <div className="actions">
                <div className="postAuthor">
                  <div>{post.author.name}</div>
                  <div className="postDate">{formatDate(post.timestamp)}</div>
                </div>
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <div className="action-tasks">
                    <div className="editPost">
                      <button onClick={() => startEditing(post)}>
                        &#9998;
                      </button>{" "}
                    </div>
                    <div className="deletePost">
                      <button onClick={() => deletePost(post.id)}>
                        &#128465;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
