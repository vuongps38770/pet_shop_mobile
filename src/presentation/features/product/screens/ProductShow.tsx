import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageSourcePropType,
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
import { fetchPages, addToPages } from '../product.slice'
import { ProductRespondSimplizeDto } from 'src/presentation/dto/res/product-respond.dto';
import ProductCard from 'shared/components/flat-list-items/ProductCard';




export const ProductShow = () => {
    const navigation = useMainNavigation()


    const route = useRoute<RouteProp<MainStackParamList, 'ProductShow'>>()


    const [filter, setFilter] = useState<FilterOptions>({ ...route.params.filter, limit: 10 })
    const [searchParam, setSearchParam] = useState("")
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedSort, setSelectedSort] = useState('Mới nhất');
    const [title, setTitle] = useState("")
    const sortOptions = [
        'Mới nhất',
        'Cũ nhất',
        'Giá tăng dần',
        'Giá giảm dần',
        'Đánh giá cao nhất',
        'Huỷ lọc'

    ];

    const pages = useSelector((state: RootState) => state.product.pages)


    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        const getData = async () => {
            dispatch(fetchPages(filter))

            setIsLoadingMore(false);
            let title = "";

            if (filter.search) {
                if (filter.categoryId || filter.rootCategoryId) {
                    title = `Kết quả của: ${route.params.title}/"${filter.search}"`;
                } else {
                    title = `Kết quả của: "${filter.search}"`;
                }
            } else if (filter.categoryId || filter.rootCategoryId) {
                title = `Kết quả của: ${route.params.title}`;
            }

            setTitle(title);
        };
        console.log(filter);

        getData();
    }, [filter]);

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
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={assets.icons.back as ImageSourcePropType} />
                </TouchableOpacity>
                <Typography variant="h5" style={styles.headerTitle}>
                    {title}
                </Typography>
            </View>

            <View style={styles.searchContainer}>
                <Image
                    source={assets.icons.search.search as ImageSourcePropType}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search in Pet Shop...."
                    value={searchParam}
                    onChangeText={(text) =>
                        setSearchParam(text)
                    }
                    returnKeyType='search'
                    onSubmitEditing={() => {
                        if (searchParam.trim() !== "") {
                            setFilter((prev) => ({ ...prev, search: searchParam.trim() }))
                        }
                    }}
                />
            </View>

            <View style={styles.filters}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowDropdown(!showDropdown)}
                >
                    <Image source={assets.icons.search.vecter as ImageSourcePropType} />
                    <Text style={styles.filterText}>Sắp xếp</Text>
                </TouchableOpacity>

                {showDropdown && (
                    <View style={styles.dropdownContainer}>
                        {sortOptions.map((option, index) => (
                            <TouchableOpacity
                                key={`${option}-${index}`}
                                style={[
                                    styles.dropdownItem,
                                    selectedSort === option && styles.selectedDropdownItem
                                ]}
                                onPress={() => {
                                    setSelectedSort(option);
                                    setShowDropdown(false);

                                    if (option === sortOptions[0]) { // Mới nhất
                                        setFilter((prev) => ({ ...prev, page: 1, sortBy: 'createdDate', order: 'desc' }))
                                    }
                                    if (option === sortOptions[1]) { // Cũ nhất
                                        setFilter((prev) => ({ ...prev, page: 1, sortBy: 'createdDate', order: 'asc' }))
                                    }
                                    if (option === sortOptions[2]) { // Giá tăng dần
                                        setFilter((prev) => ({ ...prev, page: 1, sortBy: 'minPromotionalPrice', order: 'asc' }))
                                    }
                                    if (option === sortOptions[3]) { // Giá giảm dần
                                        setFilter((prev) => ({ ...prev, page: 1, sortBy: 'minPromotionalPrice', order: 'desc' }))
                                    }
                                    if (option === sortOptions[4]) { // Đánh giá cao nhất
                                        // TODO: sau này có đơn rồi làm
                                    }
                                    if (option === sortOptions[5]) { // Huỷ lọc
                                        setFilter({ limit: 10 })
                                        setSelectedSort('')
                                    }
                                }}
                            >
                                <Text style={[
                                    styles.dropdownText,
                                    selectedSort === option && styles.selectedDropdownText
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <FlatList<ProductRespondSimplizeDto>
                data={pages?.data}
                numColumns={2}
                keyExtractor={(item: ProductRespondSimplizeDto, index) => item._id + index}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
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
        </View>
    );
};

const styles = StyleSheet.create({
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
});
