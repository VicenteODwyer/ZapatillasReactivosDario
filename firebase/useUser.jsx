import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { 
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';

export const useUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const usersCollectionRef = collection(db, "users");

    // Crear usuario
    const createUser = async (nombre, email) => {
        try {
            setLoading(true);
            await addDoc(usersCollectionRef, {
                nombre: nombre,
                email: email
            });
        getUsers(); // Actualizar lista después de crear
        } catch (err) {
            setError(err.message);
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
    const updateUser = async (id, nombre, email) => {
        try {
            setLoading(true);
            const userDoc = doc(db, "users", id);
            await updateDoc(userDoc, {
                nombre: nombre,
                email: email
            });
            getUsers(); // Actualizar lista después de modificar
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar usuario
    const deleteUser = async (id) => {
        try {
            setLoading(true);
            const userDoc = doc(db, "users", id);
            await deleteDoc(userDoc);
        getUsers(); // Actualizar lista después de eliminar
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar usuarios al montar el componente
    useEffect(() => {
        getUsers();
    }, []);

    return {
        users,
        loading,
        error,
        createUser,
        updateUser,
        deleteUser
    };
};
