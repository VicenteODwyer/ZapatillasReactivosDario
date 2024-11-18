import { View, Text, Image, Pressable, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Compra = () => {
  const route = useRoute();
  const navigation = useNavigation();
  console.log('Parámetros recibidos:', route.params);
  const { zapatilla } = route.params || {};
  const [cantidad, setCantidad] = useState(1);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
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
    <View style={{ 
      flex: 1, 
      backgroundColor: '#fff',
      padding: 20
    }}>
      <View style={{ 
        flexDirection: 'row',
        gap: 60,
        maxWidth: 1200,
        marginHorizontal: 'auto',
        alignItems: 'flex-start'
      }}>
        {/* Sección izquierda - Imágenes */}
        <View style={{ flex: 1.2 }}>
          {/* Imagen principal */}
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            marginBottom: 20
          }}>
            <Image 
              source={zapatilla.imagen}
              style={{ 
                width: '100%',
                height: 500,
                objectFit: 'contain',
              }}
            />
          </View>
          
          {/* Miniaturas */}
          <View style={{ 
            flexDirection: 'row',
            gap: 15,
            justifyContent: 'center'
          }}>
            {[1, 2, 3, 4].map((_, index) => (
              <View
                key={index}
                style={{
                  padding: 10,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  borderWidth: index === 0 ? 2 : 1,
                  borderColor: index === 0 ? '#ff4d4d' : '#eee',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                }}
              >
                <Image 
                  source={zapatilla.imagen}
                  style={{ 
                    width: 80,
                    height: 80,
                    objectFit: 'contain'
                  }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Sección derecha - Detalles */}
        <View style={{ flex: 1, paddingTop: 20 }}>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: '600', 
            marginBottom: 20,
            color: '#333'
          }}>
            {zapatilla.nombre}
          </Text>

          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 15,
            marginBottom: 30
          }}>
            <Text style={{ 
              fontSize: 36, 
              fontWeight: '700',
              color: '#333'
            }}>
              ${precioConDescuento.toLocaleString()}
            </Text>
            <View style={{
              backgroundColor: '#ff4d4d',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8
            }}>
              <Text style={{ 
                color: 'white',
                fontWeight: '500'
              }}>
                -10% en transferencia bancaria
              </Text>
            </View>
          </View>

          {/* Selector de talle */}
          <Text style={{ 
            fontSize: 22,
            fontWeight: '600',
            marginBottom: 15,
            color: '#333'
          }}>
            Selecciona tu talle
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            gap: 10,
            marginBottom: 30
          }}>
            {talles.map((talle) => (
              <Pressable
                key={talle}
                onPress={() => setTalleSeleccionado(talle)}
                style={{ 
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: talleSeleccionado === talle ? '#ff4d4d' : '#eee',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: talleSeleccionado === talle ? '#fff' : '#f8f8f8'
                }}
              >
                <Text style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: talleSeleccionado === talle ? '#ff4d4d' : '#666'
                }}>{talle}</Text>
              </Pressable>
            ))}
          </View>

          {/* Selector de cantidad */}
          <Text style={{ 
            fontSize: 22,
            fontWeight: '600',
            marginBottom: 15,
            color: '#333'
          }}>
            Cantidad
          </Text>
          <View style={{ 
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            marginBottom: 40
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

          {/* Botón de agregar al carrito */}
          <Pressable
            onPress={handleAgregarCarrito}
            style={{ 
              backgroundColor: '#ff4d4d',
              padding: 20,
              borderRadius: 15,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 10
            }}
          >
            <Text style={{ 
              color: 'white',
              fontSize: 20,
              fontWeight: '600'
            }}>
              Agregar al Carrito
            </Text>
          </Pressable>
        </View>
      </View>

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
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 15,
            width: '80%',
            maxWidth: 400,
            alignItems: 'center',
            gap: 20,
            position: 'relative'
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
    </View>
  );
};

export default Compra;
