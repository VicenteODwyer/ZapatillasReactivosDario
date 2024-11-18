import { View, Text, Image, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Carrito = () => {
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
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <Header />
      <View style={{ 
        flex: 1,
        padding: 20,
        maxWidth: 1200,
        width: '100%',
        marginHorizontal: 'auto',
      }}>
        {productos.length === 0 ? (
          <Text style={{ 
            fontSize: 18, 
            textAlign: 'center', 
            marginTop: 20 
          }}>
            No hay productos en el carrito
          </Text>
        ) : (
          <View style={{ flexDirection: 'row', gap: 40 }}>
            {/* Columna izquierda - Lista de productos */}
            <View style={{ flex: 2 }}>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: '600',
                marginBottom: 20 
              }}>
                Mi Carrito ({productos.length} productos)
              </Text>

              {/* Lista de productos */}
              <View style={{ gap: 15 }}>
                {productos.map((producto) => (
                  <View key={producto.id} style={{
                    backgroundColor: 'white',
                    borderRadius: 15,
                    padding: 20,
                    flexDirection: 'row',
                    gap: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                  }}>
                    {/* Imagen del producto */}
                    <Image 
                      source={producto.imagen}
                      style={{ 
                        width: 120,
                        height: 120,
                        objectFit: 'contain',
                        borderRadius: 10
                      }}
                    />

                    {/* Detalles del producto */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 18,
                        fontWeight: '600',
                        marginBottom: 5
                      }}>
                        {producto.nombre}
                      </Text>
                      <Text style={{ 
                        color: '#666',
                        marginBottom: 5 
                      }}>
                        Talla: {producto.talle}
                      </Text>
                      <Text style={{ 
                        color: '#666',
                        marginBottom: 10 
                      }}>
                        Color: {producto.color}
                      </Text>

                      {/* Controles de cantidad */}
                      <View style={{ 
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 15
                      }}>
                        <Pressable
                          onPress={() => handleCantidadChange(producto.id, Math.max(1, producto.cantidad - 1))}
                          style={{ 
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: '#f0f0f0',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Text>-</Text>
                        </Pressable>
                        <Text>{producto.cantidad}</Text>
                        <Pressable
                          onPress={() => handleCantidadChange(producto.id, producto.cantidad + 1)}
                          style={{ 
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: '#f0f0f0',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Text>+</Text>
                        </Pressable>
                      </View>
                    </View>

                    {/* Precio y botón eliminar */}
                    <View style={{ 
                      alignItems: 'flex-end',
                      gap: 10
                    }}>
                      <Text style={{ 
                        fontSize: 20,
                        fontWeight: '600'
                      }}>
                        ${producto.precio.toLocaleString()}
                      </Text>
                      <Pressable
                        onPress={() => handleEliminarProducto(producto.id)}
                        style={{ 
                          padding: 8,
                          borderRadius: 8,
                          backgroundColor: '#fff0f0'
                        }}
                      >
                        <Text style={{ color: '#ff4d4d' }}>🗑 Eliminar</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Columna derecha - Resumen */}
            <View style={{ 
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 15,
              padding: 20,
              height: 'fit-content',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}>
              <Text style={{ 
                fontSize: 24,
                fontWeight: '600',
                marginBottom: 20
              }}>
                Resumen de Compra
              </Text>

              <View style={{ 
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10
              }}>
                <Text style={{ color: '#666' }}>Subtotal</Text>
                <Text style={{ fontWeight: '600' }}>${calcularSubtotal().toLocaleString()}</Text>
              </View>

              <View style={{ 
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20
              }}>
                <Text style={{ color: '#666' }}>Envío</Text>
                <Text style={{ 
                  color: '#00b300',
                  fontWeight: '600'
                }}>
                  ¡Gratis! 🚚
                </Text>
              </View>

              <View style={{ 
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 30,
                paddingTop: 20,
                borderTopWidth: 1,
                borderTopColor: '#eee'
              }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Total</Text>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>
                  ${calcularSubtotal().toLocaleString()}
                </Text>
              </View>

              {/* Calculador de envío */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ 
                  fontWeight: '600',
                  marginBottom: 10
                }}>
                  📍 Calcular tiempo de envío
                </Text>
                <View style={{ 
                  flexDirection: 'row',
                  gap: 10
                }}>
                  <TextInput
                    placeholder="Ingresa tu código postal"
                    value={codigoPostal}
                    onChangeText={setCodigoPostal}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: '#eee',
                      borderRadius: 8,
                      padding: 10
                    }}
                  />
                  <Pressable
                    style={{
                      backgroundColor: '#f0f0f0',
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text>Calcular</Text>
                  </Pressable>
                </View>
              </View>

              {/* Botón continuar compra */}
              <Pressable
                style={{
                  backgroundColor: '#000',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center'
                }}
              >
                <Text style={{ 
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600'
                }}>
                  Continuar con la compra →
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Carrito;
