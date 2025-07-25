import React, { useCallback, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    Platform, 
    UIManager, 
    LayoutAnimation, 
    Dimensions, 
    TextInput, 
    ScrollView,
    Modal
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { CategoryRespondDto } from 'src/presentation/dto/res/category-respond.dto';
import { colors } from 'shared/theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { fetchCategorByType } from '../product.slice';
import Icon from 'react-native-vector-icons/Ionicons';
import { Fonts } from 'shared/theme/fonts';

const screenWidth = Dimensions.get('window').width;

// Bật LayoutAnimation cho Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DEFAULT_CATEGORY_ICON = 'https://cdn-icons-png.flaticon.com/512/616/616408.png';

interface CategoryPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectCategory: (categoryId: string, categoryName: string) => void;
    selectedCategoryId?: string;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
    visible,
    onClose,
    onSelectCategory,
    selectedCategoryId
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
    const [expandedL2, setExpandedL2] = useState<Set<string>>(new Set());
    const [filteredCategories, setFilteredCategories] = useState<CategoryRespondDto[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const categoryList = useSelector((state: RootState) => state.product.categories);

    useEffect(() => {
        if (visible) {
            dispatch(fetchCategorByType());
        }
    }, [visible, dispatch]);

    // Cập nhật filteredCategories khi searchQuery hoặc categoryList thay đổi
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredCategories(categoryList);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = categoryList.filter(
                (category) =>
                    category.name.toLowerCase().includes(lowerCaseQuery) ||
                    category.children?.some(
                        (child) =>
                            child.name.toLowerCase().includes(lowerCaseQuery) ||
                            child.children?.some((grandchild) =>
                                grandchild.name.toLowerCase().includes(lowerCaseQuery)
                            )
                    )
            );
            setFilteredCategories(filtered);
        }
    }, [searchQuery, categoryList]);

    // Khi mount, tự động chọn root đầu tiên nếu có và không có query
    useEffect(() => {
        if (categoryList && categoryList.length > 0 && !selectedRootId && searchQuery.trim() === "") {
            setSelectedRootId(categoryList[0]._id);
        }
    }, [categoryList, searchQuery]);

    // Khi đổi root, reset expandedL2
    useEffect(() => {
        setExpandedL2(new Set());
    }, [selectedRootId]);

    const handleL1Select = (categoryId: string) => {
        setSelectedRootId(categoryId === selectedRootId ? null : categoryId);
    };

    const handleL2Toggle = (categoryId: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedL2(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(categoryId)) {
                newExpanded.delete(categoryId);
            } else {
                newExpanded.add(categoryId);
            }
            return newExpanded;
        });
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const handleCategorySelect = (categoryId: string, categoryName: string) => {
        onSelectCategory(categoryId, categoryName);
        onClose();
    };

    const selectedCategory = filteredCategories.find(
        (cat: CategoryRespondDto) => cat._id === selectedRootId
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
                    <Text style={styles.headerTitle}>Chọn Danh Mục</Text>
                    <TouchableOpacity style={styles.headerCloseBtn} onPress={onClose}>
                        <Icon name="close" size={22} color={colors.grey[600]} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBarContainer}>
                    <Icon name="search" size={20} color={colors.grey[500]} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Tìm kiếm danh mục..."
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

                {/* Level 1 Categories */}
                <View style={styles.l1CategoriesContainer}>
                    {filteredCategories.length > 0 ? (
                        <FlashList
                            data={filteredCategories}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    key={item._id}
                                    onPress={() => handleL1Select(item._id)}
                                    style={[styles.l1CategoryItem, selectedRootId === item._id && styles.l1CategoryItemSelected]}
                                    activeOpacity={0.85}
                                >
                                    <Image 
                                        source={item.icon ? { uri: item.icon } : { uri: DEFAULT_CATEGORY_ICON }} 
                                        style={styles.l1CategoryImage} 
                                    />
                                    <Text style={[styles.l1CategoryText, selectedRootId === item._id && styles.l1CategoryTextSelected]} numberOfLines={2}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item._id}
                            extraData={selectedRootId}
                            estimatedItemSize={100}
                            contentContainerStyle={styles.l1CategoriesListContent}
                        />
                    ) : (
                        searchQuery.length > 0 ? (
                            <View style={styles.emptyStateContainer}>
                                <Icon name="search" size={60} color={colors.grey[300]} />
                                <Text style={styles.emptyStateText}>Không tìm thấy danh mục cho "{searchQuery}"</Text>
                                <TouchableOpacity onPress={clearSearch} style={styles.clearSearchTextButton}>
                                    <Text style={styles.clearSearchText}>Xóa tìm kiếm</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.loadingStateContainer}>
                                <Text style={styles.loadingStateText}>Đang tải danh mục...</Text>
                            </View>
                        )
                    )}
                </View>

                {/* Level 2 and Level 3 Categories */}
                {selectedCategory ? (
                    <View style={styles.l2l3CategoriesContainer}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedCategory.children && selectedCategory.children.length > 0 ? (
                                selectedCategory.children.map((l2Category, index) => (
                                    <View key={l2Category._id} style={styles.l2CategoryWrap}>
                                        <TouchableOpacity
                                            onPress={() => handleCategorySelect(l2Category._id, l2Category.name)}
                                            style={[
                                                styles.l2CategoryItem,
                                                selectedCategoryId === l2Category._id && styles.l2CategoryItemSelected
                                            ]}
                                            activeOpacity={0.85}
                                        >
                                            <Text style={[
                                                styles.l2CategoryTitle,
                                                selectedCategoryId === l2Category._id && styles.l2CategoryTitleSelected
                                            ]}>
                                                {l2Category.name}
                                            </Text>
                                            {l2Category.children && l2Category.children.length > 0 && (
                                                <TouchableOpacity
                                                    onPress={() => handleL2Toggle(l2Category._id)}
                                                    style={styles.l2CategoryToggle}
                                                >
                                                    <Icon
                                                        name={expandedL2.has(l2Category._id) ? "chevron-up" : "chevron-down"}
                                                        size={22}
                                                        color={colors.grey[500]}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        </TouchableOpacity>

                                        {expandedL2.has(l2Category._id) && l2Category.children && l2Category.children.length > 0 && (
                                            <View style={styles.l3ListContainer}>
                                                <FlashList
                                                    data={l2Category.children}
                                                    renderItem={({ item: l3Category }) => (
                                                        <TouchableOpacity
                                                            key={l3Category._id}
                                                            onPress={() => handleCategorySelect(l3Category._id, l3Category.name)}
                                                            style={[
                                                                styles.l3CategoryItem,
                                                                selectedCategoryId === l3Category._id && styles.l3CategoryItemSelected
                                                            ]}
                                                        >
                                                            <Text style={[
                                                                styles.l3CategoryText,
                                                                selectedCategoryId === l3Category._id && styles.l3CategoryTextSelected
                                                            ]}>
                                                                {l3Category.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    keyExtractor={(item) => item._id}
                                                    estimatedItemSize={50}
                                                    numColumns={2}
                                                    contentContainerStyle={styles.l3ListContent}
                                                />
                                            </View>
                                        )}

                                        {expandedL2.has(l2Category._id) && (!l2Category.children || l2Category.children.length === 0) && (
                                            <Text style={styles.noSubCategoryText}>Không có danh mục con</Text>
                                        )}
                                    </View>
                                ))
                            ) : (
                                <View style={styles.noSubCategoriesContainer}>
                                    <Icon name="layers" size={60} color={colors.grey[300]} />
                                    <Text style={styles.noSubCategoriesText}>Không có danh mục nào cho danh mục này</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Icon name="layers" size={60} color={colors.grey[300]} />
                        <Text style={styles.emptyStateText}>Chọn một danh mục ở trên để khám phá các danh mục con</Text>
                    </View>
                )}
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
    l1CategoriesContainer: {
        paddingVertical: 10,
    },
    l1CategoriesListContent: {
        paddingHorizontal: 16,
    },
    l1CategoryItem: {
        width: 90,
        height: 110,
        backgroundColor: colors.white,
        borderRadius: 12,
        marginHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    l1CategoryItemSelected: {
        borderColor: colors.app.primary.main,
        shadowColor: colors.app.primary.main,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    l1CategoryImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 5,
    },
    l1CategoryText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.text.secondary,
        textAlign: 'center',
    },
    l1CategoryTextSelected: {
        color: colors.app.primary.main,
        fontWeight: 'bold',
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
    l2l3CategoriesContainer: {
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
    l2CategoryWrap: {
        borderBottomWidth: 1,
        borderBottomColor: colors.grey[100],
    },
    l2CategoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: colors.white,
    },
    l2CategoryItemSelected: {
        backgroundColor: colors.app.primary.light,
    },
    l2CategoryTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text.primary,
    },
    l2CategoryTitleSelected: {
        color: colors.app.primary.main,
        fontWeight: 'bold',
    },
    l2CategoryToggle: {
        padding: 5,
    },
    l3ListContainer: {
        backgroundColor: colors.grey[50],
        paddingTop: 8,
        paddingBottom: 4,
    },
    l3ListContent: {
        paddingHorizontal: 10,
    },
    l3CategoryItem: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.grey[200],
        margin: 6,
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    l3CategoryItemSelected: {
        backgroundColor: colors.app.primary.light,
        borderColor: colors.app.primary.main,
    },
    l3CategoryText: {
        fontSize: 13,
        color: colors.text.primary,
        fontWeight: 'normal',
        textAlign: 'center',
    },
    l3CategoryTextSelected: {
        color: colors.app.primary.main,
        fontWeight: 'bold',
    },
    noSubCategoryText: {
        textAlign: 'center',
        paddingVertical: 15,
        color: colors.grey[500],
        fontSize: 14,
    },
    noSubCategoriesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    noSubCategoriesText: {
        fontSize: 16,
        color: colors.grey[500],
        textAlign: 'center',
        marginTop: 10,
    },
}); 