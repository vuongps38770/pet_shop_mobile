import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    TextInput,
    Modal,
    FlatList
} from 'react-native';
import { SupplierRespondDto } from 'src/presentation/dto/res/supplier-respond.dto';
import { colors } from 'shared/theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { fetchSuppliers } from '../product.slice';
import Icon from 'react-native-vector-icons/Ionicons';
import { Fonts } from 'shared/theme/fonts';

const DEFAULT_SUPPLIER_ICON = 'https://cdn-icons-png.flaticon.com/512/616/616408.png';

interface SupplierPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectSupplier: (supplierId: string, supplierName: string) => void;
    selectedSupplierId?: string;
}

export const SupplierPicker: React.FC<SupplierPickerProps> = ({
    visible,
    onClose,
    onSelectSupplier,
    selectedSupplierId
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSuppliers, setFilteredSuppliers] = useState<SupplierRespondDto[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const supplierList = useSelector((state: RootState) => state.product.suppliers);

    useEffect(() => {
        if (visible) {
            dispatch(fetchSuppliers());
        }
    }, [visible, dispatch]);

    // Cập nhật filteredSuppliers khi searchQuery hoặc supplierList thay đổi
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredSuppliers(supplierList);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = supplierList.filter(
                (supplier) =>
                    supplier.name.toLowerCase().includes(lowerCaseQuery) ||
                    supplier.description.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredSuppliers(filtered);
        }
    }, [searchQuery, supplierList]);

    const clearSearch = () => {
        setSearchQuery("");
    };

    const handleSupplierSelect = (supplierId: string, supplierName: string) => {
        onSelectSupplier(supplierId, supplierName);
        onClose();
    };

    const renderSupplierItem = ({ item }: { item: SupplierRespondDto }) => (
        <TouchableOpacity
            style={[
                styles.supplierItem,
                selectedSupplierId === item._id && styles.supplierItemSelected
            ]}
            onPress={() => handleSupplierSelect(item._id, item.name)}
            activeOpacity={0.85}
        >
            <Image 
                source={item.image ? { uri: item.image } : { uri: DEFAULT_SUPPLIER_ICON }} 
                style={styles.supplierImage} 
            />
            <View style={styles.supplierInfo}>
                <Text style={[
                    styles.supplierName,
                    selectedSupplierId === item._id && styles.supplierNameSelected
                ]}>
                    {item.name}
                </Text>
                <Text style={styles.supplierDescription} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
            {selectedSupplierId === item._id && (
                <Icon name="checkmark-circle" size={24} color={colors.app.primary.main} />
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.headerWrap}>
                    <Text style={styles.headerTitle}>Chọn Thương Hiệu</Text>
                    <TouchableOpacity style={styles.headerCloseBtn} onPress={onClose}>
                        <Icon name="close" size={22} color={colors.grey[600]} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBarContainer}>
                    <Icon name="search" size={20} color={colors.grey[500]} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Tìm kiếm thương hiệu..."
                        placeholderTextColor={colors.grey[500]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
                            <Icon name="close-circle" size={20} color={colors.grey[500]} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Suppliers List */}
                <View style={styles.suppliersContainer}>
                    {filteredSuppliers.length > 0 ? (
                        <FlatList
                            data={filteredSuppliers}
                            renderItem={renderSupplierItem}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.suppliersListContent}
                        />
                    ) : (
                        searchQuery.length > 0 ? (
                            <View style={styles.emptyStateContainer}>
                                <Icon name="search" size={60} color={colors.grey[300]} />
                                <Text style={styles.emptyStateText}>Không tìm thấy thương hiệu cho "{searchQuery}"</Text>
                                <TouchableOpacity onPress={clearSearch} style={styles.clearSearchTextButton}>
                                    <Text style={styles.clearSearchText}>Xóa tìm kiếm</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.loadingStateContainer}>
                                <Text style={styles.loadingStateText}>Đang tải thương hiệu...</Text>
                            </View>
                        )
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.default,
    },
    headerWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: Fonts.roboto.bold,
        color: colors.text.primary,
    },
    headerCloseBtn: {
        backgroundColor: colors.grey[100],
        borderRadius: 20,
        padding: 8,
        shadowColor: colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        margin: 16,
        borderRadius: 12,
        paddingHorizontal: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: colors.text.primary,
    },
    clearSearchButton: {
        marginLeft: 10,
        padding: 5,
    },
    suppliersContainer: {
        flex: 1,
        backgroundColor: colors.white,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 16,
        overflow: 'hidden',
    },
    suppliersListContent: {
        padding: 16,
    },
    supplierItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    supplierItemSelected: {
        borderColor: colors.app.primary.main,
        backgroundColor: colors.app.primary.light,
    },
    supplierImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    supplierInfo: {
        flex: 1,
    },
    supplierName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    supplierNameSelected: {
        color: colors.app.primary.main,
    },
    supplierDescription: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 18,
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    emptyStateText: {
        fontSize: 16,
        color: colors.grey[500],
        textAlign: 'center',
        marginTop: 10,
    },
    loadingStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    loadingStateText: {
        fontSize: 16,
        color: colors.grey[500],
    },
    clearSearchTextButton: {
        marginTop: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    clearSearchText: {
        color: colors.app.primary.main,
        fontSize: 14,
        fontWeight: 'bold',
    },
}); 