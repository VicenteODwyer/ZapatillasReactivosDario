import { StyleSheet, Platform } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase/FirebaseConfig';
import { useUser } from '../../firebase/useUser';
import Header from '../../components/Header';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { createUser } = useUser();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
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

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    // Resetear mensaje de error al inicio
    setErrorMessage('');

    // Validaciones básicas
    if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Por favor, complete todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 2. Crear usuario en Firestore usando useUser
      const userData = {
        uid: userCredential.user.uid,
        nombre: formData.nombre,
        email: formData.email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        role: 'user'
      };

      await createUser(userData);
      setUserData(userData);

      Alert.alert(
        'Éxito',
        'Usuario registrado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {}
          }
        ]
      );
      
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('El correo electrónico ya está registrado');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Correo electrónico inválido');
          break;
        case 'auth/weak-password':
          setErrorMessage('La contraseña debe tener al menos 6 caracteres');
          break;
        case 'auth/network-request-failed':
          setErrorMessage('Error de conexión. Verifica tu internet');
          break;
        default:
          setErrorMessage('Error al registrar usuario. Intenta nuevamente');
          console.error('Error detallado:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header />
      <View style={styles.container}>
        <View style={[styles.content, Platform.OS === 'web' ? styles.webContent : styles.mobileContent]}>
          {userData ? (
            <View style={[styles.card, Platform.OS === 'web' ? styles.webCard : styles.mobileCard]}>
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
            <View style={[styles.card, Platform.OS === 'web' ? styles.webCard : styles.mobileCard]}>
              <Text style={styles.title}>REGISTRO</Text>
              
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese su nombre completo"
                value={formData.nombre}
                onChangeText={(value) => handleInputChange('nombre', value)}
                editable={!loading}
              />
              
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
              
              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirme su contraseña"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
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
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Registrando...' : 'Registrarse'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate('login')}
                disabled={loading}
              >
                <Text style={styles.loginLink}>¿YA TIENES CUENTA? INICIA SESIÓN</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    paddingTop: 40,
  },
  mobileContent: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 32,
    width: '100%',
    maxWidth: 450,
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
  webCard: {
    maxWidth: 480,
    marginHorizontal: 'auto',
  },
  mobileCard: {
    maxWidth: '100%',
    borderRadius: 30,
    padding: 24,
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
  loginLink: {
    color: '#666666',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorMessage: {
    color: '#ff3333',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    marginTop: -5,
    fontWeight: '500',
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
    backgroundColor: '#FF4444',
    marginTop: 30,
  },
});
