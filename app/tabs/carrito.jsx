import { View, Text, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';

const Carrito = () => {
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [codigoPostal, setCodigoPostal] = useState('');

  // Reemplazar useEffect por useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const cargarProductos = async () => {
        try {
          const carritoGuardado = await AsyncStorage.getItem('carrito');
          if (carritoGuardado) {
            setProductos(JSON.parse(carritoGuardado));
          }
        } catch (error) {
          console.error('Error al cargar el carrito:', error);
        }
      };

      cargarProductos();
    }, [])
  );

  // Actualizar AsyncStorage cuando cambian los productos
  const actualizarCarrito = async (nuevosProductos) => {
    try {
      await AsyncStorage.setItem('carrito', JSON.stringify(nuevosProductos));
      setProductos(nuevosProductos);
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
    }
  };

  const handleEliminarProducto = async (id) => {
    const nuevosProductos = productos.filter(producto => producto.id !== id);
    await actualizarCarrito(nuevosProductos);
  };

  const handleCantidadChange = async (id, nuevaCantidad) => {
    const nuevosProductos = productos.map(producto => 
      producto.id === id ? {...producto, cantidad: nuevaCantidad} : producto
    );
    await actualizarCarrito(nuevosProductos);
  };

  const calcularSubtotal = () => {
    return productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.step}>
            <View style={styles.stepIconActive}>
              <Icon name="shopping-cart" size={20} color="#000" />
            </View>
            <Text style={styles.stepTextActive}>Carrito</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.step}>
            <View style={styles.stepIconInactive}>
              <Icon name="credit-card" size={20} color="#999" />
            </View>
            <Text style={styles.stepTextInactive}>Pago</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.productsColumn}>
          <Text style={styles.cartTitle}>
            Mi Carrito <Text style={styles.productCount}>({productos.length} productos)</Text>
          </Text>
          <ScrollView style={styles.productsList}>
            {productos.map((producto) => (
              <View key={producto.id} style={styles.productCard}>
                <Image source={producto.imagen} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productTitle}>{producto.nombre}</Text>
                  <Text style={styles.productSpec}>Talla: {producto.talle}</Text>
                  <Text style={styles.productSpec}>Color: {producto.color}</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleCantidadChange(producto.id, Math.max(1, producto.cantidad - 1))}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{producto.cantidad}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleCantidadChange(producto.id, producto.cantidad + 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleEliminarProducto(producto.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.price}>${producto.precio.toLocaleString()}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.summaryColumn}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen de Compra</Text>
            
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>${calcularSubtotal().toLocaleString()}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text>Envío</Text>
              <Text style={styles.freeShipping}>¡Gratis! 🎁</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text>Total</Text>
              <Text>${calcularSubtotal().toLocaleString()}</Text>
            </View>

            <View style={styles.shippingSection}>
              <Text style={styles.shippingTitle}>
                <Icon name="location-on" size={16} color="#000" /> Calcular tiempo de envío
              </Text>
              <View style={styles.postalCodeRow}>
                <TextInput
                  placeholder="Ingresa tu código postal"
                  value={codigoPostal}
                  onChangeText={setCodigoPostal}
                  style={styles.postalCodeInput}
                />
                <TouchableOpacity style={styles.calculateButton}>
                  <Text>Calcular</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('infoCompra')}
            >
              <Text style={styles.checkoutButtonText}>
                Continuar con la compra
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    marginHorizontal: 30,
    marginVertical: 50,
    borderRadius: 20,
  },
  productsColumn: {
    flex: 3,
    paddingRight: 30,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  productsList: {
    flex: 1,
    scrollbarWidth: 'thin',
    scrollbarColor: '#ff4646 #f0f0f0',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#ff4646',
      borderRadius: '4px',
    },
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 10,
    padding: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 20,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productSpec: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#ff4646',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
  },
  quantity: {
    marginHorizontal: 15,
    fontSize: 15,
  },
  deleteButton: {
    marginLeft: 20,
  },
  deleteText: {
    color: '#ff4646',
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    fontSize: 15,
    fontWeight: '500',
    minWidth: 80,
    textAlign: 'right',
    marginRight: 35,
  },
  summaryColumn: {
    flex: 2,
    paddingLeft: 30,
  },
  summaryCard: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
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
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 5,
  },
  freeShipping: {
    color: '#00b300',
  },
  shippingSection: {
    marginTop: 20,
  },
  shippingTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  postalCodeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  postalCodeInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  checkoutButton: {
    backgroundColor: '#ff4646',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    paddingLeft: 10,
  },
  productCount: {
    fontWeight: '400',
  },
});

export default Carrito;
