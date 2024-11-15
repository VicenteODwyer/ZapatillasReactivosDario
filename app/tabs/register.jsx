import { StyleSheet } from 'react-native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Header from '../../components/Header';

export default function RegisterScreen() {
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
          />
          
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su correo electrónico"
          />
          
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su contraseña"
            secureTextEntry
          />
          
          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirme su contraseña"
            secureTextEntry
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    maxWidth: 480,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: '#000',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loginLink: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
  }
});
