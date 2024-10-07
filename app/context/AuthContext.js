import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);  // Removed newData here
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    }, []);

    const updateUserData = async (userId) => {  // Removed newData parameter
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser({
                ...user,
                username: data.username,
                email: data.email || auth.currentUser.email,
                profileUrl: data.profileUrl,
                phoneNumber: data.phoneNumber || '',
                dateOfBirth: data.dateOfBirth || null,
                userId: data.userId,
            });
        }
    };

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
            if (msg.includes('(auth/invalid-credential)')) msg = 'Invalid Login Credentials';
            return { success: false, msg };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, msg: error.message, error: error };
        }
    };

    const register = async (email, password, username, profileUrl, phoneNumber, dateOfBirth) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", response.user.uid), {
                username,
                email,
                profileUrl,
                phoneNumber,   // Ensure phoneNumber is passed
                dateOfBirth,   // Ensure dateOfBirth is passed
                userId: response.user.uid,
            });
            return { success: true, data: response.user };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
            if (msg.includes('(auth/email-already-in-use)')) msg = 'This email is already in use';
            return { success: false, msg };
        }
    };
    

    const updateProfile = async (userId, updates) => {
        const docRef = doc(db, 'users', userId);
        try {
            await updateDoc(docRef, updates);
            return { success: true };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateProfile, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
};