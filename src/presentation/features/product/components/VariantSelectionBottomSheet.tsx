import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    TextInput,
    Dimensions,
    Platform,
} from 'react-native';
import { colors } from 'shared/theme/colors';
import { BORDER_RADIUS } from 'shared/theme/layout';
import { assets } from 'shared/theme/assets';
import { Image } from 'react-native';
import { VariantGroupDTO, UnitDTO, ProductDetailRespondDTO, VariantDTO } from 'src/presentation/dto/res/product-detail.dto';
import { PriceFormatter } from 'app/utils/priceFormatter';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { RootState } from 'src/presentation/store/store';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';

const screenWidth = Dimensions.get('window').width;

interface VariantSelectionBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (selectedVariantId: string, quantity: number) => void;
    product: ProductDetailRespondDTO;
    addToCartStatus: string;
}

const VariantSelectionBottomSheet: React.FC<VariantSelectionBottomSheetProps> = ({
    visible,
    onClose,
    onConfirm,
    product,
    addToCartStatus,
}) => {
    const navigation = useMainNavigation()
    const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [quantityInput, setQuantityInput] = useState('1');

    // Lấy dữ liệu giỏ hàng từ Redux
    const { items } = useSelector((state: RootState) => state.cart);
    const [isExistedInCart, setIsExistedInCart] = useState(false);

    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ['25%', '75%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);



    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    // Tìm variant phù hợp với các unit đã chọn
    const matchedVariant = product?.variants.find((variant: VariantDTO) => {
        if (variant.unitValues.length !== selectedUnitIds.length) return false;
        return selectedUnitIds.every(id => variant.unitValues.map(u => u._id).includes(id));
    });



    // Kiểm tra xem có cần chọn variant không
    const noGroup = !product?.variantGroups || product?.variantGroups.length === 0;
    const autoVariant = noGroup && product?.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    const needSelectVariant = !matchedVariant && !autoVariant;

    useEffect(() => {
        const maxStock = matchedVariant?.stock || autoVariant?.stock || 1;
        if (quantity > maxStock) {
            setQuantity(1);
            setQuantityInput('1');
        }
    }, [matchedVariant, autoVariant]);

    // Kiểm tra sản phẩm đã có trong giỏ hàng
    useEffect(() => {
        if (!matchedVariant && !autoVariant) {
            setIsExistedInCart(false);
            return;
        }
        const variantId = matchedVariant?._id || autoVariant?._id;
        setIsExistedInCart(
            items.some(item => item.productVariantId === variantId)
        );
    }, [items, matchedVariant, autoVariant]);

    // Xử lý thay đổi số lượng
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity <= 0) {
            setQuantity(1);
            setQuantityInput('1');
            return;
        }

        const maxStock = matchedVariant?.stock || autoVariant?.stock || 1;
        if (newQuantity > maxStock) {
            setQuantity(maxStock);
            setQuantityInput(maxStock.toString());
            return;
        }

        setQuantity(newQuantity);
        setQuantityInput(newQuantity.toString());
    };

    // Xử lý nhập tay số lượng
    const handleQuantityInputChange = (text: string) => {
        setQuantityInput(text);
        const numValue = parseInt(text) || 0;

        if (numValue <= 0) {
            setQuantity(1);
            return;
        }

        const maxStock = matchedVariant?.stock || autoVariant?.stock || 1;
        if (numValue > maxStock) {
            setQuantity(maxStock);
            return;
        }

        setQuantity(numValue);
    };

    // Xử lý khi blur input
    const handleQuantityInputBlur = () => {
        const numValue = parseInt(quantityInput) || 0;
        if (numValue <= 0) {
            setQuantity(1);
            setQuantityInput('1');
        } else {
            const maxStock = matchedVariant?.stock || autoVariant?.stock || 1;
            if (numValue > maxStock) {
                setQuantity(maxStock);
                setQuantityInput(maxStock.toString());
            } else {
                setQuantity(numValue);
                setQuantityInput(numValue.toString());
            }
        }
    };

    // Reset state khi đóng bottom sheet
    useEffect(() => {
        if (!visible) {
            setSelectedUnitIds([]);
            setQuantity(1);
            setQuantityInput('1');
        }
    }, [visible]);

    // Cập nhật input khi quantity thay đổi
    useEffect(() => {
        setQuantityInput(quantity.toString());
    }, [quantity]);

    // Mở bottom sheet khi visible = true
    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [visible]);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const maxStock = useMemo(() => {
        return matchedVariant?.stock || autoVariant?.stock || 1;
    }, [matchedVariant, autoVariant]);

    useEffect(() => {
        if (quantity > maxStock) {
            setQuantity(maxStock);
            setQuantityInput(maxStock.toString());
        }
    }, [quantity, maxStock]);

    const renderAddToCartButton = () => {
        if (addToCartStatus === 'loading') {
            return (
                <TouchableOpacity style={[styles.cartButton, { backgroundColor: colors.grey[400] }]} disabled>
                    <Text style={styles.cartText}>Đang thêm ...</Text>
                </TouchableOpacity>
            );
        }

        if (isExistedInCart) {
            return (
                <TouchableOpacity style={[styles.cartButton, { backgroundColor: colors.green.main }]}
                    onPress={() => navigation.navigate('MainScreen', { route: 'CartTab' })}
                >
                    <Text style={styles.cartText}>Đã có trong giỏ</Text>
                </TouchableOpacity>
            );
        }

        if (needSelectVariant) {
            return (
                <TouchableOpacity style={[styles.cartButton, { backgroundColor: colors.grey[400] }]} disabled>
                    <Text style={styles.cartText}>Vui lòng chọn mặt hàng</Text>
                </TouchableOpacity>
            );
        }

        // Kiểm tra tồn kho
        const currentStock = matchedVariant?.stock || autoVariant?.stock || 0;
        if (currentStock === 0) {
            return (
                <TouchableOpacity style={[styles.cartButton, { backgroundColor: colors.grey[400] }]} disabled>
                    <Text style={styles.cartText}>Hết hàng</Text>
                </TouchableOpacity>
            );
        }

        const variantId = autoVariant?._id || matchedVariant?._id;
        return (
            <TouchableOpacity
                style={styles.cartButton}
                onPress={() => onConfirm(variantId!, quantity)}
            >
                <Text style={styles.cartText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
        );
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={visible ? 0 : -1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Chọn phân loại</Text>
                    <TouchableOpacity onPress={handleClosePress}>
                        <Image source={assets.icons.close} style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* Hiển thị thông tin sản phẩm */}
                    <View style={styles.productInfo}>
                        <Image
                            source={{ uri: product?.images?.[0] }}
                            style={styles.productImage}
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName} numberOfLines={2}>
                                {product?.name}
                            </Text>
                            <Text style={styles.productPrice}>
                                {matchedVariant
                                    ? PriceFormatter.formatPrice(matchedVariant.promotionalPrice * quantity)
                                    : autoVariant
                                        ? PriceFormatter.formatPrice(autoVariant.promotionalPrice * quantity)
                                        : 'Chọn phân loại để xem giá'
                                }
                            </Text>
                        </View>
                    </View>

                    {/* Chọn biến thể */}
                    {product?.variantGroups && product.variantGroups.length > 0 && (
                        <View style={styles.variantSection}>
                            <Text style={styles.sectionTitle}>Phân loại</Text>
                            <GroupFlatList
                                onSelectedUnitsChange={(selectedUnits) => {
                                    const unitIds = Object.values(selectedUnits);
                                    setSelectedUnitIds(unitIds);
                                }}
                                groups={product.variantGroups}
                            />
                        </View>
                    )}

                    {/* Chọn số lượng */}
                    <View style={styles.quantitySection}>
                        <Text style={styles.sectionTitle}>Số lượng</Text>
                        <View style={styles.quantityContainer}>
                            <View style={styles.quantityControls}>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => handleQuantityChange(quantity - 1)}
                                >
                                    <Image source={assets.icons.details.linear} />
                                </TouchableOpacity>

                                <TextInput
                                    style={styles.quantityInput}
                                    value={quantityInput}
                                    onChangeText={handleQuantityInputChange}
                                    onBlur={handleQuantityInputBlur}
                                    keyboardType="numeric"
                                    textAlign="center"
                                />

                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => handleQuantityChange(quantity + 1)}
                                >
                                    <Image source={assets.icons.details.Stylelinearplusss} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.stockInfo}>
                                {matchedVariant && (
                                    <Text style={styles.stockText}>
                                        Tồn kho: {matchedVariant.stock}
                                    </Text>
                                )}
                                {autoVariant && !matchedVariant && (
                                    <Text style={styles.stockText}>
                                        Tồn kho: {autoVariant.stock}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    {renderAddToCartButton()}
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
};

const GroupFlatList = ({ groups, onSelectedUnitsChange }:
    { groups: VariantGroupDTO[], onSelectedUnitsChange: (selectedUnits: { [groupId: string]: string }) => void }) => {
    const [selectedUnits, setSelectedUnits] = useState<{ [groupId: string]: string }>({});

    const handleUnitSelect = (groupId: string, unitId: string) => {
        const newSelectedUnits = { ...selectedUnits, [groupId]: unitId };
        setSelectedUnits(newSelectedUnits);
        onSelectedUnitsChange(newSelectedUnits);
    };

    return (
        <FlatList<VariantGroupDTO>
            data={groups}
            renderItem={({ item }) => (
                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>{item.groupName}</Text>
                    <UnitFlatList
                        units={item.units}
                        selectedUnitId={selectedUnits[item._id]}
                        onUnitSelect={(unitId) => handleUnitSelect(item._id, unitId)}
                    />
                </View>
            )}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
        />
    );
};

const UnitFlatList = ({ units, selectedUnitId, onUnitSelect }:
    { units: UnitDTO[], selectedUnitId?: string, onUnitSelect: (unitId: string) => void }) => {
    return (
        <FlatList<UnitDTO>
            data={units}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        item._id === selectedUnitId && styles.selectedOption
                    ]}
                    onPress={() => onUnitSelect(item._id)}
                >
                    <Text style={[
                        styles.optionText,
                        item._id === selectedUnitId && styles.selectedOptionText
                    ]}>
                        {item.unitName}
                    </Text>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.unitList}
        />
    );
};

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: colors.white,
    },
    handleIndicator: {
        backgroundColor: colors.grey[300],
        width: 40,
        height: 4,
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey[200],
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    closeIcon: {
        width: 24,
        height: 24,
    },
    content: {
        padding: 20,
        flex: 1,
    },
    productInfo: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.S,
        marginRight: 12,
    },
    productDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.app.primary.main,
    },
    variantSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 12,
    },
    groupContainer: {
        marginBottom: 16,
    },
    groupTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text.secondary,
        marginBottom: 8,
    },
    unitList: {
        paddingRight: 20,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.grey[300],
        borderRadius: BORDER_RADIUS.S,
        marginRight: 8,
        backgroundColor: colors.white,
    },
    selectedOption: {
        borderColor: colors.app.primary.main,
        backgroundColor: colors.app.primary.lightest,
    },
    optionText: {
        fontSize: 14,
        color: colors.text.primary,
    },
    selectedOptionText: {
        color: colors.app.primary.main,
        fontWeight: '500',
    },
    quantitySection: {
        marginBottom: 20,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.grey[300],
        borderRadius: BORDER_RADIUS.S,
        overflow: 'hidden',
    },
    quantityButton: {
        padding: 12,
        backgroundColor: colors.grey[100],
    },
    quantityInput: {
        width: 60,
        paddingVertical: 12,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.grey[300],
    },
    stockInfo: {
        alignItems: 'flex-end',
    },
    stockText: {
        fontSize: 14,
        color: colors.text.secondary,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.grey[200],
    },
    cartButton: {
        backgroundColor: colors.app.primary.main,
        padding: 16,
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.S,
    },
    cartText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default VariantSelectionBottomSheet; 