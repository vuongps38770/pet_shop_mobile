import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProductReviewSection from '../components/ProductReviewSection';
import BackIcon from 'assets/icons/back.svg';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';

const PRODUCT_ID = '683eb18c148e72b5b379f648'; // truyền id sản phẩm thực tế

const ReviewScreen = () => {
  const navigation = useMainNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={()=>navigation.goBack()} >
          <BackIcon width={20} height={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá</Text>
        <View />
      </View>
      <ProductReviewSection productId={PRODUCT_ID} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  back: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ReviewScreen;
