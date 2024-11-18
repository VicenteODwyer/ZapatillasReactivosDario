import React, { useState } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    Dimensions,
    TouchableOpacity,
    Animated,
    ScrollView
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
    const scaleAnim = new Animated.Value(1);
    const rotateAnim = new Animated.Value(0);

    const handleHoverIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1.08,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(rotateAnim, {
                    toValue: -0.03,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0.03,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ])
        ]).start();
    };

    const handleHoverOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onHoverIn={handleHoverIn}
            onHoverOut={handleHoverOut}
            style={[styles.cardContainer, style]}
            activeOpacity={1}
        >
            <Animated.View 
                style={[
                    styles.card,
                    {
                        transform: [
                            { scale: scaleAnim },
                            { rotate: rotateAnim.interpolate({
                                inputRange: [-1, 1],
                                outputRange: ['-10deg', '10deg']
                            })},
                            { perspective: 1000 }
                        ]
                    }
                ]}
            >
                <View style={styles.imageWrapper}>
                    <Image
                        source={zapatilla.imagen}
                        style={styles.shoeImage}
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
        </TouchableOpacity>
    );
};

const Home = () => {
    const navigation = useNavigation();
    const [containerWidth, setContainerWidth] = useState(width);

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
            <Header />
            <ScrollView>
                <View 
                    style={styles.gridContainer}
                    onLayout={onLayout}
                >
                    {zapatillas.map((zapatilla) => (
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
        marginBottom: 16,
    },
    card: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 1,
        padding: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shoeImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    cardContent: {
        padding: 12,
        backgroundColor: 'white',
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
