import React, { useState } from 'react';
import { getFirestore, addDoc, collection, Timestamp, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from '../../../firebase';
import './index.css';

function Post() {
    const [text, setText] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const db = getFirestore();

    const handleAudioChange = e => {
        if (e.target.files[0]) {
            setAudioFile(e.target.files[0]);
            setImageFile(null); // Reset the image file if audio is chosen
        }
    };

    const handleImageChange = e => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setAudioFile(null); // Reset the audio file if image is chosen
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.currentUser) {
            console.error("User not authenticated!");
            return;
        }

        const userId = auth.currentUser.uid;
        const fileToUpload = audioFile || imageFile;

        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                console.error("User document doesn't exist!");
                return;
            }
            const username = userSnap.data().username;

            let fileUrl = null;
            if (fileToUpload) {
                const storage = getStorage();
                const fileRef = ref(storage, `posts/${userId}/${fileToUpload.name}`);
                const snapshot = await uploadBytes(fileRef, fileToUpload);
                fileUrl = await getDownloadURL(snapshot.ref);
            }

            await addDoc(collection(db, "posts"), {
                userId,
                username,
                text,
                fileUrl, // store file URL with the post
                fileType: fileToUpload ? fileToUpload.type.split('/')[0] : null, // 'audio' or 'image'
                timestamp: Timestamp.fromDate(new Date())
            });
            console.log("Post successfully added!");
            setText('');
            setAudioFile(null);
            setImageFile(null);
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

                  <div className='file-upload'>
                    {!audioFile && !imageFile && (
                        <>
                            <label htmlFor="audio-upload" className="custom-file-upload">
                                🔊
                                <input 
                                    type="file" 
                                    id="audio-upload"
                                    onChange={handleAudioChange} 
                                    accept="audio/*"
                                    style={{ display: 'none' }}
                                />
                            </label>
                            <label htmlFor="image-upload" className="custom-file-upload">
                                🌄
                                <input 
                                    type="file" 
                                    id="image-upload"
                                    onChange={handleImageChange} 
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </>
                    )}
                  </div>
                  {audioFile && <p>Audio File: {audioFile.name}</p>}
                  {imageFile && <p>Image File: {imageFile.name}</p>}
              </div>
              <button type="submit">Post</button>
          </form>
      </div>
  );
}

export default Post;
