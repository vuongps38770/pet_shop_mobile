import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Platform,
  ToastAndroid
} from 'react-native';

import { colors } from 'shared/theme/colors';
import { assets } from 'shared/theme/assets';
import { BORDER_RADIUS } from 'shared/theme/layout';

import ImageSlider from 'shared/components/Image-slider';
import { ProductDetailRespondDTO } from 'src/presentation/dto/res/product-detail.dto';
import { VariantGroupDTO, UnitDTO } from 'src/presentation/dto/res/product-detail.dto';


import { FormatProduct } from 'shared/components/format-price';

import { LoadingView } from 'shared/components/LoadingView';
import RenderHTML, { HTMLContentModel, HTMLElementModel, MixedStyleDeclaration } from 'react-native-render-html';
import { MainStackParamList } from 'src/presentation/navigation/main-navigation/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';

import { fetchProductDetail, fetchRelatedProducts } from '../product.slice'
import { PriceFormatter } from 'app/utils/priceFormatter';
import { addToCart, resetStatus } from 'src/presentation/features/cart/cart.slice';
import { addToFavorite, removeFromFavorite } from '../../favorite/favorite.slice';
import { HeartAnimatedIcon } from 'shared/components/HeartAnimatedIcon';
import { debounce } from 'lodash';
import ProductReviewSection from '../../review/components/ProductReviewSection';
import VariantSelectionBottomSheet from '../components/VariantSelectionBottomSheet';

const screenWidth = Dimensions.get('window').width;



const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'ProductDetail'>>()
  const productId = route.params.productId ?? "683eb18c148e72b5b379f648"
  const dispatch = useDispatch<AppDispatch>()

  const mainNav = useMainNavigation()
  const product = useSelector((state: RootState) => state.product.currentProductDetail)
  const isFetching = useSelector((state: RootState) => state.product.status === 'loading')
  const relatedProducts = useSelector((state: RootState) => state.product.relatedProducts)
  const relatedProductsStatus = useSelector((state: RootState) => state.product.relatedProductsStatus)
  const { addToCartStatus } = useSelector((state: RootState) => state.cart)

  const { addToFavoriteStatus } = useSelector((state: RootState) => state.favorite)
  const { favoriteIds } = useSelector((state: RootState) => state.favorite)
  // Ref để kiểm soát việc hiển thị toast chỉ sau lần render đầu tiên
  const isFirstRenderForAddToCartStatus = useRef(true);

  const [showVariantBottomSheet, setShowVariantBottomSheet] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      dispatch(fetchProductDetail(productId))
    }
    fetch()
  }, [])

  useEffect(() => {
    if (product && product._id) {
      dispatch(fetchRelatedProducts(product._id));
    }
  }, [product, product?._id]);
  useEffect(() => {
    dispatch(resetStatus());
  }, []);
  useEffect(() => {
    // Bỏ qua lần render đầu tiên để tránh hiển thị toast không mong muốn
    if (isFirstRenderForAddToCartStatus.current) {
      isFirstRenderForAddToCartStatus.current = false;
      return;
    }

    console.log("addToCartStatus", addToCartStatus);

    if (addToCartStatus === 'succeeded') {
      if (Platform.OS === 'web') {

      } else if (Platform.OS === 'android') {
        ToastAndroid.show('Thêm vào giỏ hàng thành công', ToastAndroid.SHORT);
      } else if (Platform.OS === 'ios') {
      }
      dispatch(resetStatus())
    } else if (addToCartStatus === 'failed') {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Thêm vào giỏ hàng thất bại', ToastAndroid.SHORT);
      }
      dispatch(resetStatus())
    }
  }, [addToCartStatus, dispatch]); // Thêm dispatch vào dependency array để đảm bảo closure chính xác



  const handleAddToCart = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      return;
    }
    dispatch(addToCart({ productVariantId: variantId, quantity }));
    setShowVariantBottomSheet(false);
  };

  const handleOpenVariantSelection = () => {
    setShowVariantBottomSheet(true);
  };

  const handleFavorite = debounce((isFavorite, productId) => {
    console.log("handleFavorite", isFavorite, productId);

    if (!isFavorite) {
      dispatch(addToFavorite({ productId }));
    } else {
      dispatch(removeFromFavorite(productId));
    }
  }, 300);

  // Thêm hàm renderAddToCartButton
  const renderAddToCartButton = () => {
    if (addToCartStatus === 'loading') {
      return (
        <TouchableOpacity style={[styles.cartButton, { backgroundColor: colors.grey[400] }]} disabled>
          <Text style={styles.cartText}>Đang thêm ...</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.cartButton} onPress={handleOpenVariantSelection}>
        <Text style={styles.cartText}>Thêm vào giỏ</Text>
      </TouchableOpacity>
    );
  };

  if (!product || isFetching) {
    if (Platform.OS === 'web') {
      return (
        <View style={{ flex: 1, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>

        </View>
      );
    }

    return (

      <LoadingView />
    )
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <ImageSlider
            height={500}
            width={screenWidth}
            urls={product.images}>
          </ImageSlider>


          <TouchableOpacity style={styles.backButton} onPress={() => mainNav.goBack()}>
            <Image source={assets.icons.back} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heartButton} onPress={() => dispatch(addToFavorite({ productId: product._id }))}>
            <HeartAnimatedIcon
              isFavorite={favoriteIds.includes(product._id)}
              /** debounce */
              onPress={() => {
                handleFavorite(favoriteIds.includes(product._id), product._id);
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.brand}>{product?.supplier?.name}</Text>
          <Text style={styles.name}>{product?.name}</Text>

          <View style={styles.priceRow}>
            <FormatProduct
              item={product}
            />

          </View>

          <Text style={styles.sectionTitle}>PRODUCT DESCRIPTION</Text>
          {/*todo*/}

          {product.descriptions && product.descriptions.map((des, idx) => (
            <View key={idx}>
              <Text style={styles.description}>
                {des.title}
              </Text>
              <View>
                <RenderHTML
                  contentWidth={screenWidth}
                  source={{ html: des.content }}
                  tagsStyles={tagsStyles}
                  customHTMLElementModels={customHTMLElementModels}
                  enableExperimentalBRCollapsing={true}
                  enableExperimentalGhostLinesPrevention={true}
                />
              </View>
            </View>
          ))}
          {/* <Text style={styles.readMore}>Read more</Text> */}

          <Text style={styles.sectionTitle}>Sản phẩm liên quan</Text>
          {relatedProductsStatus === 'loading' ? (
            <Text>Đang tải sản phẩm liên quan...</Text>
          ) : (
            <FlatList
              data={relatedProducts}
              horizontal
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <View style={styles.relatedItem}>
                  <Image source={{ uri: item.images[0] }} style={styles.relatedImage} />
                  <Text style={styles.relatedName}>{item.name}</Text>
                  <Text style={styles.relatedPrice}>
                    {item.minPromotionalPrice === item.maxPromotionalPrice
                      ? `${item.minPromotionalPrice.toLocaleString()}₫`
                      : `${item.minPromotionalPrice.toLocaleString()}₫ - ${item.maxPromotionalPrice.toLocaleString()}₫`}
                  </Text>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
        <ProductReviewSection showProductInfo={false} productId={productId}/>
      </ScrollView>
      {renderAddToCartButton()}
      
      <VariantSelectionBottomSheet
        visible={showVariantBottomSheet}
        onClose={() => setShowVariantBottomSheet(false)}
        onConfirm={handleAddToCart}
        product={product}
        addToCartStatus={addToCartStatus}
      />
    </View>
  );
};


// Thêm cấu hình cho RenderHTML
const tagsStyles: Record<string, MixedStyleDeclaration> = {
  body: {
    color: colors.text.primary,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10,
    width: '100%',
  },
  tr: {
    flexDirection: 'row',
  },
  th: {
    backgroundColor: colors.grey[200],
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text.primary,
    flex: 1,
  },
  td: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text.primary,
    flex: 1,
  },
  p: {
    color: colors.text.primary,
    marginVertical: 5,
  },
  span: {
    color: colors.text.primary,
  },
  div: {
    color: colors.text.primary,
  },
  ul: {
    marginVertical: 5,
  },
  li: {
    color: colors.text.primary,
    marginVertical: 2,
  },
};

const customHTMLElementModels = {
  table: HTMLElementModel.fromCustomModel({
    tagName: 'table',
    contentModel: HTMLContentModel.block,
  }),
  tr: HTMLElementModel.fromCustomModel({
    tagName: 'tr',
    contentModel: HTMLContentModel.block,
  }),
  td: HTMLElementModel.fromCustomModel({
    tagName: 'td',
    contentModel: HTMLContentModel.block,
  }),
  th: HTMLElementModel.fromCustomModel({
    tagName: 'th',
    contentModel: HTMLContentModel.block,
  }),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  imageContainer: {
    position: 'relative'
  },
  image: {
    width: '100%',
    height: 300
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20
  },
  heartButton: {
    position: 'absolute',
    top: 40,
    right: 20
  },
  content: {
    padding: 16
  },
  brand: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 4
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  description: {
    marginTop: 10,
    color: colors.grey[700]
  },
  readMore: {
    color: colors.blue.dark,
    marginTop: 4
  },
  relatedItem: {
    width: 120,
    marginRight: 16
  },
  relatedImage: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.S
  },
  relatedName: {
    fontSize: 12,
    marginTop: 5
  },
  relatedPrice: {
    fontWeight: 'bold'
  },
  cartButton: {
    backgroundColor: colors.app.primary.main
    , padding: 16,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.ROUND,
    marginBottom: 10,
    marginHorizontal:10
  },
  cartText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16
  },
});


export default ProductDetailScreen

