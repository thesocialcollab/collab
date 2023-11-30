import React, { useState, useEffect, useCallback } from "react";
import { getFirestore, collection, query, getDocs, addDoc, getDoc, doc as firestoreDoc } from "firebase/firestore";
import { auth } from '../../../firebase';
import './index.css';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const db = getFirestore();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (auth.currentUser) {
            setUserId(auth.currentUser.uid);
        }
    }, []);

    const fetchComments = useCallback(async () => {
        const commentsQuery = query(collection(db, "posts", postId, "comments"));
        const querySnapshot = await getDocs(commentsQuery);

        if (!querySnapshot.empty) {
            const commentsWithUsernames = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
                const commentData = docSnapshot.data();
                let username = "Anonymous";

                if (commentData.userId) {
                    const userRef = firestoreDoc(db, "users", commentData.userId);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        username = userSnap.data().username || "Anonymous";
                    }
                }

                return { ...commentData, id: docSnapshot.id, username };
            }));

            setComments(commentsWithUsernames);
        } else {
            setComments([]);
        }
    }, [db, postId]);

    // Add useEffect hook to call fetchComments when the component mounts
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        try {
            await addDoc(collection(db, "posts", postId, "comments"), {
                text: newComment,
                userId: userId,
                timestamp: new Date()
            });
            setNewComment("");
            fetchComments();
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
