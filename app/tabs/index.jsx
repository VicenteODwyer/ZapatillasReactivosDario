import React, { useState } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    Dimensions,
    Pressable,
    Animated,
    ScrollView,
    Easing
} from 'react-native';
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

const { width } = Dimensions.get('window');

const ShoeImage = ({ source }) => {
    return (
        <View style={styles.imageContainer}>
            <Image
                source={source}
                style={styles.shoeImage}
                resizeMode="contain"
            />
        </View>
    );
};

const ShoeCard = ({ zapatilla, onPress, style }) => {
    const [isHovered, setIsHovered] = useState(false);
    const translateY = useState(new Animated.Value(0))[0];
    const translateX = useState(new Animated.Value(0))[0];
    const rotate = useState(new Animated.Value(0))[0];
    const cardTranslateY = useState(new Animated.Value(0))[0];

    const startAnimation = () => {
        setIsHovered(true);
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: -15,
                useNativeDriver: true,
                friction: 7,
                tension: 40
            }),
            Animated.spring(translateX, {
                toValue: 10,
                useNativeDriver: true,
                friction: 7,
                tension: 40
            }),
            Animated.spring(rotate, {
                toValue: 1,
                useNativeDriver: true,
                friction: 7,
                tension: 40
            }),
            Animated.spring(cardTranslateY, {
                toValue: -10,
                useNativeDriver: true,
                friction: 6,
                tension: 30
            })
        ]).start();
    };

    const endAnimation = () => {
        setIsHovered(false);
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                friction: 7,
                tension: 40
            }),
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
                friction: 7,
                tension: 40
            }),
            Animated.spring(rotate, {
                toValue: 0,
                useNativeDriver: true,
                friction: 7,
                tension: 40
            }),
            Animated.spring(cardTranslateY, {
                toValue: 0,
                useNativeDriver: true,
                friction: 6,
                tension: 30
            })
        ]).start();
    };

    return (
        <Pressable
            onPress={onPress}
            style={[styles.cardContainer, style]}
            onMouseEnter={startAnimation}
            onMouseLeave={endAnimation}
        >
            <Animated.View 
                style={[
                    styles.card,
                    {
                        transform: [{ translateY: cardTranslateY }]
                    }
                ]}
            >
                <View style={styles.imageWrapper}>
                    <Animated.Image
                        source={zapatilla.imagen}
                        style={[
                            styles.shoeImage,
                            {
                                transform: [
                                    { translateY },
                                    { translateX },
                                    {
                                        rotate: rotate.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '5deg']
                                        })
                                    }
                                ]
                            }
                        ]}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.cardContent}>
                    <Text numberOfLines={1} style={styles.shoeName}>
                        {zapatilla.nombre}
                    </Text>
                    <Text style={styles.shoePrice}>
                        ${zapatilla.precio.toLocaleString()}
                    </Text>
                </View>
            </Animated.View>
        </Pressable>
    );
};

const Home = () => {
    const navigation = useNavigation();
    const [containerWidth, setContainerWidth] = useState(width);
    const [zapatillasFiltradas, setZapatillasFiltradas] = useState(zapatillas);

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

    const onLayout = (event) => {
        const { width: newWidth } = event.nativeEvent.layout;
        setContainerWidth(newWidth);
    };

    const cardWidth = (containerWidth - 48) / 3;

    const handleCompra = (zapatilla) => {
        try {
            if (zapatilla && zapatilla.id) {
                navigation.navigate('compra', { zapatilla });
            }
        } catch (error) {
            console.error("Error al navegar:", error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
            <Header onSearch={handleSearch} />
            <ScrollView>
                <View 
                    style={styles.gridContainer}
                    onLayout={onLayout}
                >
                    {zapatillasFiltradas.map((zapatilla) => (
                        <ShoeCard
                            key={zapatilla.id}
                            zapatilla={zapatilla}
                            style={{ width: cardWidth }}
                            onPress={() => handleCompra(zapatilla)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 8,
        backgroundColor: '#f8f8f8',
    },
    cardContainer: {
        width: '100%',
        padding: 8,
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 10,
    },
    orangeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FF8C00',
        opacity: 0.2,
        zIndex: 1
    },
    shoeImage: {
        width: '80%',
        height: '80%',
        zIndex: 2
    },
    cardContent: {
        paddingHorizontal: 5,
    },
    shoeName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    shoePrice: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000',
    }
});

export default Home;
