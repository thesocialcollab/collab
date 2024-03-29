import React, { useState, useEffect, useCallback } from "react";
import { getFirestore, collection, query, getDocs, addDoc, getDoc, doc as firestoreDoc } from "firebase/firestore";
import { auth } from '../../../firebase';
import './index.css';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const db = getFirestore();
    const [userId, setUserId] = useState(null);

    const [showPrivate, setShowPrivate] = useState(false);

    const privateComments = comments.filter(comment => comment.isPrivate && comment.userId === userId);
    const publicComments = comments.filter(comment => !comment.isPrivate || comment.userId !== userId);

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
                isPrivate: isPrivate,
                timestamp: new Date()
            });
            setNewComment("");
            setIsPrivate(false);
            fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <div className="comments-container">

            <form className="comment-input-container" onSubmit={handleCommentSubmit}>
                <input 
                    className="comment-input"
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..." 
                />
                <div className="comment-options">
                    <button
                        className="lock-button"
                        style={{backgroundColor: isPrivate ? "red" : "green"}}
                        onClick={(e) => { 
                            e.preventDefault();
                            setIsPrivate(!isPrivate);
                        
                        }}
                    >
                        <img src="./images/icons/lock.png" alt="lock"></img>
                    </button>
                    {/*<input
                        type="checkBox"
                        value={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    <img src="./images/icons/lock.png" alt="lock"></img>*/}
                    <button className="submit-button" type="submit">➤</button>
                </div>
            </form>

            <label className="switch">
                <input type="checkbox" checked={showPrivate} onChange={() => setShowPrivate(!showPrivate)} />
                <span className="slider round">
                    <span className="slider-text">Public</span>
                    <span className="slider-text">Private</span>
                </span>
            </label>

            {showPrivate ? (
                privateComments.map(comment => (
                    <div key={comment.id} className="comment">
                        <p><strong>{comment.username}</strong>: {comment.text}</p>
                    </div>
                ))
            ) : (
                publicComments.map(comment => (
                    <div key={comment.id} className="comment">
                        <p><strong>{comment.username}</strong>: {comment.text}</p>
                    </div>
                ))

            )}
            {/** {comments.map(comment => (
                <div key={comment.id} className="comment">
                    <p><strong>{comment.username}</strong>: {comment.text}</p>
                </div>
            ))} */}
        </div>
    );
};

export default Comments;
