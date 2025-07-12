import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { getFavoriteList, removeFromFavorite, addToFavorite } from '../favorite.slice';
import FavoriteCard from '../components/FavoriteCard';
import { colors } from '../../../shared/theme/colors';
import { assets } from '../../../shared/theme/assets';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { debounce } from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FavoriteScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const mainNav = useMainNavigation();
    const { items, getFavoriteStatus, removeFromFavoriteStatus, favoriteIds } = useSelector((state: RootState) => state.favorite);
    const [searchText, setSearchText] = useState('');

    // Lọc danh sách sản phẩm theo tên
    const filteredItems = items.filter(item =>
        item.name?.toLowerCase().includes(searchText.trim().toLowerCase())
    );

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

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => mainNav.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Yêu thích</Text>
        </View>
    );

    const renderSearchBar = () => (
        <View style={styles.searchContainer}>
            <Icon name="search" size={22} color={colors.grey[500]} style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm sản phẩm yêu thích..."
                placeholderTextColor={colors.grey[500]}
                value={searchText}
                onChangeText={setSearchText}
                underlineColorAndroid="transparent"
            />
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Icon name="favorite-border" size={70} color={colors.grey[300]} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>Bạn chưa có sản phẩm yêu thích nào.</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.app.primary.main} barStyle="light-content" />
            {renderHeader()}
            {renderSearchBar()}
            {(getFavoriteStatus === 'loading') ? (
                <Text style={styles.loadingText}>Đang tải danh sách yêu thích...</Text>
            ) : (
                <FlatList
                    data={filteredItems}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <FavoriteCard
                            item={item}
                            isFavorite={favoriteIds.includes(item._id)}
                            onPress={handleCardPress}
                            onHeartPress={handleHeartPress}
                        />
                    )}
                    contentContainerStyle={filteredItems.length === 0 ? { flex: 1 } : styles.flatListContent}
                    ListEmptyComponent={renderEmpty}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.default,
        paddingHorizontal: 0,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.app.primary.main,
        borderBottomWidth: 1,
        borderBottomColor: colors.app.primary.main,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 24,
        paddingBottom: 12,
        paddingHorizontal: 16,
    },
    backButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        marginRight: 40, // Để căn giữa khi có icon back bên trái
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 24,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 10,
        height: 48,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.10,
        shadowRadius: 3,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.text.primary,
    },
    flatListContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: colors.text.secondary,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
    },
    emptyIcon: {
        marginBottom: 15,
    },
    emptyText: {
        fontSize: 18,
        color: colors.text.secondary,
        textAlign: 'center',
    },
});