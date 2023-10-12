import React, { useState, useEffect } from "react";
import { getFirestore, query, collection, orderBy, limit, getDocs } from "firebase/firestore";
import './index.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchPosts = async () => {
            const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(10));
            const querySnapshot = await getDocs(q);
            const postData = [];
            querySnapshot.forEach((doc) => {
                postData.push(doc.data());
            });
            setPosts(postData);
        };

        fetchPosts();
    }, [db]);

    return (
        <div className="home-container">
            <h1>Latest Posts</h1>
            {posts.map((post, index) => (
                <div key={index} className="post-container-item">
                    <h3>{post.username}</h3>
                    <p>{post.text}</p>
                </div>
            ))}
        </div>
    );
};

export default Home;
