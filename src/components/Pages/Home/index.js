import React, { useState, useEffect } from "react";
import {
    getFirestore,
    query,
    collection,
    orderBy,
    limit,
    getDocs,
    addDoc,
    deleteDoc,
    where
} from "firebase/firestore";
import { auth } from '../../../firebase';
import { doc } from "firebase/firestore";
import './index.css';
import PostDropdown from "./dropdown";


const Home = () => {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [selectedSort, setSelectedSort] = useState('recommended');
    const db = getFirestore();

    /* Dropdown */
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleDropdownToggle = (postId) => {
        setActiveDropdown(activeDropdown === postId ? null : postId);
    };

    const handleDeletePost = async (postId) => {
        if (!auth.currentUser) {
            console.error("User not authenticated!");
            return;
        }

        try {
            await deleteDoc(doc(db, "posts", postId));
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            console.log("Post successfully deleted!");
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    /* ------ */


    useEffect(() => {
    const fetchPosts = async (type) => {
        let qPosts;

        switch (type) {
            case 'hot':
                qPosts = query(collection(db, "posts"), orderBy("likes", "desc"), limit(10));
                break;
            case 'newest':
                qPosts = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(10));
                break;
            case 'latest':
            default:
                qPosts = query(collection(db, "posts"));
                break;
        }

        const querySnapshotPosts = await getDocs(qPosts);
        let postData = [];
        querySnapshotPosts.forEach((doc) => {
            postData.push({ ...doc.data(), id: doc.id });
        });

        if (type === 'latest') {
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

    // Place the console logs here, right before the return statement
    console.log('Current User ID:', auth.currentUser?.uid);
    console.log('Active Dropdown ID:', activeDropdown);
    posts.forEach(post => {
        console.log(`Post ID: ${post.id}, Post Author ID: ${post.userId}`);
    });
    

    return (
        <div className="home-container">
            <div className="sorting-buttons">
                <button onClick={() => setSelectedSort('recommended')} className={selectedSort === 'recommended' ? 'active' : ''}>Recommended</button>
                <button onClick={() => setSelectedSort('hot')} className={selectedSort === 'hot' ? 'active' : ''}>Hot</button>
                <button onClick={() => setSelectedSort('latest')} className={selectedSort === 'latest' ? 'active' : ''}>Latest</button>
            </div>
            {posts.map((post) => (
                <div key={post.id} className="post-container-item">
                    <div className='post-banner'>
                        <h3>{post.username}</h3>
                        <div className="dropdown-container">
                            <button onClick={() => handleDropdownToggle(post.id)}>...</button>
                            <div className="dropdown-menu">
                                {activeDropdown === post.id && auth.currentUser?.uid === post.userId && (
                                    <PostDropdown onDelete={() => handleDeletePost(post.id)} />
                                )}
                            </div>
                        </div>
                    </div>
                    <p>{post.text}</p>
                    {
                        post.fileType === 'image' && post.fileUrl &&
                        <img className='post-image' src={post.fileUrl} alt="Post" />
                    }
                    {
                        post.fileType === 'audio' && post.fileUrl &&
                        <audio controls>
                            <source src={post.fileUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    }
                        <img 
                            src={`${likedPosts.includes(post.id) ? './images/icons/heartfilled.png' : './images/icons/heart.png'}`} 
                            alt="heart" 
                            onClick={() => toggleLike(post.id)}  
                            className={`like-button${likedPosts.includes(post.id) ? ' liked' : ''}`} 
                        />
                </div>
            ))}

        </div>
    );
};

export default Home;
