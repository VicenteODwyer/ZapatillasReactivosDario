import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Picker, Image, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Header';
import visaIcon from '../../assets/visa-icon.png';
import mastercardIcon from '../../assets/mastercard-icon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InfoCompra = () => {
  const [formData, setFormData] = useState({
    tarjeta: '',
    numeroTarjeta: '',
    vencimiento: '',
    cvv: '',
    nombre: '',
    apellido: '',
    direccionPrincipal: '',
    direccionAlternativa: '',
    pais: '',
    codigoPostal: '',
    ciudad: '',
    email: ''
  });

  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({});

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
    // Aplicar límites según el campo
    let limitedValue = value;
    
    switch (name) {
      case 'numeroTarjeta':
        limitedValue = value.replace(/\D/g, '').slice(0, 16);
        break;
      case 'vencimiento':
        limitedValue = value.replace(/\D/g, '').slice(0, 4);
        break;
      case 'cvv':
        limitedValue = value.replace(/\D/g, '').slice(0, 3);
        break;
      case 'nombre':
      case 'apellido':
        limitedValue = value.slice(0, 30);
        break;
      case 'codigoPostal':
        limitedValue = value.replace(/\D/g, '').slice(0, 5);
        break;
      case 'telefono':
        limitedValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      default:
        limitedValue = value;
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: limitedValue
    }));
  };

  const handleCardSelection = (tipo) => {
    setFormData(prevData => ({
      ...prevData,
      tarjeta: tipo
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Agregar validación de tarjeta al inicio
    if (!formData.tarjeta) newErrors.tarjeta = 'Seleccione una tarjeta';
    
    // Validar campos obligatorios
    if (!formData.numeroTarjeta) newErrors.numeroTarjeta = 'Ingrese el número de tarjeta';
    if (!formData.vencimiento) newErrors.vencimiento = 'Ingrese el vencimiento';
    if (!formData.cvv) newErrors.cvv = 'Ingrese el CVV';
    if (!formData.nombre) newErrors.nombre = 'Ingrese su nombre';
    if (!formData.apellido) newErrors.apellido = 'Ingrese su apellido';
    if (!formData.direccionPrincipal) newErrors.direccionPrincipal = 'Ingrese su dirección';
    if (!formData.ciudad) newErrors.ciudad = 'Ingrese su ciudad';
    if (!formData.codigoPostal) newErrors.codigoPostal = 'Ingrese el código postal';
    if (!formData.email) newErrors.email = 'Ingrese su email';
    if (!formData.telefono) newErrors.telefono = 'Ingrese su teléfono';

    // Validación adicional para el formato del email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Continuar con la compra
      console.log('Formulario válido, procediendo con la compra');
    } else {
      Alert.alert(
        "Error",
        "Por favor complete todos los campos obligatorios",
        [{ text: "OK" }]
      );
    }
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

  // Actualizar los estilos del input según si hay error
  const getInputStyle = (fieldName) => {
    return [
      styles.input,
      errors[fieldName] && styles.inputError
    ];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.stepContainer}>
            <View style={styles.cartIconContainer}>
              <Icon name="shopping-cart" size={24} color="#999" />
            </View>
            <Text style={styles.stepText}>Carrito</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.stepContainer}>
            <View style={styles.paymentIconContainer}>
              <Icon name="payment" size={24} color="#fff" />
            </View>
            <Text style={styles.stepText}>Pago</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.mainContainer}>
        <View style={styles.contentWrapper}>
          <View style={styles.formColumn}>
            <View style={styles.paymentSection}>
              <Text style={styles.sectionTitle}>
                Método de Pago <Text style={styles.requiredField}>*</Text>
              </Text>
              
              <View style={[
                styles.cardSelector,
                errors.tarjeta && styles.cardSelectorError
              ]}>
                <TouchableOpacity 
                  onPress={() => {
                    handleCardSelection('visa');
                    setErrors(prev => ({...prev, tarjeta: null}));
                  }}
                  style={[
                    styles.cardOption, 
                    formData.tarjeta === 'visa' && styles.cardOptionSelected
                  ]}>
                  <Image source={visaIcon} style={styles.cardIcon} />
                  <Text style={styles.cardText}>Visa</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    handleCardSelection('mastercard');
                    setErrors(prev => ({...prev, tarjeta: null}));
                  }}
                  style={[
                    styles.cardOption, 
                    formData.tarjeta === 'mastercard' && styles.cardOptionSelected
                  ]}>
                  <Image source={mastercardIcon} style={styles.cardIcon} />
                  <Text style={styles.cardText}>Mastercard</Text>
                </TouchableOpacity>
              </View>
              
              {errors.tarjeta && (
                <Text style={styles.errorText}>{errors.tarjeta}</Text>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Número de Tarjeta</Text>
                <TextInput 
                  style={getInputStyle('numeroTarjeta')}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={formData.numeroTarjeta}
                  onChangeText={(value) => {
                    handleInputChange('numeroTarjeta', value);
                    setErrors(prev => ({...prev, numeroTarjeta: null}));
                  }}
                  maxLength={16}
                />
                {errors.numeroTarjeta && (
                  <Text style={styles.errorText}>{errors.numeroTarjeta}</Text>
                )}
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.inputLabel}>Vencimiento</Text>
                  <TextInput 
                    style={getInputStyle('vencimiento')}
                    placeholder="MM/YY"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={formData.vencimiento}
                    onChangeText={(value) => {
                      handleInputChange('vencimiento', value);
                      setErrors(prev => ({...prev, vencimiento: null}));
                    }}
                    maxLength={4}
                  />
                  {errors.vencimiento && (
                    <Text style={styles.errorText}>{errors.vencimiento}</Text>
                  )}
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput 
                    style={getInputStyle('cvv')}
                    placeholder="123"
                    placeholderTextColor="#999"
                    secureTextEntry
                    keyboardType="numeric"
                    value={formData.cvv}
                    onChangeText={(value) => {
                      handleInputChange('cvv', value);
                      setErrors(prev => ({...prev, cvv: null}));
                    }}
                    maxLength={3}
                  />
                  {errors.cvv && (
                    <Text style={styles.errorText}>{errors.cvv}</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.personalDataSection}>
              <Text style={styles.sectionTitle}>Datos Personales</Text>
              
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.inputLabel}>Nombre</Text>
                  <TextInput 
                    style={getInputStyle('nombre')}
                    placeholder="Juan"
                    placeholderTextColor="#999"
                    value={formData.nombre}
                    onChangeText={(value) => {
                      handleInputChange('nombre', value);
                      setErrors(prev => ({...prev, nombre: null}));
                    }}
                    maxLength={30}
                  />
                  {errors.nombre && (
                    <Text style={styles.errorText}>{errors.nombre}</Text>
                  )}
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.inputLabel}>Apellido</Text>
                  <TextInput 
                    style={getInputStyle('apellido')}
                    placeholder="Pérez"
                    placeholderTextColor="#999"
                    value={formData.apellido}
                    onChangeText={(value) => {
                      handleInputChange('apellido', value);
                      setErrors(prev => ({...prev, apellido: null}));
                    }}
                    maxLength={30}
                  />
                  {errors.apellido && (
                    <Text style={styles.errorText}>{errors.apellido}</Text>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Dirección de Facturación <Text style={styles.requiredField}>*</Text>
                </Text>
                <TextInput 
                  style={getInputStyle('direccionPrincipal')}
                  placeholder="Calle y número"
                  placeholderTextColor="#999"
                  value={formData.direccionPrincipal}
                  onChangeText={(value) => {
                    handleInputChange('direccionPrincipal', value);
                    setErrors(prev => ({...prev, direccionPrincipal: null}));
                  }}
                />
                {errors.direccionPrincipal && (
                  <Text style={styles.errorText}>{errors.direccionPrincipal}</Text>
                )}
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.inputLabel}>
                    Ciudad <Text style={styles.requiredField}>*</Text>
                  </Text>
                  <TextInput 
                    style={getInputStyle('ciudad')}
                    placeholder="Ciudad"
                    placeholderTextColor="#999"
                    value={formData.ciudad}
                    onChangeText={(value) => {
                      handleInputChange('ciudad', value);
                      setErrors(prev => ({...prev, ciudad: null}));
                    }}
                  />
                  {errors.ciudad && (
                    <Text style={styles.errorText}>{errors.ciudad}</Text>
                  )}
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.inputLabel}>Código Postal</Text>
                  <TextInput 
                    style={getInputStyle('codigoPostal')}
                    placeholder="12345"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={formData.codigoPostal}
                    onChangeText={(value) => {
                      handleInputChange('codigoPostal', value);
                      setErrors(prev => ({...prev, codigoPostal: null}));
                    }}
                    maxLength={5}
                  />
                  {errors.codigoPostal && (
                    <Text style={styles.errorText}>{errors.codigoPostal}</Text>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Email <Text style={styles.requiredField}>*</Text>
                </Text>
                <TextInput 
                  style={getInputStyle('email')}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(value) => {
                    handleInputChange('email', value);
                    setErrors(prev => ({...prev, email: null}));
                  }}
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Teléfono</Text>
                <TextInput 
                  style={getInputStyle('telefono')}
                  placeholder="+54 (11) 1234-5678"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={formData.telefono}
                  onChangeText={(value) => {
                    handleInputChange('telefono', value);
                    setErrors(prev => ({...prev, telefono: null}));
                  }}
                  maxLength={10}
                />
                {errors.telefono && (
                  <Text style={styles.errorText}>{errors.telefono}</Text>
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.summaryColumn}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumen de Compra</Text>
              <View style={styles.summaryRow}>
                <Text>Total a Pagar</Text>
                <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
              </View>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleSubmit}>
                <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  cartIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff4646',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  progressLine: {
    width: 100,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 15,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentWrapper: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  formColumn: {
    flex: 3,
    paddingRight: 30,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  summaryColumn: {
    flex: 2,
    paddingLeft: 30,
  },
  summaryCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#ff4646',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  paymentSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  cardSelector: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
    padding: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardSelectorError: {
    borderColor: '#ff4646',
  },
  cardOption: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  cardOptionSelected: {
    borderColor: '#ff4646',
    backgroundColor: '#fff5f5',
  },
  cardIcon: {
    width: 40,
    height: 25,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  personalDataSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputError: {
    borderColor: '#ff4646',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff4646',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  requiredField: {
    color: '#ff4646',
    marginLeft: 4,
  }
});

export default InfoCompra;
