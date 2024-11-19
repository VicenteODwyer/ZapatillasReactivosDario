import { useState, useEffect } from 'react';
import { db } from './FirebaseConfig';
import { 
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    setDoc
} from 'firebase/firestore';

export const useUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const usersCollectionRef = collection(db, "users");

    // Crear usuario
    const createUser = async (userData) => {
        try {
            setLoading(true);
            // Usar setDoc con el UID como ID del documento
            const userRef = doc(db, "users", userData.uid);
            await setDoc(userRef, {
                nombre: userData.nombre,
                email: userData.email,
                createdAt: userData.createdAt,
                lastLogin: userData.lastLogin,
                role: userData.role
            });
            
            await getUsers(); // Actualizar lista después de crear
            return userRef;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Obtener usuarios
    const getUsers = async () => {
        try {
            setLoading(true);
            const data = await getDocs(usersCollectionRef);
            const usersData = data.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Actualizar usuario
    const updateUser = async (uid, userData) => {
        try {
            setLoading(true);
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                ...userData,
                updatedAt: new Date().toISOString()
            });
            await getUsers();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Eliminar usuario
    const deleteUser = async (uid) => {
        try {
            setLoading(true);
            const userRef = doc(db, "users", uid);
            await deleteDoc(userRef);
            await getUsers();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Obtener un usuario específico
    const getUserById = async (uid) => {
        try {
            setLoading(true);
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                return { id: userSnap.id, ...userSnap.data() };
            }
            return null;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return {
        users,
        loading,
        error,
        createUser,
        updateUser,
        deleteUser,
        getUsers,
        getUserById
    };
};
