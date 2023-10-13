import React, { useState, useEffect } from "react";
import { getFirestore, query, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth } from "../../../firebase";  
import './index.css';
import SingleLikedPost from "./LikedPosts";

const LikedPosts = () => {
    const [likedPosts, setLikedPosts] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchLikedPosts = async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const userLikesQuery = query(collection(db, "users", userId, "likes"));
                const likedIds = [];
                let likedPostsData = [];  // Define likedPostsData
        
                // Get all post IDs that the user has liked
                const querySnapshotLikes = await getDocs(userLikesQuery);
                querySnapshotLikes.forEach((likeDoc) => {
                    likedIds.push(likeDoc.data().postId);
                });
        
                // Fetch each liked post data only if it's not already in the state
                const fetchPromises = likedIds.map(postId => {
                    // Check if the post is already in the state to avoid unnecessary fetches
                    if (!likedPosts.some(p => p.id === postId)) {
                        return getDoc(doc(db, "posts", postId));
                    }
                    return null;  // Return null for posts that are already fetched
                });
        
                const postSnapshots = await Promise.all(fetchPromises);
        
                postSnapshots.forEach((snapshot, index) => {
                    if (snapshot) {
                        if (snapshot.exists()) {
                            likedPostsData.push({ ...snapshot.data(), id: snapshot.id });
                        }
                    } else {
                        // If snapshot is null, the post is already in the state
                        likedPostsData.push(likedPosts.find(p => p.id === likedIds[index]));
                    }
                });
        
                // Remove any potential duplicates before updating state
                const uniqueLikedPosts = Array.from(new Set(likedPostsData.map(p => p.id)))
                    .map(id => likedPostsData.find(p => p.id === id));
        
                // Only update the state if the posts have changed
                if (JSON.stringify(uniqueLikedPosts) !== JSON.stringify(likedPosts)) {
                    setLikedPosts(uniqueLikedPosts);
                }
            }
        };
        
        
        

        fetchLikedPosts();
    }, [db, likedPosts]);

    return (
        <div className="liked-posts-container">
            <h1>Liked Posts</h1>
            {likedPosts.map((post) => (
                <SingleLikedPost key={post.id} post={post} />
            ))}
        </div>
    );
};

export default LikedPosts;
