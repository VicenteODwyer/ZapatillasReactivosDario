import React, { useState } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    Dimensions,
    Pressable,
    ScrollView,
    useWindowDimensions
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

const Home = () => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const [zapatillasFiltradas, setZapatillasFiltradas] = useState(zapatillas);

    // Calcular el número de columnas basado en el ancho de la pantalla
    const getColumnCount = () => {
        if (width < 600) return 2;        // Móvil: 2 columnas
        if (width < 960) return 3;        // Tablet: 3 columnas
        if (width < 1280) return 4;       // Desktop pequeño: 4 columnas
        return 5;                         // Desktop grande: 5 columnas
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
                    paddingHorizontal: width < 600 ? 8 : 40,
                    gap: width < 600 ? 8 : 15
                }]}>
                    {zapatillasFiltradas.map((zapatilla) => (
                        <Pressable
                            key={zapatilla.id}
                            style={[styles.card, {
                                width: width < 600 
                                    ? `${48}%`  // Aproximadamente la mitad del ancho menos el gap
                                    : `${100 / getColumnCount() - 2}%`,
                                minWidth: width < 600 ? 150 : 280,
                                maxWidth: width < 600 ? '48%' : 400,
                            }]}
                            onPress={() => navigation.navigate('compra', { zapatilla })}
                        >
                            <View style={[styles.cardContent, {
                                padding: width < 600 ? 8 : 15
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
                                            fontSize: width < 600 ? 14 : 18
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
        paddingVertical: 20,
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
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        gap: 4,
    },
    title: {
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    price: {
        fontWeight: '700',
        color: '#000',
    }
});

export default Home;
