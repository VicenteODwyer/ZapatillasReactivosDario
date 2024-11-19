import { View, Text, Image, Pressable, Modal, ScrollView, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';

const Compra = () => {
  const route = useRoute();
  const navigation = useNavigation();
  console.log('Parámetros recibidos:', route.params);
  const { zapatilla } = route.params || {};
  const [cantidad, setCantidad] = useState(1);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  if (!zapatilla) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No se encontró información del producto</Text>
      </View>
    );
  }

  const talles = [40, 41, 42, 43, 44];
  const precioConDescuento = zapatilla.precio * 0.9;

  const handleAgregarCarrito = async () => {
    if (!talleSeleccionado) {
      setShowError(true);
      return;
    }

    const productoParaCarrito = {
      id: `${zapatilla.id}-${talleSeleccionado}`,
      nombre: zapatilla.nombre,
      precio: zapatilla.precio,
      imagen: zapatilla.imagen,
      talle: talleSeleccionado,
      cantidad: cantidad,
      color: "Por definir"
    };

    try {
      // Obtener carrito actual
      const carritoActual = await AsyncStorage.getItem('carrito');
      let productos = carritoActual ? JSON.parse(carritoActual) : [];
      
      // Verificar si el producto ya existe con el mismo talle
      const productoExistente = productos.findIndex(
        p => p.id === productoParaCarrito.id
      );

      if (productoExistente !== -1) {
        // Actualizar cantidad si existe
        productos[productoExistente].cantidad += cantidad;
      } else {
        // Agregar nuevo producto si no existe
        productos.push(productoParaCarrito);
      }
      
      // Guardar carrito actualizado
      await AsyncStorage.setItem('carrito', JSON.stringify(productos));
      
      setModalVisible(true);
    } catch (error) {
      console.error('Error al guardar en el carrito:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ 
          padding: isMobile ? 10 : 20,
          alignItems: 'center'
        }}>
          {/* Contenedor principal */}
          <View style={{ 
            width: '100%',
            maxWidth: 1200,
            flexDirection: isMobile ? 'column' : 'row',
            gap: 30,
          }}>
            {/* Sección izquierda - Imágenes */}
            <View style={{ 
              width: isMobile ? '100%' : '50%',
              alignItems: 'center'
            }}>
              {/* Imagen principal */}
              <View style={{
                width: '100%',
                backgroundColor: '#fff',
                borderRadius: 15,
                padding: isMobile ? 10 : 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                marginBottom: isMobile ? 10 : 20
              }}>
                <Image 
                  source={zapatilla.imagen}
                  style={{ 
                    width: '100%',
                    height: isMobile ? 250 : 400,
                    resizeMode: 'contain'
                  }}
                />
              </View>
              
              {/* Miniaturas */}
              <View style={{ 
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 10,
                justifyContent: 'center',
                padding: isMobile ? 5 : 10
              }}>
                {[1, 2, 3, 4].map((_, index) => (
                  <View
                    key={index}
                    style={{
                      padding: 5,
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      borderWidth: index === 0 ? 2 : 1,
                      borderColor: index === 0 ? '#ff4d4d' : '#eee',
                    }}
                  >
                    <Image 
                      source={zapatilla.imagen}
                      style={{ 
                        width: isMobile ? 60 : 80,
                        height: isMobile ? 60 : 80,
                        resizeMode: 'contain'
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* Sección derecha - Detalles */}
            <View style={{ 
              width: isMobile ? '100%' : '50%',
              padding: isMobile ? 10 : 20,
              alignSelf: isMobile ? 'center' : 'flex-start'
            }}>
              <Text style={{ 
                fontSize: isMobile ? 24 : 32,
                fontWeight: '600',
                marginBottom: 15
              }}>
                {zapatilla.nombre}
              </Text>

              {/* Precio y descuento */}
              <View style={{ 
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: 10,
                marginBottom: 20
              }}>
                <Text style={{ 
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: '700'
                }}>
                  ${precioConDescuento.toLocaleString()}
                </Text>
                <View style={{
                  backgroundColor: '#ff4d4d',
                  padding: 8,
                  borderRadius: 8
                }}>
                  <Text style={{ 
                    color: 'white',
                    fontSize: isMobile ? 12 : 14
                  }}>
                    -10% en transferencia bancaria
                  </Text>
                </View>
              </View>

              {/* Selector de talle */}
              <Text style={{ 
                fontSize: isMobile ? 18 : 22,
                fontWeight: '600',
                marginBottom: 10
              }}>
                Selecciona tu talle
              </Text>
              <View style={{ 
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 20
              }}>
                {talles.map((talle) => (
                  <Pressable
                    key={talle}
                    onPress={() => setTalleSeleccionado(talle)}
                    style={{ 
                      width: isMobile ? 50 : 60,
                      height: isMobile ? 50 : 60,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: talleSeleccionado === talle ? '#ff4d4d' : '#eee',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={{
                      fontSize: isMobile ? 16 : 18,
                      fontWeight: '500',
                      color: talleSeleccionado === talle ? '#ff4d4d' : '#666'
                    }}>{talle}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Selector de cantidad */}
              <View style={{ 
                marginBottom: 20,
                gap: 10
              }}>
                <Text style={{ 
                  fontSize: isMobile ? 18 : 22,
                  fontWeight: '600'
                }}>
                  Cantidad
                </Text>
                <View style={{ 
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15
                }}>
                  <Pressable
                    onPress={() => cantidad > 1 && setCantidad(cantidad - 1)}
                    style={{ 
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: '#f8f8f8',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: '#eee'
                    }}
                  >
                    <Text style={{ fontSize: 24, color: '#666' }}>-</Text>
                  </Pressable>
                  <Text style={{ fontSize: 24, fontWeight: '500' }}>{cantidad}</Text>
                  <Pressable
                    onPress={() => setCantidad(cantidad + 1)}
                    style={{ 
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: '#f8f8f8',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: '#eee'
                    }}
                  >
                    <Text style={{ fontSize: 24, color: '#666' }}>+</Text>
                  </Pressable>
                </View>
              </View>

              {/* Botón de agregar al carrito */}
              <Pressable
                onPress={handleAgregarCarrito}
                style={{ 
                  backgroundColor: '#ff4d4d',
                  padding: isMobile ? 15 : 20,
                  borderRadius: 12,
                  alignItems: 'center'
                }}
              >
                <Text style={{ 
                  color: 'white',
                  fontSize: isMobile ? 16 : 20,
                  fontWeight: '600'
                }}>
                  Agregar al Carrito
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modales */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: isMobile ? 15 : 20
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: isMobile ? 15 : 20,
            borderRadius: 15,
            width: '95%',
            maxWidth: 400
          }}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: '#f0f0f0',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}
            >
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600',
                color: '#666'
              }}>
                ✕
              </Text>
            </Pressable>

            <Text style={{ fontSize: 18, fontWeight: '500' }}>
              El producto fue agregado al carrito
            </Text>
            
            <View style={{
              flexDirection: 'row',
              gap: 10,
              width: '100%'
            }}>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('carrito');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#ff4d4d',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  Ir al Carrito
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('index');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#f0f0f0',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#333', fontWeight: '600' }}>
                  Seguir Comprando
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showError}
        onRequestClose={() => setShowError(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 15,
            width: '90%',
            maxWidth: 400,
            alignItems: 'center',
            gap: 20,
            padding: 20
          }}>
            <Ionicons name="alert-circle" size={50} color="#ff4d4d" />
            
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '500',
              textAlign: 'center'
            }}>
              Por favor, selecciona un talle antes de agregar al carrito
            </Text>

            <Pressable
              onPress={() => setShowError(false)}
              style={{
                backgroundColor: '#ff4d4d',
                padding: 15,
                borderRadius: 10,
                width: '100%',
                alignItems: 'center'
              }}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: '600',
                fontSize: 16
              }}>
                Entendido
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Compra;
