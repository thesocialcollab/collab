import React, { useState, useEffect } from "react";
import { getFirestore, query, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth } from "../../../firebase";  
import './index.css';
import Posts from "../../Post-module"; // Adjust this import path as needed

const LikedPosts = () => {
    const [likedPosts, setLikedPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]); // State to hold all posts data
    const db = getFirestore();

    useEffect(() => {
        const fetchLikedPosts = async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const userLikesQuery = query(collection(db, "users", userId, "likes"));
                const likedIds = [];
                let likedPostsData = []; 
        
                const querySnapshotLikes = await getDocs(userLikesQuery);
                querySnapshotLikes.forEach((likeDoc) => {
                    likedIds.push(likeDoc.data().postId);
                });
        
                const fetchPromises = likedIds.map(postId => {
                    return getDoc(doc(db, "posts", postId));
                });
        
                const postSnapshots = await Promise.all(fetchPromises);
                postSnapshots.forEach((snapshot) => {
                    if (snapshot?.exists()) {
                        likedPostsData.push({ ...snapshot.data(), id: snapshot.id });
                    }
                });

                setAllPosts(likedPostsData);
                setLikedPosts(likedIds); // Just store the IDs of liked posts
            }
        };

        fetchLikedPosts();
    }, [db]);

    return (
        <div className="liked-posts-container">
            <h1>Liked Posts</h1>
            {allPosts.map((post) => (
                <Posts key={post.id} 
                       post={post} 
                       setPosts={setAllPosts} 
                       likedPosts={likedPosts} 
                       setLikedPosts={setLikedPosts} />
            ))}
        </div>
    );
};

export default LikedPosts;
