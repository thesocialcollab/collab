import { getFirestore, collection, getDocs, updateDoc } from "firebase/firestore";

const db = getFirestore();

const updateComments = async () => {
    const commentsSnapshot = await getDocs(collection(db, "comments"));
    commentsSnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            isPrivate: false
        });
    });
};

updateComments();