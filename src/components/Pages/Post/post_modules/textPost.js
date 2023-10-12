import React, { useState } from 'react';
import { getFirestore, addDoc, collection, Timestamp, doc, getDoc } from "firebase/firestore";
import { auth } from '../../../../firebase';
import './textPost.css';

function TextPost() {
    const [text, setText] = useState('');
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.currentUser) {
            console.error("User not authenticated!");
            return;
        }

        const userId = auth.currentUser.uid;

        try {
            // Fetch username
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                console.error("User document doesn't exist!");
                return;
            }
            const username = userSnap.data().username;

            // Save post with username
            await addDoc(collection(db, "posts"), {
                userId,
                username, // store username with post
                text,
                timestamp: Timestamp.fromDate(new Date())
            });
            console.log("Post successfully added!");
            setText(''); // Clear the text area after posting
        } catch (error) {
            console.error("Error adding post:", error);
        }
    };

    return (
        <div className="post-form-container">
            <h2>Create Post</h2>
            <form onSubmit={handleSubmit} className="post-form">
                <div className="posts-container">
                    <textarea 
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        placeholder="What's on your mind?" 
                        required 
                    />
                </div>
                <button type="submit">Post</button>
            </form>
        </div>
    );
}

export default TextPost;
