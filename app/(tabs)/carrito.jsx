import { View, Text, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, Platform } from 'react-native';

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
          <Icon name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('index')} 
          style={styles.homeButton}
        >
          <Icon name="home" size={32} color="#000" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.stepContainer}>
            <View style={[styles.iconContainer, styles.activeIcon]}>
              <Icon name="shopping-cart" size={24} color="#fff" />
            </View>
            <Text style={[styles.stepText, styles.activeText]}>Carrito</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.stepContainer}>
            <View style={[styles.iconContainer, styles.inactiveIcon]}>
              <Icon name="payment" size={24} color="#999" />
            </View>
            <Text style={styles.stepText}>Pago</Text>
          </View>
        </View>
      </View>

      <View style={[styles.mainContainer, Platform.OS === 'web' ? styles.webMainContainer : styles.mobileMainContainer]}>
        <View style={[
          styles.productsColumn,
          Platform.OS === 'web' ? styles.webProductsColumn : styles.mobileProductsColumn
        ]}>
          <ScrollView style={styles.productsList}>
            {productos.map((producto) => (
              <View key={producto.id} style={styles.productCard}>
                <Image source={producto.imagen} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productTitle}>{producto.nombre}</Text>
                  <Text style={styles.productSpec}>Talle: {producto.talle}</Text>
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

        <View style={[
          styles.summaryColumn,
          Platform.OS === 'web' ? styles.webSummaryColumn : styles.mobileSummaryColumn
        ]}>
          <View style={styles.summaryCard}>
            <View style={styles.titleContainer}>
              <Text style={styles.cartTitle}>
                Mi Carrito <Text style={styles.productCount}>({productos.length} productos)</Text>
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Subtotal</Text>
              <Text>${calcularSubtotal().toLocaleString()}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Envío</Text>
              <Text style={styles.freeShipping}>¡Gratis! 🎁</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalAmount}>${calcularSubtotal().toLocaleString()}</Text>
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
              onPress={() => navigation.navigate('infoCompra', { montoTotal: calcularSubtotal() })}
            >
              <Text style={styles.checkoutButtonText}>Continuar con la compra</Text>
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
    paddingHorizontal: Platform.OS === 'web' ? 16 : 10,
    paddingVertical: Platform.OS === 'web' ? 12 : 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeIcon: {
    backgroundColor: '#ff4646',
  },
  inactiveIcon: {
    backgroundColor: '#f5f5f5',
  },
  progressLine: {
    width: 80,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  stepText: {
    fontSize: 14,
    color: '#999',
    marginTop: 6,
  },
  activeText: {
    color: '#000',
    fontWeight: '500',
  },
  mainContainer: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginVertical: 20,
    borderRadius: 10,
  },
  
  // Estilos específicos para web
  webMainContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginHorizontal: 20,
  },
  
  // Estilos específicos para móvil
  mobileMainContainer: {
    flexDirection: 'column',
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },

  productsColumn: {
    gap: 20,
  },

  webProductsColumn: {
    flex: 2,
  },

  mobileProductsColumn: {
    flex: 1,
  },

  summaryColumn: {
    marginTop: Platform.OS === 'web' ? 0 : 20,
  },

  webSummaryColumn: {
    flex: 1,
    marginLeft: 20,
  },

  mobileSummaryColumn: {
    flex: 0,
  },

  productCard: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    padding: Platform.OS === 'web' ? 20 : 15,
    borderRadius: Platform.OS === 'web' ? 0 : 12,
    marginBottom: Platform.OS === 'web' ? 0 : 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  productImage: {
    width: Platform.OS === 'web' ? 100 : '100%',
    height: Platform.OS === 'web' ? 100 : 250,
    resizeMode: 'contain',
    backgroundColor: '#f9f9f9',
    borderRadius: Platform.OS === 'web' ? 8 : 12,
  },

  productDetails: {
    flex: 1,
    marginLeft: Platform.OS === 'web' ? 20 : 0,
    marginTop: Platform.OS === 'web' ? 0 : 15,
    alignItems: Platform.OS === 'web' ? 'flex-start' : 'center',
  },

  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  productSpec: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center',
    width: '100%',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  quantity: {
    fontSize: 15,
    fontWeight: '500',
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    marginLeft: 20,
    paddingVertical: Platform.OS === 'web' ? 6 : 8,
    paddingHorizontal: Platform.OS === 'web' ? 12 : 15,
    backgroundColor: '#fff0f0',
    borderRadius: 20,
  },
  deleteText: {
    color: '#ff4646',
    fontSize: Platform.OS === 'web' ? 14 : 15,
    fontWeight: '500',
  },
  price: {
    fontSize: Platform.OS === 'web' ? 16 : 18,
    fontWeight: '700',
    color: '#333',
    minWidth: Platform.OS === 'web' ? 90 : '100%',
    textAlign: Platform.OS === 'web' ? 'right' : 'center',
    marginTop: Platform.OS === 'web' ? 0 : 10,
  },
  summaryCard: {
    padding: Platform.OS === 'web' ? 20 : 12,
    backgroundColor: '#fff',
    borderRadius: Platform.OS === 'web' ? 8 : 12,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#eee',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 12 : 8,
    paddingVertical: Platform.OS === 'web' ? 4 : 2,
  },
  summaryText: {
    fontSize: Platform.OS === 'web' ? 15 : 14,
    color: '#666',
  },
  freeShipping: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2ECC71', // Verde más bonito
    backgroundColor: '#E8F8F5', // Fondo verde claro
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: Platform.OS === 'web' ? 15 : 10,
    marginTop: Platform.OS === 'web' ? 10 : 8,
  },
  totalText: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '700',
    color: '#333',
  },
  shippingSection: {
    marginTop: 20,
  },
  shippingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  postalCodeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  postalCodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'web' ? 10 : 12,
    fontSize: Platform.OS === 'web' ? 14 : 16,
    backgroundColor: '#f9f9f9',
  },
  calculateButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'web' ? 10 : 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: Platform.OS === 'web' ? 'auto' : 100,
  },
  checkoutButton: {
    backgroundColor: '#ff4646',
    padding: Platform.OS === 'web' ? 15 : 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ff4646',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: Platform.OS === 'web' ? 15 : 16,
  },
  titleContainer: {
    paddingHorizontal: Platform.OS === 'web' ? 30 : 15,
    paddingVertical: Platform.OS === 'web' ? 20 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  cartTitle: {
    fontSize: Platform.OS === 'web' ? 24 : 18,
    fontWeight: '600',
    color: '#333',
    textAlign: Platform.OS === 'web' ? 'left' : 'center',
    marginBottom: Platform.OS === 'web' ? 0 : 5,
  },
  productCount: {
    fontSize: Platform.OS === 'web' ? 20 : 16,
    fontWeight: '400',
    color: '#666',
  },
});

export default Carrito;
