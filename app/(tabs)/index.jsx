import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    Dimensions,
    Pressable,
    ScrollView,
    useWindowDimensions,
    Animated,
    Easing,
    Platform
} from 'react-native';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

const zapatillas = [
  {
    id: 1,
    nombre: "Adidas Superstar x Korn",
    precio: 129999,
    imagen: require('../../assets/zapas/zapa1.webp')
  },
  {
    id: 2,
    nombre: "Nike Dunk High JBalvin",
    precio: 189999,
    imagen: require('../../assets/zapas/zapa2.webp')
  },
  {
    id: 3,
    nombre: "Nike Air Max 720",
    precio: 179999,
    imagen: require('../../assets/zapas/zapa3.webp')
  },
  {
    id: 4,
    nombre: "Nike TN Red",
    precio: 199999,
    imagen: require('../../assets/zapas/zapa4.webp')
  },
  {
    id: 5,
    nombre: "Nike Runner ShowTheWay",
    precio: 219999,
    imagen: require('../../assets/zapas/zapa5.webp')
  },
  {
    id: 6,
    nombre: "Adidas SL 72 RS",
    precio: 169999,
    imagen: require('../../assets/zapas/zapa6.webp')
  },
  {
    id: 7,
    nombre: "Nike Mag BTTF",
    precio: 299999,
    imagen: require('../../assets/zapas/zapa7.webp')
  },
  {
    id: 8,
    nombre: "Adidas Campus 00s Green",
    precio: 139999,
    imagen: require('../../assets/zapas/zapa8.webp')
  },
  {
    id: 9,
    nombre: "Adidas Campus 00s Gray",
    precio: 139999,
    imagen: require('../../assets/zapas/zapa9.webp')
  },
  {
    id: 10,
    nombre: "Adidas Predator 24 Pro",
    precio: 159999,
    imagen: require('../../assets/zapas/zapa10.webp')
  },

];

// Estilos CSS para web con elevación diagonal sutil
const estilosAnimacion = `
  .card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .card:hover {
    transform: translate(-3px, -3px);
    box-shadow: 3px 3px 12px rgba(0,0,0,0.15);
  }
  
  .card-image {
    transition: transform 0.3s ease;
  }
  
  .card:hover .card-image {
    transform: scale(1.05);
  }

  /* Alternar la dirección diagonal para cards pares */
  .card:nth-child(even):hover {
    transform: translate(3px, -3px);
    box-shadow: -3px 3px 12px rgba(0,0,0,0.15);
  }
`;

// Agregar los estilos al head del documento (solo para web)
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = estilosAnimacion;
    document.head.appendChild(style);
}

const Home = () => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const [zapatillasFiltradas, setZapatillasFiltradas] = useState(zapatillas);
    const [hoveredId, setHoveredId] = useState(null);
    
    // Animación para móvil
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            friction: 8,
            tension: 100
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 100
        }).start();
    };

    const getColumnCount = () => {
        if (width < 600) return 2;
        if (width < 960) return 3;
        if (width < 1280) return 4;
        return 5;
    };

    const handleSearch = (query) => {
        if (!query.trim()) {
            setZapatillasFiltradas(zapatillas);
            return;
        }
        const filtradas = zapatillas.filter(zapatilla => 
            zapatilla.nombre.toLowerCase().includes(query.toLowerCase())
        );
        setZapatillasFiltradas(filtradas);
    };

    return (
        <View style={styles.container}>
            <Header onSearch={handleSearch} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.gridContainer, { 
                    paddingHorizontal: width < 600 ? 12 : 40,
                    gap: width < 600 ? 12 : 15
                }]}>
                    {zapatillasFiltradas.map((zapatilla) => (
                        <Animated.View
                            key={zapatilla.id}
                            style={[
                                styles.cardContainer,
                                {
                                    // Solo aplicar la animación de escala en móvil
                                    transform: Platform.OS === 'web' ? [] : [{ scale: scaleAnim }],
                                    width: width < 600 ? '47%' : `${100 / getColumnCount() - 2}%`,
                                }
                            ]}
                        >
                            <Pressable
                                style={[
                                    styles.card,
                                    hoveredId === zapatilla.id && styles.cardHovered,
                                ]}
                                onPress={() => navigation.navigate('compra', { zapatilla })}
                                onPressIn={Platform.OS === 'web' ? null : handlePressIn}
                                onPressOut={Platform.OS === 'web' ? null : handlePressOut}
                                onMouseEnter={() => setHoveredId(zapatilla.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <View style={[styles.cardContent, {
                                    padding: width < 600 ? 10 : 15
                                }]}>
                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={zapatilla.imagen}
                                            style={styles.image}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text 
                                            numberOfLines={2} 
                                            style={[styles.title, {
                                                fontSize: width < 600 ? 14 : 18,
                                                marginTop: width < 600 ? 6 : 8
                                            }]}
                                        >
                                            {zapatilla.nombre}
                                        </Text>
                                        <Text style={[styles.price, {
                                            fontSize: width < 600 ? 16 : 20
                                        }]}>
                                            ${zapatilla.precio.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 16,
        maxWidth: 1600,
        alignSelf: 'center',
        width: '100%',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    cardHovered: {
        transform: [{translateY: -10}],
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    cardContent: {
        padding: 15,
    },
    imageContainer: {
        aspectRatio: 1,
        width: '100%',
        backgroundColor: '#fff',
        marginBottom: 8,
        borderRadius: 8,
        overflow: 'hidden',
        padding: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        gap: 4,
        paddingHorizontal: 4,
    },
    title: {
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    price: {
        fontWeight: '700',
        color: '#000',
    },
    '@keyframes floatCard': {
        '0%': {
            transform: [{translateY: 0}, {translateX: 0}, {rotate: '0deg'}]
        },
        '20%': {
            transform: [{translateY: -8}, {translateX: 4}, {rotate: '0.5deg'}]
        },
        '40%': {
            transform: [{translateY: -4}, {translateX: -4}, {rotate: '-0.5deg'}]
        },
        '60%': {
            transform: [{translateY: -10}, {translateX: 2}, {rotate: '0.3deg'}]
        },
        '80%': {
            transform: [{translateY: -6}, {translateX: -2}, {rotate: '-0.3deg'}]
        },
        '100%': {
            transform: [{translateY: 0}, {translateX: 0}, {rotate: '0deg'}]
        }
    },
    '@keyframes scaleImage': {
        '0%': {
            transform: [{scale: 1}, {rotate: '0deg'}]
        },
        '20%': {
            transform: [{scale: 1.02}, {rotate: '-0.5deg'}]
        },
        '40%': {
            transform: [{scale: 1.03}, {rotate: '0.5deg'}]
        },
        '60%': {
            transform: [{scale: 1.04}, {rotate: '-0.3deg'}]
        },
        '80%': {
            transform: [{scale: 1.02}, {rotate: '0.3deg'}]
        },
        '100%': {
            transform: [{scale: 1}, {rotate: '0deg'}]
        }
    }
});

export default Home;
