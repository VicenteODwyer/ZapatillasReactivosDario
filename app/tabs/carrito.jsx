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
    let total = 0;
    productos.forEach(producto => {
      total += (producto.precio * producto.cantidad);
    });
    return total;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.stepContainer}>
            <View style={styles.cartIconContainer}>
              <Icon name="shopping-cart" size={24} color="#fff" />
            </View>
            <Text style={styles.stepText}>Carrito</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.stepContainer}>
            <View style={styles.paymentIconContainer}>
              <Icon name="payment" size={24} color="#999" />
            </View>
            <Text style={styles.stepText}>Pago</Text>
          </View>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.cartTitle}>
          Mi Carrito <Text style={styles.productCount}>({productos.length} productos)</Text>
        </Text>
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
              onPress={() => {
                const montoTotal = calcularSubtotal();
                console.log('Monto total a enviar:', montoTotal);
                navigation.navigate('infoCompra', {
                  montoTotal: montoTotal
                });
              }}
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
  backButton: {
    padding: 10,
    marginRight: 15,
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
  paymentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
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
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productCount: {
    fontWeight: '400',
    color: '#666',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 10,
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
    marginBottom: 15,
    marginLeft: 0,
    padding: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
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
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ff4646',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
  },
  calculateButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
});

export default Carrito;
