import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Picker, Image, ScrollView, Alert, Dimensions, Modal, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Header';
import visaIcon from '../../assets/visa-icon.png';
import mastercardIcon from '../../assets/mastercard-icon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const isMobile = windowWidth < 768;

const InfoCompra = () => {
  const navigation = useNavigation();

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
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const progressAnimation = useRef(new Animated.Value(0)).current;

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
    let limitedValue = value;
    
    switch (name) {
      case 'numeroTarjeta':
        // Eliminar caracteres no numéricos y limitar a 16 dígitos
        const cardNumbers = value.replace(/\D/g, '').slice(0, 16);
        
        // Formatear con guiones cada 4 dígitos
        const parts = [];
        for (let i = 0; i < cardNumbers.length; i += 4) {
          parts.push(cardNumbers.slice(i, i + 4));
        }
        limitedValue = parts.join('-');
        break;
      case 'vencimiento':
        // Si estamos borrando
        if (value.length < formData.vencimiento.length) {
          // Si estamos borrando justo después de la barra
          if (value.length === 3) {
            limitedValue = value.substring(0, 2);
          } else {
            // Para cualquier otro caso de borrado, mantener el valor tal cual
            limitedValue = value;
          }
        } else {
          // Eliminar caracteres no numéricos
          limitedValue = value.replace(/\D/g, '');
          
          // Validar el primer dígito del mes
          if (limitedValue.length === 1) {
            const firstDigit = parseInt(limitedValue);
            if (firstDigit > 1) {
              limitedValue = '0' + firstDigit;
            }
          }
          
          // Validar el segundo dígito del mes
          if (limitedValue.length >= 2) {
            const firstDigit = parseInt(limitedValue.substring(0, 1));
            const secondDigit = parseInt(limitedValue.substring(1, 2));
            
            if (firstDigit === 1 && secondDigit > 2) {
              limitedValue = limitedValue.substring(0, 1);
            } else if (firstDigit === 0 && secondDigit === 0) {
              limitedValue = limitedValue.substring(0, 1);
            }
          }
          
          // Formatear como MM/YY
          if (limitedValue.length >= 2) {
            limitedValue = limitedValue.substring(0, 2) + '/' + limitedValue.substring(2, 4);
          }
        }
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
        // Eliminar todo excepto números
        const numericValue = value.replace(/\D/g, '');
        
        // Si no hay números, devolver string vacío
        if (numericValue.length === 0) {
          limitedValue = '';
        }
        // Formatear el número según el patrón
        else if (numericValue.length <= 2) {
          limitedValue = `+${numericValue}`;
        } else if (numericValue.length <= 5) {
          limitedValue = `+${numericValue.slice(0, 2)} (${numericValue.slice(2)}`;
        } else if (numericValue.length <= 9) {
          limitedValue = `+${numericValue.slice(0, 2)} (${numericValue.slice(2, 5)}) ${numericValue.slice(5)}`;
        } else {
          limitedValue = `+${numericValue.slice(0, 2)} (${numericValue.slice(2, 5)}) ${numericValue.slice(5, 9)}-${numericValue.slice(9, 13)}`;
        }
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
    
    // Limpiar errores después de 3 segundos
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        setErrors({});
      }, 7000);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const startProgressAnimation = () => {
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start();
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowThankYouModal(true);
      startProgressAnimation();
      setTimeout(() => {
        setShowThankYouModal(false);
        navigation.navigate('index');
      }, 5000);
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
        <TouchableOpacity 
          style={{ marginLeft: 10 }}
          onPress={() => navigation.navigate('carrito')}
        >
          <Icon name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ marginLeft: 35 }} 
          onPress={() => navigation.navigate('index')}
        >
          <Icon name="home" size={32} color="#000" />
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
                  placeholder="+54 (299) 1234-5678"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={formData.telefono}
                  onChangeText={(value) => {
                    handleInputChange('telefono', value);
                    setErrors(prev => ({...prev, telefono: null}));
                  }}
                  maxLength={20}
                />
                {errors.telefono && (
                  <Text style={styles.errorText}>{errors.telefono}</Text>
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.rightColumn}>
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
                  placeholder="5367-5555-9012-3456"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={formData.numeroTarjeta}
                  onChangeText={(value) => {
                    handleInputChange('numeroTarjeta', value);
                    setErrors(prev => ({...prev, numeroTarjeta: null}));
                  }}
                  maxLength={19}
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
                      // Eliminar la barra diagonal al procesar el input
                      const numericValue = value.replace(/\//g, '');
                      handleInputChange('vencimiento', numericValue);
                      setErrors(prev => ({...prev, vencimiento: null}));
                    }}
                    maxLength={5}
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
          </View>
        </View>
      </ScrollView>

      {/* Modal de agradecimiento */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showThankYouModal}
        onRequestClose={() => setShowThankYouModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="check-circle" size={60} color="#4CAF50" />
            <Text style={styles.modalTitle}>¡Gracias por tu compra!</Text>
            <Text style={styles.modalText}>
              Tu pedido ha sido procesado correctamente
            </Text>
            <View style={styles.loadingBar}>
              <Animated.View 
                style={[
                  styles.loadingProgress,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]} 
              />
            </View>
          </View>
        </View>
      </Modal>
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
    marginTop: 20,
    marginHorizontal: isMobile ? 10 : 30,
  },
  contentWrapper: {
    flexDirection: isMobile ? 'column' : 'row',
    padding: isMobile ? 15 : 30,
    gap: 30,
  },
  formColumn: {
    flex: 3,
    paddingRight: isMobile ? 0 : 30,
    borderRightWidth: isMobile ? 0 : 1,
    borderRightColor: '#eee',
  },
  rightColumn: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  summaryCard: {
    padding: isMobile ? 15 : 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: isMobile ? 20 : 0,
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
    padding: isMobile ? 12 : 15,
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
    padding: isMobile ? 15 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: isMobile ? 18 : 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: isMobile ? 15 : 20,
  },
  cardSelector: {
    flexDirection: 'row',
    gap: isMobile ? 10 : 15,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  cardSelectorError: {
    borderColor: '#ff4646',
  },
  cardOption: {
    flex: isMobile ? 0 : 1,
    width: isMobile ? '47%' : 'auto',
    padding: isMobile ? 12 : 15,
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
    padding: isMobile ? 12 : 15,
    fontSize: isMobile ? 14 : 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  row: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 15,
    marginBottom: 20,
  },
  halfWidth: {
    flex: isMobile ? 0 : 1,
    width: isMobile ? '100%' : 'auto',
  },
  personalDataSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: isMobile ? 15 : 20,
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
  },
  // Nuevos estilos para móvil
  mobileContentWrapper: {
    flexDirection: 'column',
    padding: 15,
  },
  mobileFormColumn: {
    paddingRight: 0,
    borderRightWidth: 0,
    marginBottom: 20,
  },
  mobileRightColumn: {
    paddingLeft: 0,
  },
  mobileInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
  mobileRow: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 15,
  },
  mobileCardSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  mobileCardOption: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: isMobile ? '85%' : '40%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    animation: 'slide 5s linear',
  },
  '@keyframes slide': {
    from: {
      width: '0%',
    },
    to: {
      width: '100%',
    },
  },
});

export default InfoCompra;
