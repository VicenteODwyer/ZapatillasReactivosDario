import { StyleSheet, Platform } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { useAuth } from '../../firebase/useAuth';
import { auth } from '../../firebase/FirebaseConfig';
import { onAuthStateChanged, setPersistence, browserLocalPersistence, signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { useUser } from '../../firebase/useUser';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, loading, error } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { user } = useUser();
  const [userData, setUserData] = useState(null);

  // Verificar el estado de autenticación
  useEffect(() => {
    const setupAuth = async () => {
      // Configurar la persistencia de Firebase
      await setPersistence(auth, browserLocalPersistence);
    };

    setupAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserData({
          nombre: user.displayName || 'Usuario',
          email: user.email
        });
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Limpiar mensaje de error cuando el usuario empiece a escribir
    setErrorMessage('');
  };

  const handleLogin = async () => {
    // Resetear mensaje de error
    setErrorMessage('');

    if (!formData.email || !formData.password) {
      setErrorMessage('Por favor, complete todos los campos');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigation.navigate('index');
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          setErrorMessage('Usuario no encontrado');
          break;
        case 'auth/wrong-password':
          setErrorMessage('Contraseña incorrecta');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Correo electrónico inválido');
          break;
        case 'auth/too-many-requests':
          setErrorMessage('Demasiados intentos fallidos. Por favor, intente más tarde');
          break;
        default:
          setErrorMessage('Error al iniciar sesión');
          console.error('Error detallado:', err);
      }
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('resetPassword');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      Alert.alert('Éxito', 'Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {userData ? (
          <View style={styles.card}>
            <Text style={styles.title}>INFORMACIÓN DEL USUARIO</Text>
            <View style={styles.userInfo}>
              <Text style={styles.userInfoText}>Nombre: {userData.nombre}</Text>
              <Text style={styles.userInfoText}>Email: {userData.email}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>INICIAR SESIÓN</Text>
            
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su correo electrónico"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              editable={!loading}
            />

            {errorMessage ? (
              <Text style={styles.errorMessage}>
                {errorMessage}
              </Text>
            ) : null}

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotPassword}>¿OLVIDASTE TU CONTRASEÑA?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('register')}
              disabled={loading}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>¿NO TIENES CUENTA? REGÍSTRATE</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 32,
    width: '100%',
    maxWidth: 475,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 36 : 32,
    fontWeight: '800',
    marginBottom: 40,
    textAlign: 'center',
    color: '#1a1a1a',
    letterSpacing: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    height: 60,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 24,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  button: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.9,
  },
  forgotPassword: {
    color: '#666666',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  registerLink: {
    marginTop: 24,
  },
  registerText: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorMessage: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
    backgroundColor: 'rgba(255,68,68,0.08)',
    padding: 12,
    borderRadius: 16,
  },
  userInfo: {
    padding: 20,
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF4444', // Color rojo para el botón de cerrar sesión
    marginTop: 30,
  },
});