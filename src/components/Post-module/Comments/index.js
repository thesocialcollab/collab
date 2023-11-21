import React, { useState, useEffect, useCallback } from "react";
import { getFirestore, collection, query, getDocs, addDoc, getDoc, doc } from "firebase/firestore";
import { auth } from '../../../firebase';
import './index.css';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const db = getFirestore();
    const [username, setUsername] = useState("Anonymous"); // Replace with actual username logic

    // Use useCallback to memoize fetchComments
    const fetchComments = useCallback(async () => {
        const commentsQuery = query(collection(db, "posts", postId, "comments"));
        const querySnapshot = await getDocs(commentsQuery);
        const fetchedComments = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setComments(fetchedComments);
    }, [db, postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Fetch username

    useEffect(() => {
        const fetchUsername = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUsername(userSnap.data().username || "Anonymous");
                }
            }
        };

        fetchUsername();
    }, [db]);


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return; // Prevent empty comments

        try {
            await addDoc(collection(db, "posts", postId, "comments"), {
                text: newComment,
                username: username, // Adding username to the comment
                timestamp: new Date()
            });
            setNewComment(""); // Clear input field after submission
            fetchComments(); // Fetch comments again to include the new one
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <div className="comments-container">
            <form onSubmit={handleCommentSubmit}>
                <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..." 
                />
                <button type="submit">➤</button>
            </form>
            {comments.map(comment => (
                <div key={comment.id} className="comment">
                    <p><strong>{comment.username}</strong>: {comment.text}</p>
                </div>
            ))}
        </div>
    );
};

export default Comments;
