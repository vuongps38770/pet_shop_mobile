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

import { fetchProductDetail } from '../product.slice'
import { PriceFormatter } from 'app/utils/priceFormatter';
import { addToCart, resetStatus } from 'src/presentation/features/cart/cart.slice';
const screenWidth = Dimensions.get('window').width;



const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'ProductDetail'>>()
  const productId = route.params.productId ?? "683eb18c148e72b5b379f648"
  const dispatch = useDispatch<AppDispatch>()

  const mainNav = useMainNavigation()
  const [quantity, setQuantity] = useState(1);
  const product = useSelector((state: RootState) => state.product.currentProductDetail)
  const isFetching = useSelector((state: RootState) => state.product.status === 'loading')
  const { items, addToCartStatus } = useSelector((state: RootState) => state.cart)
  const [isExistedInCart, setIsExistedInCart] = useState(false);

  // Ref để kiểm soát việc hiển thị toast chỉ sau lần render đầu tiên
  const isFirstRenderForAddToCartStatus = useRef(true);

  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([])

  // Thêm hàm renderAddToCartButton
  const renderAddToCartButton = () => {
    // Nếu không có group, chỉ có 1 variant thì lấy luôn variant đầu tiên
    const noGroup = !product?.variantGroups || product?.variantGroups.length === 0;
    const autoVariant = noGroup && product?.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    const needSelectVariant = !matchedVariant && !autoVariant;
    const isProductUnactivated= !product?.isActivate
    /**todo: sau này thêm check ngừng kinh doanh */
    // if(isProductUnactivated){
    //   return (
    //     <TouchableOpacity style={[styles.cartButton, { backgroundColor: colors.grey[400] }]} disabled>
    //       <Text style={styles.cartText}>Sản phẩm ngừng kinh doanh</Text>
    //     </TouchableOpacity>
    //   );
    // }

    if (addToCartStatus === 'loading') {
      return (
        <TouchableOpacity style={styles.cartButton} disabled>
          <Text style={styles.cartText}>Đang thêm ...</Text>
        </TouchableOpacity>
      );
    }

    if (isExistedInCart) {
      return (
        <TouchableOpacity style={[styles.cartButton, { backgroundColor: colors.green.main }]} disabled>
          <Text style={styles.cartText}>Đã có trong giỏ</Text>
        </TouchableOpacity>
      );
    }

    if (needSelectVariant) {
      return (
        <TouchableOpacity style={[styles.cartButton, { backgroundColor: colors.grey[400] }]} disabled>
          <Text style={styles.cartText}>Vui lòng chọn biến thể</Text>
        </TouchableOpacity>
      );
    }

    // Nếu không có group, tự động lấy variant đầu tiên
    if (autoVariant) {
      return (
        <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(autoVariant._id, quantity)}>
          <Text style={styles.cartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      );
    }

    // Có group, đã chọn đủ variant
    if (matchedVariant) {
      return (
        <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(matchedVariant._id, quantity)}>
          <Text style={styles.cartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      );
    }

    
    
  };



  const matchedVariant = product?.variants.find(variant => {
    if (variant.unitValues.length !== selectedUnitIds.length) return false;
    return selectedUnitIds.every(id => variant.unitValues.map(u => u._id).includes(id));
  });


  useEffect(() => {
    if (!matchedVariant) {
      setIsExistedInCart(false);
      return;
    }
    setIsExistedInCart(
      items.some(item => item.productVariantId === matchedVariant._id)
    );
  }, [items, matchedVariant]);


  useEffect(() => {
    const fetch = async () => {
      dispatch(fetchProductDetail(productId))
    }
    fetch()
  }, [])
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



  const relatedProducts = [
    { id: '1', name: 'Gold Earring from Executive', price: '$1.400.000', image: 'http://www.vanhoanggroup.com/Portals/28054/Hoan/Hoan1/bo-bit-tet-dat-vang-7.jpg' },
    { id: '2', name: 'Modern Kebaya Outer - Nona Rara', price: '$980.000', image: 'https://tse3.mm.bing.net/th?id=OIP.pkhaiWA4PfscbrLvCzejrAHaHa&pid=Api&P=0&h=180' },
    { id: '3', name: 'Modern Kebaya Outer - Nona Rara', price: '$980.000', image: 'https://i.ytimg.com/vi/Ko5NyQ1lMLs/maxresdefault.jpg' },
    { id: '4', name: 'Modern Kebaya Outer - Nona Rara', price: '$980.000', image: 'https://tse3.mm.bing.net/th?id=OIP.pkhaiWA4PfscbrLvCzejrAHaHa&pid=Api&P=0&h=180' },
    { id: '5', name: 'Modern Kebaya Outer - Nona Rara', price: '$980.000', image: 'https://i.ytimg.com/vi/Ko5NyQ1lMLs/maxresdefault.jpg' }
  ];

  const handleAddToCart = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      return;
    }
    dispatch(addToCart({ productVariantId: variantId, quantity }));
  };



  if (!product|| isFetching) {
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
          <TouchableOpacity style={styles.heartButton}>
            <Image source={assets.icons.details.heartinactive} />
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

          {product.variantGroups && (
            <View style={{}}>
              <GroupFlatList
                onSelectedUnitsChange={(selectedUnits) => {
                  console.log('Selected units:', Object.values(selectedUnits));
                  setSelectedUnitIds(Object.values(selectedUnits))
                }}
                groups={product.variantGroups}
              />

            </View>
          )}


          <Text style={styles.sectionTitle}>Số lượng</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                <Image source={assets.icons.details.linear} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(prev => prev + 1)}
              >
                <Image source={assets.icons.details.Stylelinearplusss} />
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 'auto', justifyContent: 'center' }}>
              {matchedVariant && (
                <Text style={styles.stockText}>
                  {`Tồn kho: ${matchedVariant?.stock}`}
                </Text>
              )}
              <Text style={[styles.price, { justifyContent: 'center', textAlign: 'right', alignSelf: 'center' }]}>
                {matchedVariant ? `${PriceFormatter.formatPrice(matchedVariant.promotionalPrice * quantity)} ` : 'Chọn phân loại để xem giá'}
              </Text>

            </View>

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
          <Text style={styles.readMore}>Read more</Text>

          <Text style={styles.sectionTitle}>RELATED PRODUCT</Text>
          <FlatList
            data={relatedProducts}
            horizontal
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.relatedItem}>
                <Image source={{ uri: item.image }} style={styles.relatedImage} />
                <Text style={styles.relatedName}>{item.name}</Text>
                <Text style={styles.relatedPrice}>{item.price}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      {renderAddToCartButton()}
    </View>
  );
};


const GroupFlatList = ({ groups, onSelectedUnitsChange }:
  { groups: VariantGroupDTO[], onSelectedUnitsChange: (selectedUnits: { [groupId: string]: string }) => void }) => {
  const [selectedUnits, setSelectedUnits] = useState<{ [groupId: string]: string }>({});
  const handleUnitSelect = (groupId: string, unitId: string) => {
    const newSelectedUnits = { ...selectedUnits, [groupId]: unitId };
    setSelectedUnits(newSelectedUnits);
    onSelectedUnitsChange(newSelectedUnits);
  };
  return (
    <FlatList<VariantGroupDTO>
      data={groups}
      renderItem={({ item }) => (
        <View>
          <Text style={styles.sectionTitle}>{item.groupName}</Text>
          <UnitFlatList
            units={item.units}
            selectedUnitId={selectedUnits[item._id]}
            onUnitSelect={(unitId) => handleUnitSelect(item._id, unitId)}
          />
        </View>
      )}
      keyExtractor={(item, index) => item._id}
      scrollEnabled={false}
    >
    </FlatList>
  );
};

const UnitFlatList = ({ units, selectedUnitId, onUnitSelect }:
  { units: UnitDTO[], selectedUnitId?: string, onUnitSelect: (unitId: string) => void }) => {
  return (
    <FlatList<UnitDTO>
      data={units}
      renderItem={({ item }) => (
        <TouchableOpacity

          style={[
            styles.optionButton,
            item._id === selectedUnitId && styles.selectedOption
          ]}
          onPress={() => onUnitSelect(item._id)}
        >
          <Text>{item.unitName}</Text>
        </TouchableOpacity>

      )}
      keyExtractor={(item, index) => item._id}
      horizontal
      showsHorizontalScrollIndicator={false}
    >

    </FlatList>
  );
}

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
  optionRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10
  },
  optionButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginRight: 10
  },
  selectedOption: {
    borderColor: colors.app.primary.main,
    backgroundColor: colors.app.primary.lightest
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 20
  },
  quantity: {
    fontSize: 16
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
    borderRadius: BORDER_RADIUS.S,
    marginBottom: 10
  },
  cartText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16
  },
  stockText: {
    color: colors.text.primary,
    fontSize: 14,
  },
});


export default ProductDetailScreen

