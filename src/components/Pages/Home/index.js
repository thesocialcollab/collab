import React, { useState, useEffect } from "react";
import {
    getFirestore,
    query,
    collection,
    orderBy,
    limit,
    getDocs,
    addDoc,
    doc,
    arrayUnion,
    arrayRemove,
    deleteDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { auth } from '../../../firebase';
import './index.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchPosts = async () => {
            // Previous fetching posts logic
            const qPosts = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(10));
            const querySnapshotPosts = await getDocs(qPosts);
            const postData = [];
            querySnapshotPosts.forEach((doc) => {
                postData.push({...doc.data(), id: doc.id}); // Now includes ID
            });
            setPosts(postData);
        };

        const fetchLikedPosts = async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const qLikes = query(collection(db, "users", userId, "likes"));
                const querySnapshotLikes = await getDocs(qLikes);
                const likedData = [];
                querySnapshotLikes.forEach((doc) => {
                    likedData.push(doc.data().postId);
                });
                setLikedPosts(likedData);
            }
        };

        fetchPosts().then(() => {
            fetchLikedPosts();
        });
    }, [db, auth.currentUser]);


    
    const toggleLike = async (postId) => {
        if (!auth.currentUser) {
            console.error("User not authenticated!");
            return;
        }

        const userId = auth.currentUser.uid;

        if (likedPosts.includes(postId)) {
            // UNLIKE
            try {
                // Identify and delete the specific "like" document
                const q = query(collection(db, "users", userId, "likes"), where("postId", "==", postId));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (docSnapshot) => {
                    await deleteDoc(docSnapshot.ref);  // <--- This line is adjusted
                });

                // Update local state
                setLikedPosts(prevLiked => prevLiked.filter(id => id !== postId));
                console.log("Post successfully unliked!");

            } catch (error) {
                console.error("Error unliking post:", error);
            }
        } else {
            // LIKE
            try {
                // Add a new "like" document
                await addDoc(collection(db, "users", userId, "likes"), {
                    postId,
                    timestamp: new Date()
                });

                // Update local state
                setLikedPosts(prevLiked => [...prevLiked, postId]);
                console.log("Post successfully liked!");

            } catch (error) {
                console.error("Error liking post:", error);
            }
        }
    };
    

    return (
        <div className="home-container">
            <h1>Latest Posts</h1>
            {posts.map((post) => (
                <div key={post.id} className="post-container-item">
                    <h3>{post.username}</h3>
                    <p>{post.text}</p>
                    <button 
                        onClick={() => toggleLike(post.id)} 
                        className={`like-button${likedPosts.includes(post.id) ? ' liked' : ''}`}
                    >
                        {likedPosts.includes(post.id) ? 'Liked' : 'Like'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Home;
