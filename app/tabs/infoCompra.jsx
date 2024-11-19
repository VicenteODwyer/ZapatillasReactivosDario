import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Picker, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Header';
import visaIcon from '../../assets/visa-icon.png';
import mastercardIcon from '../../assets/mastercard-icon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

    // Cargar inicial
    cargarTotal();

    // Configurar un intervalo para verificar cambios
    const interval = setInterval(cargarTotal, 1000); // Verifica cada segundo

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.step}>
            <View style={styles.stepIconInactive}>
              <Icon name="shopping-cart" size={20} color="#999" />
            </View>
            <Text style={styles.stepTextInactive}>Carrito</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.step}>
            <View style={styles.stepIconActive}>
              <Icon name="credit-card" size={20} color="#000" />
            </View>
            <Text style={styles.stepTextActive}>Pago</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.mainContent}>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  mainContent: {
    flex: 1,
    marginTop: 30,
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 35,
    width: '90%',
    maxWidth: 900,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
    fontWeight: '600',
    marginBottom: 25,
    color: '#2d3436',
    borderBottom: '2px solid #f1f2f6',
    paddingBottom: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#4a4a4a',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 8,
    padding: 14,
    marginBottom: 18,
    backgroundColor: 'white',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    borderColor: '#e1e4e8',
    borderRadius: 8,
    marginBottom: 18,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#FF4D4D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    marginLeft: 10,
    fontWeight: '600',
  },
  totalText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 30,
    color: '#2d3436',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  backButton: {
    padding: 5,
  },
  progressBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -24,
  },
  step: {
    alignItems: 'center',
  },
  stepIconActive: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 2.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepIconInactive: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 2.5,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLine: {
    width: 100,
    height: 2.5,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 15,
  },
  stepTextActive: {
    fontSize: 12,
    marginTop: 4,
    color: '#000',
  },
  stepTextInactive: {
    fontSize: 12,
    marginTop: 4,
    color: '#999',
  },
});

export default InfoCompra;
