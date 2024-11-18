import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Picker, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Header';
import visaIcon from '../../assets/visa-icon.png';
import mastercardIcon from '../../assets/mastercard-icon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InfoCompra = () => {
  const [formData, setFormData] = useState({
    tarjeta: 'Visa',
    numeroTarjeta: '',
    vencimiento: '',
    cvv: '',
    nombre: '',
    apellido: '',
    direccionPrincipal: '',
    direccionAlternativa: '',
    pais: '',
    codigoPostal: ''
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const cargarTotal = async () => {
      try {
        const carritoGuardado = await AsyncStorage.getItem('carrito');
        if (carritoGuardado) {
          const productos = JSON.parse(carritoGuardado);
          const totalCalculado = productos.reduce(
            (sum, producto) => sum + (producto.precio * producto.cantidad), 
            0
          );
          setTotal(totalCalculado);
        }
      } catch (error) {
        console.error('Error al cargar el total:', error);
      }
    };

    cargarTotal();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Lógica para procesar la compra
  };

  const renderTarjetaIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'visa':
        return visaIcon;
      case 'mastercard':
        return mastercardIcon;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <Header />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.columnsContainer}>
            {/* Columna Método de Pago */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Método de Pago</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Selecciona tu tarjeta</Text>
                <View style={styles.pickerContainer}>
                  <View style={styles.pickerWithIcon}>
                    <Image 
                      source={renderTarjetaIcon(formData.tarjeta)}
                      style={styles.cardIcon}
                    />
                    <Picker
                      selectedValue={formData.tarjeta}
                      style={styles.picker}
                      onValueChange={(value) => handleInputChange('tarjeta', value)}
                    >
                      <Picker.Item label="Visa" value="visa" />
                      <Picker.Item label="Mastercard" value="mastercard" />
                    </Picker>
                  </View>
                </View>
                
                <Text style={styles.label}>Número de Tarjeta</Text>
                <TextInput
                  style={styles.input}
                  value={formData.numeroTarjeta}
                  onChangeText={(value) => handleInputChange('numeroTarjeta', value)}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                />
                
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Vencimiento</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.vencimiento}
                      onChangeText={(value) => handleInputChange('vencimiento', value)}
                      placeholder="MM/YY"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>CVV</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.cvv}
                      onChangeText={(value) => handleInputChange('cvv', value)}
                      placeholder="123"
                      keyboardType="numeric"
                      secureTextEntry
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <MaterialIcons name="shopping-cart" size={24} color="white" />
                  <Text style={styles.buttonText}>Finalizar Compra</Text>
                </TouchableOpacity>
                
                <Text style={styles.totalText}>
                  Total a pagar: ${total.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Columna Datos de Envío */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Datos de Envío</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nombre}
                  onChangeText={(value) => handleInputChange('nombre', value)}
                />
                
                <Text style={styles.label}>Apellido</Text>
                <TextInput
                  style={styles.input}
                  value={formData.apellido}
                  onChangeText={(value) => handleInputChange('apellido', value)}
                />
                
                <Text style={styles.label}>Dirección Principal</Text>
                <TextInput
                  style={styles.input}
                  value={formData.direccionPrincipal}
                  onChangeText={(value) => handleInputChange('direccionPrincipal', value)}
                />
                
                <Text style={styles.label}>Dirección Alternativa (opcional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.direccionAlternativa}
                  onChangeText={(value) => handleInputChange('direccionAlternativa', value)}
                />
                
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>País</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.pais}
                      onChangeText={(value) => handleInputChange('pais', value)}
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Código Postal</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.codigoPostal}
                      onChangeText={(value) => handleInputChange('codigoPostal', value)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 30,
    width: '90%',
    maxWidth: 900,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfWidth: {
    width: '48%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  pickerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  cardIcon: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 2,
    borderColor: 'transparent',
  },
  button: {
    backgroundColor: '#FF4D4D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 4,
    marginTop: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    color: '#333',
  },
});

export default InfoCompra;
