import React, { useState, useEffect } from "react";
import {
    getFirestore,
    query,
    collection,
    orderBy,
    limit,
    getDocs,
} from "firebase/firestore";
import { auth } from '../../../firebase';
import './index.css';
import Posts from '../../Post-module';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [selectedSort, setSelectedSort] = useState('recommended');
    const db = getFirestore();

    useEffect(() => {
        const fetchPosts = async (type) => {
            let qPosts;
            switch (type) {
                case 'hot':
                    qPosts = query(collection(db, "posts"), orderBy("likes", "desc"), limit(10));
                    break;
                case 'latest':
                    qPosts = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(10));
                    break;
                case 'recommended':
                default:
                    qPosts = query(collection(db, "posts"));
                    break;
            }

            const querySnapshotPosts = await getDocs(qPosts);
            let postData = [];
            querySnapshotPosts.forEach((doc) => {
                postData.push({ ...doc.data(), id: doc.id });
            });

            if (type === 'recommended') {
                postData = postData.sort(() => Math.random() - 0.5);
            }

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

        fetchPosts(selectedSort).then(fetchLikedPosts);
    }, [db, selectedSort]);

    return (
        <div className="home-container">
            <div className="sorting-buttons">
                <button onClick={() => setSelectedSort('recommended')} className={selectedSort === 'recommended' ? 'active' : ''}>Recommended</button>
                <button onClick={() => setSelectedSort('hot')} className={selectedSort === 'hot' ? 'active' : ''}>Hot</button>
                <button onClick={() => setSelectedSort('latest')} className={selectedSort === 'latest' ? 'active' : ''}>Latest</button>
            </div>
            {posts.map((post) => (
                <Posts 
                    key={post.id}
                    post={post}
                    setPosts={setPosts}
                    likedPosts={likedPosts}
                    setLikedPosts={setLikedPosts}
                />
            ))}
        </div>
    );
};

export default Home;
