import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageSourcePropType,
    ScrollView,
    Animated,
    Easing,
} from 'react-native';
import { colors } from 'shared/theme/colors';
import { Typography } from 'shared/components/Typography';
import { assets } from 'shared/theme/assets';
import { BORDER_RADIUS } from 'shared/theme/layout';
import { sizes } from 'shared/theme/sizes';

import { FilterOptions } from '../../../dto/req/filter-option.req.dto';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FormatProduct } from 'shared/components/format-price';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from 'src/presentation/navigation/main-navigation/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchPages, addToPages } from '../product.slice';
import { ProductRespondSimplizeDto } from 'src/presentation/dto/res/product-respond.dto';
import ProductCard from 'shared/components/flat-list-items/ProductCard';
import FilterIcon from 'assets/icons/filter.svg';
import { CategoryPicker, SupplierPicker } from '../components';
import Icon from 'react-native-vector-icons/Ionicons';

const filterSections = [
    { key: 'category', label: 'Danh mục' },
    { key: 'brand', label: 'Thương hiệu' },
    { key: 'price', label: 'Khoảng giá' },
];

export const ProductShow = () => {
    const navigation = useMainNavigation();
    const route = useRoute<RouteProp<MainStackParamList, 'ProductShow'>>();

    const [filter, setFilter] = useState<FilterOptions>({ ...route.params.filter, limit: 10 });
    const [searchParam, setSearchParam] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedSort, setSelectedSort] = useState('Mới nhất');
    const [title, setTitle] = useState("");
    const sortOptions = [
        'Mới nhất',
        'Cũ nhất',
        'Giá tăng dần',
        'Giá giảm dần',
        'Đánh giá cao nhất',
        'Huỷ lọc',
    ];

    const pages = useSelector((state: RootState) => state.product.pages);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('category');
    const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(filter.categoryId);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
    const [isSupplierPickerVisible, setIsSupplierPickerVisible] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string | undefined>(filter.supplierId);
    const [selectedSupplierName, setSelectedSupplierName] = useState<string>('');
    const [filterKey, setFilterKey] = useState(0); // Force re-render when filter changes
    
    // Khởi tạo giá trị price từ filter hiện tại
    const [minPrice, setMinPrice] = useState(filter.minPrice ? filter.minPrice.toString() : '');
    const [maxPrice, setMaxPrice] = useState(filter.maxPrice ? filter.maxPrice.toString() : '');
    const sectionRefs = useRef<Record<string, any>>({});
    const scrollViewRef = useRef<ScrollView | null>(null);
    filterSections.forEach(s => { if (!sectionRefs.current[s.key]) sectionRefs.current[s.key] = React.createRef<View>(); });

    const filterAnim = useRef(new Animated.Value(0)).current;
    const FILTER_PANEL_HEIGHT = 380;

    useEffect(() => {
        Animated.timing(filterAnim, {
            toValue: isFilterOpen ? 1 : 0,
            duration: 250,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [isFilterOpen]);

    useEffect(() => {
        const getData = async () => {
            console.log('Filter changed, fetching data with:', filter);
            dispatch(fetchPages(filter));
            setIsLoadingMore(false);
            let title = "";

            if (filter.search) {
                if (filter.categoryId) {
                    title = `Kết quả của: ${route.params.title}/"${filter.search}"`;
                } else {
                    title = `Kết quả của: "${filter.search}"`;
                }
            } else if (filter.categoryId) {
                title = `Kết quả của: ${route.params.title}`;
            }

            setTitle(title);
        };
        getData();
    }, [filter]);

    // Log khi pages thay đổi
    useEffect(() => {
        console.log('Pages updated:', pages);
    }, [pages]);

    const handleLoadMore = () => {
        if (pages && pages.hasNextPage && !isLoadingMore) {
            setIsLoadingMore(true);
            setFilter(prev => ({
                ...prev,
                page: (prev.page || 1) + 1,
            }));
        }
    };

    const renderItem = ({ item }: { item: ProductRespondSimplizeDto }) => {
        return (
            <ProductCard
                item={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
            />
        );
    };

    const handleSectionPress = (key: string) => {
        setSelectedSection(key);
        if (sectionRefs.current[key]?.current && scrollViewRef.current) {
            sectionRefs.current[key].current.measureLayout(
                scrollViewRef.current,
                (x: number, y: number) => {
                    scrollViewRef.current?.scrollTo({ y, animated: true });
                }
            );
        }
    };

    const handleFilterScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        let found = 'category';
        for (let i = 0; i < filterSections.length; i++) {
            const key = filterSections[i].key;
            if (sectionRefs.current[key]?.current && scrollViewRef.current) {
                sectionRefs.current[key].current.measureLayout(
                    scrollViewRef.current,
                    (x: number, y: number) => {
                        if (scrollY >= y - 10) found = key;
                    }
                );
            }
        }
        setSelectedSection(found);
    };

    const handleCategorySelect = (categoryId: string, categoryName: string) => {
        setSelectedCategoryId(categoryId);
        setSelectedCategoryName(categoryName);
        // Không áp dụng filter ngay, chỉ lưu selection
    };

    const handleCategoryPickerOpen = () => {
        setIsCategoryPickerVisible(true);
    };

    const handleSupplierSelect = (supplierId: string, supplierName: string) => {
        setSelectedSupplierId(supplierId);
        setSelectedSupplierName(supplierName);
        // Không áp dụng filter ngay, chỉ lưu selection
    };

    const handleSupplierPickerOpen = () => {
        setIsSupplierPickerVisible(true);
    };

    // Lấy tên category và supplier từ ID để hiển thị
    const categoryList = useSelector((state: RootState) => state.product.categories);
    const supplierList = useSelector((state: RootState) => state.product.suppliers);

    const getCategoryNameById = (categoryId: string) => {
        const findCategory = (categories: any[], id: string): string => {
            for (const category of categories) {
                if (category._id === id) return category.name;
                if (category.children) {
                    const found = findCategory(category.children, id);
                    if (found) return found;
                }
            }
            return '';
        };
        return findCategory(categoryList, categoryId);
    };

    const getSupplierNameById = (supplierId: string) => {
        const supplier = supplierList.find(s => s._id === supplierId);
        return supplier ? supplier.name : '';
    };

    // Cập nhật tên category và supplier khi filter thay đổi
    useEffect(() => {
        if (filter.categoryId && !selectedCategoryName && categoryList.length > 0) {
            setSelectedCategoryName(getCategoryNameById(filter.categoryId));
        }
        if (filter.supplierId && !selectedSupplierName && supplierList.length > 0) {
            setSelectedSupplierName(getSupplierNameById(filter.supplierId));
        }
    }, [filter.categoryId, filter.supplierId]);

    // Cập nhật tên khi categoryList hoặc supplierList thay đổi
    useEffect(() => {
        if (filter.categoryId && categoryList.length > 0) {
            const categoryName = getCategoryNameById(filter.categoryId);
            if (categoryName && categoryName !== selectedCategoryName) {
                setSelectedCategoryName(categoryName);
            }
        }
        if (filter.supplierId && supplierList.length > 0) {
            const supplierName = getSupplierNameById(filter.supplierId);
            if (supplierName && supplierName !== selectedSupplierName) {
                setSelectedSupplierName(supplierName);
            }
        }
    }, [categoryList, supplierList]);

    // Tính toán tên hiển thị
    const displayCategoryName = selectedCategoryName || (filter.categoryId ? getCategoryNameById(filter.categoryId) : '') || 'Chọn danh mục...';
    const displaySupplierName = selectedSupplierName || (filter.supplierId ? getSupplierNameById(filter.supplierId) : '') || 'Chọn thương hiệu...';

    return (
        <View style={styles.container}>
            <View style={styles.stickySearchBarWrapper}>
                <View style={styles.searchBarRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBack}>
                        <Image source={assets.icons.back as ImageSourcePropType} style={styles.iconBackImg} />
                    </TouchableOpacity>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Tìm kiếm sản phẩm"
                            value={searchParam}
                            onChangeText={setSearchParam}
                            returnKeyType='search'
                            onSubmitEditing={() => {
                                if (searchParam.trim() !== "") {
                                    setFilter((prev) => ({ ...prev, search: searchParam.trim() }));
                                }
                            }}
                        />
                        <TouchableOpacity style={styles.iconCamera}></TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterOpen(v => !v)}>
                        <FilterIcon width={22} height={22} />
                        <Text style={styles.filterTextCustom}>Lọc</Text>
                    </TouchableOpacity>
                </View>

                {isFilterOpen && (
                    <Animated.View
                        style={[
                            styles.animatedFilterPanelAbsolute,
                            {
                                transform: [
                                    {
                                        translateY: filterAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-FILTER_PANEL_HEIGHT, 0],
                                        }),
                                    },
                                ],
                                opacity: filterAnim,
                            },
                        ]}
                    >
                        <View style={styles.filterPanel}>
                            <View style={styles.filterPanelLeft}>
                                {filterSections.map(section => (
                                    <TouchableOpacity
                                        key={section.key}
                                        style={[
                                            styles.filterPanelTab,
                                            selectedSection === section.key && styles.filterPanelTabActive,
                                        ]}
                                        onPress={() => handleSectionPress(section.key)}
                                    >
                                        <Text
                                            style={[
                                                styles.filterPanelTabText,
                                                selectedSection === section.key && styles.filterPanelTabTextActive,
                                            ]}
                                        >
                                            {section.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <ScrollView
                                ref={scrollViewRef}
                                style={styles.filterPanelRight}
                                onScroll={handleFilterScroll}
                                scrollEventThrottle={16}
                                removeClippedSubviews={true}
                                showsVerticalScrollIndicator={false}
                            >
                                <View ref={sectionRefs.current['category']} style={styles.filterSection}>
                                    <Text style={styles.filterSectionTitle}>Danh mục</Text>
                                    <TouchableOpacity 
                                        style={styles.categorySelector}
                                        onPress={handleCategoryPickerOpen}
                                    >
                                        <Text style={styles.categorySelectorText}>
                                            {displayCategoryName}
                                        </Text>
                                        <Icon name="chevron-forward" size={16} color={colors.grey[500]} />
                                    </TouchableOpacity>
                                </View>

                                <View ref={sectionRefs.current['brand']} style={styles.filterSection}>
                                    <Text style={styles.filterSectionTitle}>Thương hiệu</Text>
                                    <TouchableOpacity 
                                        style={styles.categorySelector}
                                        onPress={handleSupplierPickerOpen}
                                    >
                                        <Text style={styles.categorySelectorText}>
                                            {displaySupplierName}
                                        </Text>
                                        <Icon name="chevron-forward" size={16} color={colors.grey[500]} />
                                    </TouchableOpacity>
                                </View>

                                <View ref={sectionRefs.current['price']} style={styles.filterSection}>
                                    <Text style={styles.filterSectionTitle}>Khoảng giá</Text>
                                    <View style={styles.priceRow}>
                                        <TextInput
                                            style={styles.priceInput}
                                            placeholder="Tối thiểu"
                                            keyboardType="numeric"
                                            value={minPrice}
                                            onChangeText={setMinPrice}
                                        />
                                        <Text style={{ marginHorizontal: 8 }}>-</Text>
                                        <TextInput
                                            style={styles.priceInput}
                                            placeholder="Tối đa"
                                            keyboardType="numeric"
                                            value={maxPrice}
                                            onChangeText={setMaxPrice}
                                        />
                                    </View>
                                </View>
                                <View style={{ height: 100 }} />
                            </ScrollView>
                        </View>

                        <View style={styles.filterPanelFooter}>
                            <TouchableOpacity
                                style={styles.resetBtn}
                                onPress={() => {
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setSelectedCategoryId(undefined);
                                    setSelectedCategoryName('');
                                    setSelectedSupplierId(undefined);
                                    setSelectedSupplierName('');
                                    // Reset filter về trạng thái ban đầu
                                    setFilter(prev => ({ 
                                        ...prev, 
                                        categoryId: undefined,
                                        supplierId: undefined,
                                        minPrice: undefined,
                                        maxPrice: undefined
                                    }));
                                }}
                            >
                                <Text style={styles.resetBtnText}>Thiết lập lại</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.applyBtn} 
                                onPress={() => {
                                    // Áp dụng filter với tất cả các điều kiện đã chọn
                                    const newFilter = { ...filter };
                                    
                                    // Áp dụng category
                                    if (selectedCategoryId) {
                                        newFilter.categoryId = selectedCategoryId;
                                    } else {
                                        newFilter.categoryId = undefined;
                                    }
                                    
                                    // Áp dụng supplier
                                    if (selectedSupplierId) {
                                        newFilter.supplierId = selectedSupplierId;
                                    } else {
                                        newFilter.supplierId = undefined;
                                    }
                                    
                                    // Áp dụng price range
                                    if (minPrice && maxPrice) {
                                        newFilter.minPrice = parseInt(minPrice);
                                        newFilter.maxPrice = parseInt(maxPrice);
                                    } else if (minPrice) {
                                        newFilter.minPrice = parseInt(minPrice);
                                        newFilter.maxPrice = undefined;
                                    } else if (maxPrice) {
                                        newFilter.minPrice = undefined;
                                        newFilter.maxPrice = parseInt(maxPrice);
                                    } else {
                                        newFilter.minPrice = undefined;
                                        newFilter.maxPrice = undefined;
                                    }
                                    
                                    console.log('Applying filter:', newFilter);
                                    console.log('Selected category:', selectedCategoryId);
                                    console.log('Selected supplier:', selectedSupplierId);
                                    console.log('Price range:', minPrice, '-', maxPrice);
                                    
                                    setFilter({ ...newFilter });
                                    setIsFilterOpen(false);
                                }}
                            >
                                <Text style={styles.applyBtnText}>Áp dụng</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}

                {isFilterOpen && (
                    <TouchableOpacity
                        style={styles.overlayBlockInteraction}
                        activeOpacity={1}
                        onPress={() => setIsFilterOpen(false)}
                    />
                )}
            </View>

            <FlatList<ProductRespondSimplizeDto>
                data={pages?.data}
                numColumns={2}
                keyExtractor={(item, index) => item._id + index}
                renderItem={renderItem}
                contentContainerStyle={[styles.list, { paddingTop: 120 }]}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={
                    isLoadingMore ? (
                        <Text style={styles.loadingText}>Đang tải thêm...</Text>
                    ) : pages && !pages.hasNextPage ? (
                        <Text style={styles.loadingText}>Đã tải hết!</Text>
                    ) : null
                }
            />
            
            <CategoryPicker
                visible={isCategoryPickerVisible}
                onClose={() => setIsCategoryPickerVisible(false)}
                onSelectCategory={handleCategorySelect}
                selectedCategoryId={selectedCategoryId}
            />
            
            <SupplierPicker
                visible={isSupplierPickerVisible}
                onClose={() => setIsSupplierPickerVisible(false)}
                onSelectSupplier={handleSupplierSelect}
                selectedSupplierId={selectedSupplierId}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    overlayBlockInteraction: {
        position: 'absolute',
        top: 105,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        zIndex: 9,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background.default,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: '10%',
    },
    headerTitle: {
        fontWeight: 'bold',
        marginLeft: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.grey[200],
        borderRadius: BORDER_RADIUS.S,
        paddingHorizontal: 12,
        marginBottom: 10,
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
    },
    filters: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.grey[200],
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.S,
    },
    filterText: {
        marginLeft: 5,
    },
    dropdownContainer: {
        position: 'absolute',
        top: 40,
        left: 10,
        backgroundColor: colors.background.default,
        borderRadius: BORDER_RADIUS.S,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 8,
        zIndex: 1000,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minWidth: 150,
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: BORDER_RADIUS.S,
    },
    selectedDropdownItem: {
        backgroundColor: colors.blue.light,
    },
    dropdownText: {
        fontSize: 14,
        color: colors.text.primary,
    },
    selectedDropdownText: {
        color: colors.blue.main,
        fontWeight: '600',
    },
    list: {
        paddingBottom: 30,
    },
    card: {
        width: '48%',
        margin: '1%',
        borderRadius: BORDER_RADIUS.S,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background.default,
        padding: 10,
        alignItems: 'center',
        position: 'relative',
    },
    selectedCard: {
        borderColor: colors.blue.light,
        borderWidth: 2,
    },
    image: {
        width: 80,
        height: 100,
        resizeMode: 'contain',
    },
    stars: {
        fontSize: 14,
        color: colors.yellow.dark,
        marginTop: 5,
        marginLeft: '-40%',
    },
    title: {
        fontWeight: '600',
        marginVertical: 5,
        marginLeft: '0%',
    },
    price: {
        fontWeight: 'bold',
        color: colors.black,
        marginLeft: '-40%',
    },
    plusButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
    },
    iconpluss: {
        backgroundColor: colors.blue.main,
        ...sizes.icon.md,
        borderRadius: BORDER_RADIUS.XL,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        textAlign: 'center',
        paddingVertical: 10,
        color: colors.grey[500],
    },
    productCard: {
        width: '48%',

        backgroundColor: colors.white,
        height: 280,
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.grey[400],
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        position: 'relative',
        marginHorizontal: 3,

    },
    productImage: {

        height: 160,
        resizeMode: 'contain',
        marginBottom: 4,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    starIcon: {
        width: 15,
        height: 14,
        marginRight: 2,
    },
    productName: {
        fontSize: 15,
        marginBottom: 2,
    },
    productPrice: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    addButton: {
        backgroundColor: colors.blue.main,
        width: 45,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 0,
        right: 0,
        borderTopEndRadius: 6,
        borderBottomStartRadius: 6

    },
    plusIcon: {
        width: 16,
        height: 16,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.grey[300],
        borderRadius: 8,
        padding: 8,
        fontSize: 15,
        backgroundColor: '#fff',
    },
    searchBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10%',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    iconBack: {
        marginRight: 6,
    },
    iconBackImg: {
        width: 24,
        height: 24,
        tintColor: colors.app.primary.main,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.app.primary.main,
        borderRadius: 22,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        height: 44,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text.primary,
    },
    iconCamera: {
        marginLeft: 8,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    filterIcon: {
        width: 22,
        height: 22,
        tintColor: colors.app.primary.main,
    },
    filterTextCustom: {
        color: colors.app.primary.main,
        marginLeft: 2,
        fontWeight: 'bold',
    },
    stickySearchBarWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: '#fff',
        paddingTop: 0,
        paddingBottom: 6,
        shadowColor: colors.black,
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 4,
    },
    filterPanelOverlay: {
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.08)',
        zIndex: 20,
        justifyContent: 'flex-start',
    },
    filterPanel: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: '80%',
        marginTop: 0,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
        marginHorizontal: 0,
        flex: 1,
    },
    filterPanelLeft: {
        width: 110,
        backgroundColor: colors.grey[100],
        paddingVertical: 12,
        borderRightWidth: 1,
        borderRightColor: colors.grey[200],
    },
    filterPanelTab: {
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: 'flex-start',
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
    },
    filterPanelTabActive: {
        backgroundColor: '#fff',
        borderLeftColor: colors.app.primary.main,
    },
    filterPanelTabText: {
        fontSize: 15,
        color: colors.text.secondary,
    },
    filterPanelTabTextActive: {
        color: colors.app.primary.main,
        fontWeight: 'bold',
    },
    filterPanelRight: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    filterSection: {
        marginBottom: 32,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: colors.text.primary,
    },
    filterPanelFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: colors.grey[200],
    },
    resetBtn: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.app.primary.main,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginRight: 8,
    },
    resetBtnText: {
        color: colors.app.primary.main,
        fontWeight: 'bold',
        fontSize: 16,
    },
    applyBtn: {
        flex: 1,
        backgroundColor: colors.app.primary.main,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginLeft: 8,
    },
    applyBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    animatedFilterPanel: {
        // Không dùng position absolute nữa
        overflow: 'hidden',
        backgroundColor: '#fff',
        width: '100%',
    },
    animatedFilterPanelAbsolute: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 105, // ngay dưới search bar (search bar sticky height ~70)
        overflow: 'hidden',
        backgroundColor: '#fff',
        width: '100%',
        zIndex: 20,
        elevation: 10,
    },
    categorySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.grey[100],
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    categorySelectorText: {
        fontSize: 16,
        color: colors.text.primary,
        flex: 1,
    },
});
