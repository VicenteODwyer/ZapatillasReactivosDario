import { useState } from 'react';
import { 
    signInWithEmailAndPassword, 
    signOut,
    sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from './FirebaseConfig';
import { useUser } from './useUser';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { updateUser } = useUser();

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            
            // Autenticar con Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Actualizar último login en Firestore
            await updateUser(userCredential.user.uid, {
                lastLogin: new Date().toISOString()
            });

            return userCredential.user;
        } catch (err) {
            let errorMessage = '';
            switch (err.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Correo electrónico inválido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Usuario deshabilitado';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Usuario no encontrado';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                default:
                    errorMessage = 'Error al iniciar sesión';
            }
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
        } catch (err) {
            setError('Error al cerrar sesión');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email) => {
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
        } catch (err) {
            let errorMessage = 'Error al enviar el correo de recuperación';
            if (err.code === 'auth/user-not-found') {
                errorMessage = 'No existe una cuenta con este correo electrónico';
            }
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        logout,
        resetPassword,
        loading,
        error
    };
}; 