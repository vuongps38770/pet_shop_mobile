import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { CategoryRespondDto } from '../../../dto/res/category-respond.dto';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { fetchCategorByType } from '../../../features/product/product.slice';
import CurvedUpIcon from 'assets/icons/curved-up.svg';
import CurvedDownIcon from 'assets/icons/curved-down.svg';
import { colors } from 'shared/theme/colors';
import { Fonts } from 'theme/fonts';

interface CategoryPickerPopupProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (categoryId: string) => void;
}

const CategoryPickerPopup: React.FC<CategoryPickerPopupProps> = ({ visible, onClose, onSelect }) => {
  const [selectedRootId, setSelectedRootId] = useState<string>("");
  const [currentCategoryId, setCurrentCategoryId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const categoryList = useSelector((state: RootState) => state.product.categories);

  useEffect(() => {
    if (visible) {
      dispatch(fetchCategorByType());
    }
  }, [visible, dispatch]);

  useEffect(() => {
    if (categoryList && categoryList.length > 0 && !selectedRootId) {
      setSelectedRootId(categoryList[0]._id);
    }
  }, [categoryList, selectedRootId]);

  useEffect(() => {
    setCurrentCategoryId("");
  }, [selectedRootId]);

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


  const handleSelectCategory = (category: CategoryRespondDto) => {
    onSelect(category._id);
    onClose();
  };

  const renderItemChilderen = ({ item }: { item: CategoryRespondDto }) => {
    return (
      <TouchableOpacity
        style={styles.childCard}
        onPress={() => handleSelectCategory(item)}
        activeOpacity={0.85}
      >
        <Text style={styles.childCardText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderItemCategory = ({ item }: { item: CategoryRespondDto }) => {
    const isSelected = item._id === currentCategoryId;
    const hasChildren = item.children && item.children.length > 0;
    return (
      <View style={styles.categoryCardWrap}>
        <View style={[styles.categoryCard, isSelected && styles.categoryCardActive]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              if (!hasChildren) handleSelectCategory(item);
            }}
          >
            <Text style={styles.categoryCardTitle}>{item.name}</Text>
          </TouchableOpacity>
          {hasChildren && (
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
            {item.children && item.children.length > 0 ? (
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
            ) : (
              <Text style={styles.noChildText}>Hiện chưa có danh mục!</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const selectedRoot = categoryList.find((cat: CategoryRespondDto) => cat._id === selectedRootId);
  const rootChildren = selectedRoot ? selectedRoot.children : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          {/* header */}
          <View style={styles.headerWrap}>
            <Text style={styles.headerTitle}>Chọn danh mục</Text>
            <TouchableOpacity style={styles.headerCloseBtn} onPress={onClose}>
              <Image source={require('../../../../../assets/icons/Close.png')} style={styles.headerCloseIcon} />
            </TouchableOpacity>
          </View>
          {/* tab tầng 1: các root */}
          <View style={styles.tabBar}>
            <FlashList
              data={categoryList}
              renderItem={renderRootTab}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              extraData={selectedRootId}
              estimatedItemSize={100}
            />
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
      </View>
    </Modal>
  );
};

export default CategoryPickerPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: '92%',
    maxHeight: '90%',
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.app.primary.main,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    elevation: 4,
    shadowColor: colors.app.primary.main,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
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