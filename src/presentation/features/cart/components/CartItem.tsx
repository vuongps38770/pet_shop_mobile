import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, TextInput } from 'react-native';
import { CartRespondDto } from '../../../dto/res/cart-respond.dto';
import { colors } from '../../../shared/theme/colors';
import { Checkbox } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { PriceFormatter } from 'app/utils/priceFormatter';
import { TextInput as RNTextInput } from 'react-native';
interface CartItemProps {
    item: CartRespondDto;
    checked: boolean;
    onCheck: (id: string) => void;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
    quantities?: { [id: string]: number };
    onChangeQuantity?: (id: string, quantity: number) => void
}

const CartItem: React.FC<CartItemProps> = ({ item, checked, onCheck, onIncrease, onDecrease, onRemove, quantities, onChangeQuantity }) => {
    const swipeableRef = useRef<Swipeable>(null);
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const unitText = (item.groups || [])
        .map(g => `${g.name}: ${g.unit?.name || ''}`)
        .join(' - ');
    const quantity = quantities?.[item._id] ?? item.quantity;
    const isOutOfStock = item.availableStock === 0;
    const isOverStock = quantity > item.availableStock;
    const [inputQuantity, setInputQuantity] = useState(quantity.toString());
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

    const handleCheck = () => {
        if (!isOutOfStock && !isOverStock) {
            onCheck(item._id);
        }
    };

    const handleIncrease = () => {
        if (!isOutOfStock && quantity < item.availableStock) {
            onIncrease(item._id);
            setInputQuantity((quantity + 1).toString());
        }
    };

    const handleDecrease = () => {
        if (!isOutOfStock) {
            onDecrease(item._id);
            setInputQuantity((quantity - 1).toString());
        }
    };
    const handleQuantitySubmit = () => {
        const parsed = parseInt(inputQuantity, 10);
        if (isNaN(parsed)) {
            setInputQuantity(quantity.toString()); // reset lại nếu nhập bậy
            return;
        }

        const clamped = Math.max(1, Math.min(parsed, item.availableStock));

        if (!isOutOfStock && clamped !== quantity) {
            onChangeQuantity?.(item._id, clamped); // dùng 1 hàm set thẳng luôn nếu có
        }

        setInputQuantity(clamped.toString());
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
                <View style={[
                    styles.rowContainer,
                    isOutOfStock && styles.outOfStockContainer
                ]}>
                    <View style={styles.leftBlock}>
                        <Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={handleCheck}
                            color={colors.app.primary.main}
                            disabled={isOutOfStock || isOverStock}
                            uncheckedColor={(isOutOfStock || isOverStock) ? colors.grey[400] : colors.app.primary.main}
                        />
                    </View>
                    <View style={styles.rightBlock}>
                        <View style={styles.container2}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: item.images[0] }}
                                    style={[
                                        styles.image,
                                        isOutOfStock && styles.outOfStockImage
                                    ]}
                                />
                            </View>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    style={[styles.button, isOutOfStock && styles.disabledButton]}
                                    onPress={handleDecrease}
                                    disabled={isOutOfStock}
                                >
                                    <Text style={[styles.buttonText, isOutOfStock && styles.disabledButtonText]}>-</Text>
                                </TouchableOpacity>
                                <TextInput
                                    value={inputQuantity}
                                    onChangeText={(text) => {
                                        const filtered = text.replace(/[^0-9]/g, ''); 
                                        setInputQuantity(filtered);
                                    }}
                                    onBlur={handleQuantitySubmit}
                                    keyboardType="numeric"
                                    editable={!isOutOfStock}
                                    style={[styles.inputQuantity, isOutOfStock && styles.outOfStockText]}
                                />
                                <TouchableOpacity
                                    style={[styles.button, (isOutOfStock || isOverStock) && styles.disabledButton]}
                                    onPress={handleIncrease}
                                    disabled={isOutOfStock || isOverStock}
                                >
                                    <Text style={[styles.buttonText, (isOutOfStock || isOverStock) && styles.disabledButtonText]}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={[styles.productName, isOutOfStock && styles.outOfStockText]} numberOfLines={2}>{item.productName}</Text>
                            <Text style={[styles.unitText, isOutOfStock && styles.outOfStockSecondaryText]}>{unitText}</Text>
                            <Text style={[styles.price, isOutOfStock && styles.outOfStockText]}>{PriceFormatter.formatPrice(item.promotionalPrice)}</Text>
                            {isOverStock && (
                                <Text style={{ color: colors.error, fontSize: 12, marginTop: 4 }}>
                                    Số lượng vượt quá tồn kho ({item.availableStock}). Vui lòng giảm lại.
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
                {isOutOfStock && (
                    <View style={styles.outOfStockBadge}>
                        <Image style={{ width: 100, height: 100 }} source={require('../../../../../assets/images/out-of-stock.png')} />
                    </View>
                )}
            </Swipeable>
        </Animated.View>
    );
};

export default CartItem;

const styles = StyleSheet.create({
    inputQuantity: {
        borderWidth: 1,
        borderColor: colors.grey[400],
        borderRadius: 6,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        color: colors.text.primary,
        backgroundColor: colors.white,
        minWidth: 32,
        height: 32,
        padding: 0,
        marginHorizontal: 5
    },
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
    outOfStockContainer: {
        backgroundColor: colors.grey[100],
        opacity: 0.7,
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
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: 120,
        height: 100,
        borderRadius: 10,
        marginRight: 12,
    },
    outOfStockImage: {
        opacity: 0.5,
    },
    outOfStockBadge: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        backgroundColor: colors.red.main,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    outOfStockText: {
        color: colors.error,
        fontSize: 12,
        fontWeight: 'bold',
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
    outOfStockSecondaryText: {
        color: colors.grey[500],
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
    disabledButton: {
        backgroundColor: colors.grey[300],
    },
    buttonText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    disabledButtonText: {
        color: colors.grey[500],
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