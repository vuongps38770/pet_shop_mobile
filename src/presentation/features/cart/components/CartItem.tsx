import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { CartRespondDto } from '../../../dto/res/cart-respond.dto';
import { colors } from '../../../shared/theme/colors';
import { Checkbox } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { PriceFormatter } from 'app/utils/priceFormatter';

interface CartItemProps {
    item: CartRespondDto;
    checked: boolean;
    onCheck: (id: string) => void;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
    quantities?: { [id: string]: number };
}

const CartItem: React.FC<CartItemProps> = ({ item, checked, onCheck, onIncrease, onDecrease, onRemove, quantities }) => {
    const swipeableRef = useRef<Swipeable>(null);
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const unitText = (item.groups || [])
        .map(g => `${g.name}: ${g.unit?.name || ''}`)
        .join(' - ');
    const quantity = quantities?.[item._id] ?? item.quantity;

    const handleRemove = () => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: -500,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onRemove(item._id);
        });
    };

    const renderRightActions = () => (
        <TouchableOpacity style={styles.deleteButton} onPress={handleRemove}>
            <Text style={styles.deleteButtonText}>Xoá</Text>
        </TouchableOpacity>
    );

    return (
        <Animated.View style={[
            styles.container,
            {
                transform: [{ translateX }],
                opacity,
            }
        ]}>
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                friction={2}
                rightThreshold={40}
                overshootRight={true}
            >
                <View style={styles.rowContainer}>
                    <View style={styles.leftBlock}>
                        <Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => onCheck(item._id)}
                            color={colors.app.primary.main}
                        />
                    </View>
                    <View style={styles.rightBlock}>
                        <View style={styles.container2}>
                            <Image source={{ uri: item.images[0] }} style={styles.image} />
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => onDecrease(item._id)}>
                                    <Text style={styles.buttonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{quantity.toString().padStart(2, '0')}</Text>
                                <TouchableOpacity style={styles.button} onPress={() => onIncrease(item._id)}>
                                    <Text style={styles.buttonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
                            <Text style={styles.unitText}>{unitText}</Text>
                            <Text style={styles.price}>{PriceFormatter.formatPrice(item.promotionalPrice)}</Text>
                        </View>
                    </View>
                </View>
            </Swipeable>
        </Animated.View>
    );
};

export default CartItem;

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        marginHorizontal: 2,
    },
    rowContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        elevation: 2,
    },
    leftBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    rightBlock: {
        flex: 1,
        flexDirection: 'column',
    },
    container2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 100,
        borderRadius: 10,
        marginRight: 12,
    },
    infoContainer: {
        marginTop: 4,
        marginLeft: 2,
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 2,
        color: colors.text.primary,
    },
    unitText: {
        color: colors.text.secondary,
        fontSize: 13,
        marginBottom: 2,
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.text.primary,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    button: {
        backgroundColor: colors.app.primary.main,
        borderRadius: 6,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    quantityText: {
        marginHorizontal: 10,
        fontSize: 18,
        fontWeight: 'bold',
        minWidth: 24,
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: colors.red.main,
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: '90%',
        borderRadius: 10,
        marginRight: 8,
        marginTop: 12
    },
    deleteButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});