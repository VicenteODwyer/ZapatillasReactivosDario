import { StyleSheet } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    // Validaciones básicas
    if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
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

      Alert.alert(
        'Éxito',
        'Usuario registrado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('login')
          }
        ]
      );
      
    } catch (error) {
      let errorMessage = 'Error al registrar usuario';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo electrónico ya está registrado';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet';
          break;
        default:
          errorMessage = 'Error al registrar usuario. Intenta nuevamente';
          console.error('Error detallado:', error);
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header />
      <View style={styles.container}>
        <View style={styles.card}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    maxWidth: 480,
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
    marginBottom: 15,
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
  loginLink: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#333',
  }
});
