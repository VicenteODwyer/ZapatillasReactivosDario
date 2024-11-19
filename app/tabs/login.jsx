import { StyleSheet } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { useAuth } from '../../firebase/useAuth';
import { auth } from '../../firebase/FirebaseConfig';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { router } from 'expo-router';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Verificar el estado de autenticación
  useEffect(() => {
    const setupAuth = async () => {
      // Configurar la persistencia de Firebase
      await setPersistence(auth, browserLocalPersistence);
    };

    setupAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario está autenticado, redirigir a inicio
        navigation.replace('Home');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigation.navigate('index');
    } catch (err) {
      let errorMessage = 'Error al iniciar sesión';
      
      // Personalizar mensajes de error
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Correo electrónico inválido';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Por favor, intente más tarde';
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('resetPassword');
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
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
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>¿NO TIENES CUENTA? REGÍSTRATE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 35,
    textAlign: 'center',
    color: '#000',
    letterSpacing: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#1a1a1a',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    height: 55,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    backgroundColor: '#333',
  },
  forgotPassword: {
    color: '#000',
    textAlign: 'center',
    marginTop: 25,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  registerLink: {
    marginTop: 25,
  },
  registerText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  }
});