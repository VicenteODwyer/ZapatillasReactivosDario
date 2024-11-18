import { View, Text, Image, Pressable } from 'react-native';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

const zapatillas = [
  {
    id: 1,
    nombre: "Adidas Superstar x Korn",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa1.webp')
  },
  {
    id: 2,
    nombre: "Nike Dunk High JBalvin",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa2.webp')
  },
  {
    id: 3,
    nombre: "Nike Dunk High JBalvin",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa3.webp')
  },
  {
    id: 4,
    nombre: "Nike TN Red",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa4.webp')
  },
  {
    id: 5,
    nombre: "Nike Air Max 720",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa5.webp')
  },
  {
    id: 6,
    nombre: "Adidas Alphaedge",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa6.webp')
  },
  {
    id: 7,
    nombre: "Nike Mag BTTF",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa7.webp')
  },
  {
    id: 8,
    nombre: "Adidas Campus 00s Green",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa8.webp')
  },
  {
    id: 9,
    nombre: "Adidas Campus 00s Gray",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa9.webp')
  },
  {
    id: 10,
    nombre: "Adidas Predator 24 Pro",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa10.webp')
  },

];

const Home = () => {
  const navigation = useNavigation();

  const handleCompra = (zapatilla) => {
    try {
      if (zapatilla && zapatilla.id) {
        navigation.navigate('compra', { zapatilla: {
          id: zapatilla.id,
          nombre: zapatilla.nombre,
          precio: zapatilla.precio,
          imagen: zapatilla.imagen
        }});
      } else {
        console.error("Datos de zapatilla inválidos");
      }
    } catch (error) {
      console.error("Error al navegar:", error);
    }
  };

  return (
    <View style={{ 
      flex: 1,
      backgroundColor: '#f8f8f8',
    }}>
      <Header />
      <View style={{ 
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 25,
          padding: 20,
          maxWidth: 1400,
          width: '100%',
          margin: '30px auto',
          borderRadius: 30,
          alignSelf: 'center',
        }}>
          {zapatillas.map((zapatilla) => (
            <View 
              key={zapatilla.id} 
              style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 15,
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.08,
                shadowRadius: 20,
                elevation: 8,
              }}
            >
              <Image 
                source={zapatilla.imagen}
                style={{ 
                  width: '100%', 
                  height: 180,
                  objectFit: 'contain',
                  marginBottom: 10,
                  transform: [{scale: 1}],
                }}
              />
              <Text style={{ 
                fontSize: 20,
                color: '#333',
                fontWeight: '600',
                marginBottom: 5,
                lineHeight: 24,
              }}>{zapatilla.nombre}</Text>
              <Text style={{ 
                fontSize: 20,
                color: '#333',
                fontWeight: '600',
                marginBottom: 12
              }}>${zapatilla.precio}</Text>
              <Pressable 
                onPress={() => handleCompra(zapatilla)}
                android_ripple={{ color: '#ff6666' }}
                style={({ pressed }) => [{ 
                  position: 'absolute',
                  bottom: 15,
                  left: 15,
                  right: 15,
                  backgroundColor: pressed ? '#ff6666' : '#ff4d4d',
                  padding: 9,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }]}
              >
                <Text style={{ 
                  color: 'white', 
                  fontSize: 16,
                  fontWeight: '500'
                }}>Comprar</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Home;
