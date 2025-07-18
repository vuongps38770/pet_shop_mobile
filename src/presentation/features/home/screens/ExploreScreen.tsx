import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, Animated } from 'react-native'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { colors } from '../../../shared/theme/colors';
import { FormatProduct } from 'shared/components/format-price';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchCategorySuggest, fetchPages, fetchBanners, fetchSpecialRatings, fetchHotVouchers, resetExploreState } from '../explore.slice';
import { addToCart } from 'src/presentation/features/cart/cart.slice';
import MasonryList from '@react-native-seoul/masonry-list';
import { ProductRespondSimplizeDto } from 'src/presentation/dto/res/product-respond.dto';
import { useNavigation } from '@react-navigation/native';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageSlider from 'shared/components/Image-slider';
import { useFocusEffect } from '@react-navigation/native';

const DEFAULT_CATEGORY_ICON = 'https://cdn-icons-png.flaticon.com/512/616/616408.png';

const ProductSimpleCard = ({ product, onAddToCart }: { product: ProductRespondSimplizeDto, onAddToCart?: (product: ProductRespondSimplizeDto) => void }) => {
  const navigation = useMainNavigation();
  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(product);
  };

  const handlePress = () => {
    navigation.navigate('ProductDetail', { productId: product._id });
  };

  return (
    <View style={styles.productSimpleCard}>
      <TouchableOpacity style={{ width: '100%' }} activeOpacity={0.85} onPress={handlePress}>
        <Image source={{ uri: product.images?.[0] }} style={styles.productSimpleImg} />
        <View style={styles.starRow}>
          <FontAwesome name="star" size={15} color="#FFA726" />
          <Text> {typeof product.rating?.average === 'number'
            ? product.rating.average.toFixed(1)
            : '0.0'} ({product.rating?.total || 0} đánh giá)</Text>
        </View>
        <Text style={styles.productSimpleName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productSimplePrice}>
          <FormatProduct item={product} />
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.addToCartBtn}
        onPress={handleAddToCart}
        activeOpacity={0.85}
      >
        <Image source={require('../../../../../assets/icons/cart.png')} style={styles.addToCartIconTextBtn} />
        <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
      </TouchableOpacity> */}
    </View>
  );
};






const ARTICLES = [
  { id: 1, title: 'Cách chăm sóc mèo con', image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80', desc: 'Hướng dẫn chi tiết cho người mới nuôi mèo.' },
  { id: 2, title: 'Chó bị rụng lông phải làm sao?', image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80', desc: 'Nguyên nhân và cách xử lý khi chó rụng lông.' },
];





const FAQS = [
  {
    id: 1,
    question: 'Nên tắm cho chó mèo bao lâu 1 lần?',
    answer: 'Chó: 1-2 tuần/lần. Mèo: 1-2 tháng/lần. Tùy thuộc vào loại lông, hoạt động và thời tiết.'
  },
  {
    id: 2,
    question: 'Có nên cho mèo ăn xương cá?',
    answer: 'Không nên! Xương cá dễ gây hóc và tổn thương hệ tiêu hóa. Chỉ cho ăn thịt cá đã lọc xương.'
  },
  {
    id: 3,
    question: 'Thú cưng bị rụng lông nhiều phải làm sao?',
    answer: 'Có thể do thiếu dinh dưỡng, stress hoặc bệnh lý. Nên đưa đến bác sĩ thú y để kiểm tra.'
  },
  {
    id: 4,
    question: 'Nên cho chó mèo ăn mấy bữa một ngày?',
    answer: 'Chó: 2-3 bữa/ngày. Mèo: 2-4 bữa/ngày. Tùy theo độ tuổi và kích thước.'
  },
  {
    id: 5,
    question: 'Có cần tiêm phòng cho thú cưng không?',
    answer: 'Rất cần thiết! Tiêm phòng giúp bảo vệ thú cưng khỏi các bệnh nguy hiểm.'
  },
  {
    id: 6,
    question: 'Thú cưng bị nôn mửa có nguy hiểm không?',
    answer: 'Nếu nôn 1-2 lần có thể do ăn quá nhanh. Nếu nôn nhiều lần cần đưa đến bác sĩ ngay.'
  },
  {
    id: 7,
    question: 'Nên chọn thức ăn khô hay ướt cho thú cưng?',
    answer: 'Có thể kết hợp cả hai. Thức ăn khô tốt cho răng, thức ăn ướt cung cấp nước.'
  },
  {
    id: 8,
    question: 'Thú cưng bị ngứa và gãi nhiều là bệnh gì?',
    answer: 'Có thể do dị ứng, ký sinh trùng hoặc bệnh da. Cần kiểm tra và điều trị sớm.'
  }
];

const HEADER_HEIGHT = 56;

const ExploreScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, fetchCategoriesStatus, products, fetchProductsStatus, fetchProductsError, productsPagination, banners, fetchBannersStatus, ratings, fetchRatingsStatus, hotVouchers, fetchHotVouchersStatus } = useSelector((state: RootState) => state.explore);
  const navigation = useMainNavigation();
  const [showAllFAQs, setShowAllFAQs] = useState(false);


  const allProducts = products || [];

  // Filter trùng key để tránh lỗi duplicate key
  const uniqueProducts = React.useMemo(() => {
    const seen = new Set();
    return allProducts.filter(item => {
      if (seen.has(item._id)) return false;
      seen.add(item._id);
      return true;
    });
  }, [allProducts]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClampScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
  const headerTranslateY = diffClampScrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  // Load data khi component mount lần đầu
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load lại data mỗi khi màn hình được focus (tương tự Shopee)
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  const loadInitialData = useCallback(() => {
    // Reset state trước khi load lại data (tương tự Shopee)
    dispatch(resetExploreState());

    // Load lại tất cả data
    dispatch(fetchCategorySuggest());
    dispatch(fetchPages({ page: 1, limit: 20 }));
    dispatch(fetchBanners());
    dispatch(fetchSpecialRatings());
    dispatch(fetchHotVouchers());
  }, [dispatch]);

  // Load more sản phẩm khi kéo hết
  const handleLoadMore = useCallback(() => {
    if (productsPagination && productsPagination.hasNextPage && fetchProductsStatus !== 'pending' && typeof productsPagination.page === 'number') {
      dispatch(fetchPages({ page: productsPagination.page + 1, limit: 20 }));
    }
  }, [productsPagination, fetchProductsStatus, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.light }}>
      {/* Header ẩn/hiện khi scroll */}
      <Animated.View style={[styles.animatedHeader, { transform: [{ translateY: headerTranslateY }] }]}>
        {navigation.canGoBack() && (
          <TouchableOpacity
            style={styles.headerBackBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="arrow-back" size={26} color={colors.white} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitleText}>Khám phá</Text>
      </Animated.View>
      <Animated.ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}

      >
        {/* Search bar */}
        <TouchableOpacity style={styles.searchBarContainer} onPress={() => { navigation.navigate('ProductShow', { filter: { limit: 10, }, title: "" }) }}>
          <TextInput
            style={styles.searchBar}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor={colors.text.secondary}
            editable={false}
          />
        </TouchableOpacity>

        {/* Banner slider */}
        {banners.length > 0 && (
          <View style={styles.bannerContainer}>
            <ImageSlider
              urls={banners}
              width={Dimensions.get('window').width - 32}
              height={140}
              showIndicator={true}
              indicatorColor={colors.white}
              indicatorInactiveColor="rgba(255, 255, 255, 0.5)"
              showNavigationButtons={false}
              borderRadius={18}
              autoScroll={true}
              autoScrollInterval={3000}
            />
          </View>
        )}

        {/* Danh mục */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllCategoriesScreen')}><Text style={styles.seeAll}>Xem tất cả</Text></TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIconWrap}>
                <Image source={{ uri: item.icon || DEFAULT_CATEGORY_ICON }} style={styles.categoryIcon} />
              </View>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        {/* Voucher hot */}
        {hotVouchers.length > 0 && (
          <>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Voucher hot</Text>
            </View>
            <FlatList
              data={hotVouchers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item._id}
              contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 8 }}
              renderItem={({ item }) => (
                <View style={styles.voucherCard}>
                  <View style={styles.voucherHeader}>
                    <View style={styles.voucherIconContainer}>
                      <Icon
                        name={item.discount_type === 'percent' ? 'percent' : 'local-offer'}
                        size={24}
                        color={colors.white}
                      />
                    </View>
                    <View style={styles.voucherInfo}>
                      <Text style={styles.voucherCode}>{item.code}</Text>
                      <Text style={styles.voucherDiscount}>
                        {item.discount_type === 'percent' ? `${item.discount_value}%` : `${item.discount_value.toLocaleString()}đ`}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.voucherDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.voucherProgress}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${(item.used / item.quantity) * 100}%` }
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {item.used}/{item.quantity} đã sử dụng
                    </Text>
                  </View>
                </View>
              )}
            />
          </>
        )}

        {/* Bài viết cho thú cưng */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Bài viết cho thú cưng</Text>
        </View>
        <FlatList
          data={ARTICLES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 8 }}
          renderItem={({ item }) => (
            <View style={styles.articleCard}>
              <Image source={{ uri: item.image }} style={styles.articleImg} />
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text style={styles.articleDesc}>{item.desc}</Text>
            </View>
          )}
        />

        {/* Đánh giá nổi bật */}
        {ratings.length > 0 && (
          <>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Đánh giá nổi bật</Text>
            </View>
            <FlatList
              data={ratings}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item._id}
              contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 8 }}
              renderItem={({ item }) => (
                <View style={styles.reviewCard}>
                  <Image source={{ uri: item.user.avatar }} style={styles.reviewAvatar} />
                  <Text style={styles.reviewName}>{item.user.name}</Text>
                  <View style={styles.ratingRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesome
                        key={star}
                        name="star"
                        size={12}
                        color={star <= item.rating ? "#FFA726" : "#E0E0E0"}
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewContent}>{item.comment}</Text>
                  <Text style={styles.likeCount}>{item.likeCount} lượt thích</Text>
                </View>
              )}
            />
          </>
        )}



        {/* FAQ/Hỏi đáp nhanh */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Hỏi đáp nhanh</Text>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          {FAQS.slice(0, showAllFAQs ? FAQS.length : 2).map(item => (
            <View key={item.id} style={styles.faqCard}>
              <Text style={styles.faqQ}>{item.question}</Text>
              <Text style={styles.faqA}>{item.answer}</Text>
            </View>
          ))}
          {!showAllFAQs && FAQS.length > 2 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAllFAQs(true)}
            >
              <Text style={styles.showMoreText}>Xem thêm {FAQS.length - 2} câu hỏi</Text>
            </TouchableOpacity>
          )}
          {showAllFAQs && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAllFAQs(false)}
            >
              <Text style={styles.showMoreText}>Thu gọn</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Sản phẩm dạng grid */}
        {uniqueProducts.length > 0 && (
          <>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Sản phẩm</Text>
            </View>
            <MasonryList
              data={uniqueProducts}
              keyExtractor={(item: ProductRespondSimplizeDto) => item._id}
              renderItem={({ item, i }: { item: unknown; i: number }) => <ProductSimpleCard product={item as ProductRespondSimplizeDto} onAddToCart={(product) => {/* TODO: handle after add to cart */ }} />}
              contentContainerStyle={{ paddingHorizontal: CARD_PADDING, paddingBottom: 32 }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.2}
              ListFooterComponent={fetchProductsStatus === 'pending' ? <ActivityIndicator style={{ margin: 16 }} /> : null}
              numColumns={NUM_COLUMNS}
            />
          </>
        )}
      </Animated.ScrollView>
    </View>
  )
}

export default ExploreScreen

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const CARD_SPACING = 12;
const CARD_PADDING = 12;
const CARD_WIDTH = (width - CARD_SPACING * (NUM_COLUMNS - 1) - CARD_PADDING * 2) / NUM_COLUMNS;
const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: colors.background.light,
    marginTop: 60
  },
  searchBar: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },


  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
  },
  seeAll: {
    fontSize: 13,
    color: colors.app.primary.main,
    fontWeight: '500',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 18,
    width: 70,
  },
  categoryIconWrap: {
    backgroundColor: colors.app.primary.lightest,
    borderRadius: 16,
    padding: 12,
    marginBottom: 6,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },

  voucherCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginRight: 16,
    width: 200,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  voucherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  voucherIconContainer: {
    backgroundColor: colors.app.primary.main,
    borderRadius: 8,
    padding: 6,
    marginRight: 8,
  },
  voucherInfo: {
    flex: 1,
  },
  voucherCode: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  voucherDiscount: {
    fontSize: 16,
    color: colors.app.primary.main,
    fontWeight: '700',
  },
  voucherDescription: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '400',
    marginBottom: 8,
    lineHeight: 16,
  },
  voucherProgress: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.grey[200],
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.app.primary.main,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '400',
    textAlign: 'center',
  },
  articleCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 10,
    marginRight: 16,
    width: 200,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  articleImg: {
    width: 180,
    height: 80,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: colors.grey[100],
  },
  articleTitle: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  articleDesc: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  reviewCard: {
    backgroundColor: colors.blue.light,
    borderRadius: 14,
    padding: 12,
    marginRight: 16,
    width: 180,
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
  },
  reviewName: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  reviewContent: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '400',
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  likeCount: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
  },
  faqCard: {
    backgroundColor: colors.grey[100],
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  faqQ: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  faqA: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  showMoreButton: {
    backgroundColor: colors.app.primary.lightest,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  showMoreText: {
    color: colors.app.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  productSimpleCard: {
    width: CARD_WIDTH,
    marginBottom: 20,
    // marginHorizontal: CARD_MARGIN, // bỏ margin ngang
    padding: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey[100],
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  productSimpleImg: {
    width: 100,
    height: 100,
    marginBottom: 10,
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  productSimpleName: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    minHeight: 40,
  },
  productSimplePrice: {
    fontSize: 15,
    color: colors.app.primary.main,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    alignSelf: 'center',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.app.primary.main,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
    width: '100%',
  },
  addToCartIconTextBtn: {
    width: 20,
    height: 20,
    tintColor: colors.white,
    marginRight: 8,
  },
  addToCartText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: colors.app.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    elevation: 10,
    shadowColor: colors.app.primary.main,
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  headerBackBtn: {
    paddingHorizontal: 20, // tăng vùng ấn ngang
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
    marginRight: 38, // Để căn giữa khi có nút back bên trái
  },
  bannerContainer: {
    position: 'relative',
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bannerIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  bannerIndicatorActive: {
    backgroundColor: colors.white,
  },
});