import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, UIManager, LayoutAnimation, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { CategoryRespondDto } from '../../../dto/res/category-respond.dto';

import { colors } from 'shared/theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { fetchCategorByType } from '../product.slice'
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import CurvedUpIcon from 'assets/icons/curved-up.svg';
import CurvedDownIcon from 'assets/icons/curved-down.svg';
import { Fonts } from 'theme/fonts';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
const screenWidth = Dimensions.get('window').width

export const AllCategoriesScreen = () => {
  // State chọn root (tầng 1)
  const [selectedRootId, setSelectedRootId] = useState<string>("");
  const [currentCategoryId, setCurrentCategoryId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useMainNavigation()
  const categoryList = useSelector((state: RootState) => state.product.categories)
  useFocusEffect(
      React.useCallback(() => {
        dispatch(fetchCategorByType());
      }, [dispatch])
    );
  // Khi mount, tự động chọn root đầu tiên nếu có
  useEffect(() => {
    if (categoryList && categoryList.length > 0 && !selectedRootId) {
      setSelectedRootId(categoryList[0]._id);
    }
  }, [categoryList]);

  // Khi đổi root, reset currentCategoryId
  useEffect(() => {
    setCurrentCategoryId("");
  }, [selectedRootId]);

  // Tab tầng 1: các root
  const renderRootTab = ({ item }: { item: CategoryRespondDto }) => {
    const isSelected = item._id === selectedRootId;
    return (
      <TouchableOpacity
        onPress={() => setSelectedRootId(item._id)}
        style={[styles.tabItem, isSelected && styles.activeTab]}
        activeOpacity={0.85}
      >
        <Text style={[styles.tabText, isSelected && styles.activeTabText]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Danh mục con cấp 3 (children của children)
  const renderItemChilderen = ({ item }: { item: CategoryRespondDto }) => {
    return (
      <TouchableOpacity
        style={styles.childCard}
        onPress={() => {
          navigation.navigate('ProductShow', { filter: { categoryId: item._id }, title: item.name })
        }}
        activeOpacity={0.85}
      >
        <Text style={styles.childCardText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Danh mục gốc (tầng 2)
  const renderItemCategory = ({ item }: { item: CategoryRespondDto }) => {
    const isSelected = item._id === currentCategoryId;
    return (
      <View style={styles.categoryCardWrap}>
        <View style={[styles.categoryCard, isSelected && styles.categoryCardActive]}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('ProductShow', { title: item.name, filter: { rootCategoryId: item._id } })}>
            <Text style={styles.categoryCardTitle}>{item.name}</Text>
          </TouchableOpacity>
          {item.children && item.children.length > 0 && (
            <TouchableOpacity
              onPress={() => setCurrentCategoryId(currentCategoryId == item._id ? "" : item._id)}
              style={styles.categoryCardArrow}
              activeOpacity={0.7}
            >
              {isSelected
                ? <CurvedUpIcon width={22} height={22} fill={colors.app.primary.main} />
                : <CurvedDownIcon width={22} height={22} fill={colors.grey[400]} />
              }
            </TouchableOpacity>
          )}
        </View>
        {/* Tầng 3: children của item */}
        {isSelected && (
          <View style={styles.childListWrap}>
            {item.children && item.children.length > 0 ?
              <FlashList<CategoryRespondDto>
                data={item.children}
                renderItem={renderItemChilderen}
                keyExtractor={(item) => item._id}
                numColumns={2}
                estimatedItemSize={100}
                extraData={currentCategoryId}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{}}
              />
              :
              <Text style={styles.noChildText}>Hiện chưa có danh mục!</Text>
            }
          </View>
        )}
      </View>
    );
  };

  // Lấy root đang chọn
  const selectedRoot = categoryList.find((cat: CategoryRespondDto) => cat._id === selectedRootId);
  const rootChildren = selectedRoot ? selectedRoot.children : [];

  // Thay đổi ở tầng 2: nếu rootChildren rỗng thì show dòng "Hiện chưa có danh mục!"
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerWrap}>
        <Text style={styles.headerTitle}>Tất Cả Danh Mục</Text>
        <TouchableOpacity style={styles.headerCloseBtn} onPress={() => navigation.pop()}>
          <Icon name="close" size={22} color={colors.app.primary.main} />
        </TouchableOpacity>
      </View>
      {/* tab tầng 1: các root */}
      <View style={styles.tabBar}>
        {categoryList.length > 0 ? (
          <FlashList
            data={categoryList}
            renderItem={renderRootTab}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            extraData={selectedRootId}
            estimatedItemSize={56}
          />
        ) : (
          <Text style={{textAlign: 'center', padding: 12, color: colors.text.secondary}}>Đang tải danh mục...</Text>
        )}
      </View>
      {/* danh muc goc (tầng 2) */}
      {rootChildren && rootChildren.length > 0 ? (
        <FlashList<CategoryRespondDto>
          data={rootChildren}
          renderItem={renderItemCategory}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          estimatedItemSize={100}
          extraData={currentCategoryId}
          style={{ marginTop: 20 }}
        />
      ) : (
        <Text style={styles.noChildText}>Hiện chưa có danh mục!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: colors.background.default,
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.app.primary.main,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 18,
    elevation: 4,
    shadowColor: colors.app.primary.main,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
        fontFamily: Fonts.roboto.bold,
        color: colors.white,
  },
  headerCloseBtn: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCloseIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.app.primary.main,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  tabItem: {
    minWidth: 90,
    minHeight: 40, // thêm dòng này để đảm bảo chiều cao tối thiểu
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: colors.grey[100],
    borderRadius: 18,
    marginHorizontal: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    justifyContent:'center',
    alignItems:'center'
  },
  activeTab: {
    backgroundColor: colors.app.primary.main,
    shadowColor: colors.app.primary.main,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  categoryCardWrap: {
    marginHorizontal: 16,
    marginBottom: 18,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.grey[200],
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryCardActive: {
    borderColor: colors.app.primary.main,
    shadowColor: colors.app.primary.main,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  categoryCardArrow: {
    marginLeft: 12,
    padding: 4,
    borderRadius: 12,
    backgroundColor: colors.grey[100],
  },
  childListWrap: {
    marginTop: 12,
    backgroundColor: colors.grey[100],
    borderRadius: 12,
    padding: 10,
  },
  childCard: {
    flex: 1,
    margin: 6,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.app.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  childCardText: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
  },
  noChildText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    color: colors.text.secondary,
    paddingVertical: 16,
  },
});
