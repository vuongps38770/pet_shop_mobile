import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { getFavoriteList, removeFromFavorite, addToFavorite } from '../favorite.slice';
import FavoriteCard from '../components/FavoriteCard';
import { colors } from '../../../shared/theme/colors';
import { assets } from '../../../shared/theme/assets';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { debounce } from 'lodash';

const FavoriteScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const mainNav = useMainNavigation();
    const { items, getFavoriteStatus, removeFromFavoriteStatus, favoriteIds } = useSelector((state: RootState) => state.favorite);

    const [searchText, setSearchText] = useState('');


    useEffect(() => {
        const itemIds = items.map(i => i._id);
        const idsChanged =
            favoriteIds.length !== itemIds.length ||
            !favoriteIds.every(id => itemIds.includes(id));

        if (items.length === 0 || idsChanged) {
            dispatch(getFavoriteList());
        }
    }, []);

    const handleCardPress = (productId: string) => {
        mainNav.navigate('ProductDetail', { productId });
    };

    const handleHeartPress = debounce((productId: string, isFavorite: boolean) => {
        if (!isFavorite) {
            dispatch(removeFromFavorite(productId));
        } else {
            dispatch(addToFavorite({ productId: productId }));
        }
    }, 300);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => mainNav.goBack()} style={styles.backButton}>
                    <Image source={assets.icons.back} style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.deliveryContainer}>
                    <Text style={styles.deliverToText}>Deliver to</Text>
                    <Text style={styles.addressText}>5033 Lakeway Ct</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Image source={assets.icons.homeScreen.search} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor={colors.grey[500]}
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>


            {/* Danh sách sản phẩm yêu thích */}
            {(getFavoriteStatus === 'loading') ? (
                <Text style={styles.loadingText}>Đang tải danh sách yêu thích...</Text>
            ) : items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>❤️</Text>
                    <Text style={styles.emptyText}>Bạn chưa có sản phẩm yêu thích nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <FavoriteCard
                            item={item}
                            isFavorite={favoriteIds.includes(item._id)}
                            onPress={handleCardPress}
                            onHeartPress={handleHeartPress}
                        />
                    )}
                    scrollEnabled={false}
                    contentContainerStyle={styles.flatListContent}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                />
            )}
        </ScrollView>
    );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.default,
        paddingHorizontal: 16,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    backButton: {
        padding: 5,
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    deliveryContainer: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    deliverToText: {
        fontSize: 14,
        color: colors.grey[600],
    },
    addressText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.app.primary.main,
        marginLeft: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 10,
        paddingHorizontal: 12,
        marginVertical: 10,
        height: 48,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: colors.grey[500],
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.text.primary,
    },



    filterButton: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 8,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    filterIcon: {
        width: 20,
        height: 20,
        tintColor: colors.app.primary.main,
    },
    flatListContent: {
        paddingBottom: 20,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: colors.text.secondary,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 15,
    },
    emptyText: {
        fontSize: 18,
        color: colors.text.secondary,
        textAlign: 'center',
    },
});