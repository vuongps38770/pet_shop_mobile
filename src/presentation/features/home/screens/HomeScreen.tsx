import { useNavigation } from '@react-navigation/native'
import { useMainNavigation } from '../../../shared/hooks/navigation-hooks/useMainNavigationHooks'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/presentation/store/store'
import { getPoPularProduct, getPersonalizedSuggestions, getPopularSuggestions } from '../homeSlice'
import React, { useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView, Dimensions, Animated } from 'react-native';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  Keyboard,
  RefreshControl,
  Pressable,
} from 'react-native';
import { colors } from 'shared/theme/colors';
import { assets } from 'shared/theme/assets';
import { Fonts } from 'shared/theme/fonts';
import ProductCard from 'shared/components/flat-list-items/ProductCard'
import HomeLogo from 'assets/images/logo.svg'
import PawIcon from 'assets/icons/paw-icon.svg'
import NotifiIcon from 'assets/icons/bell.svg'
import CategoryIcon from 'assets/icons/category-svgrepo-com.svg'
import HorizontalAutoScrollSlider from 'shared/components/flat-list-items/HorizontalAutoScrollSlider';
import TypingBanner from '../components/TypingBanner';


const HomeScreen = () => {
  const mainNav = useMainNavigation()
  const dispatch = useDispatch<AppDispatch>()
  const { popularProductList, fetchPopularProductListStatus, personalizedSuggestions, popularSuggestions } = useSelector((state: RootState) => state.home)
  const [searchParam, setSearchParam] = useState("");
  const scrollViewRef = useRef<ScrollView | null>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const headerIsHidden = useRef(false); // true: header đang ẩn, false: header đang hiện
  const HEADER_HEIGHT = 100;

  // Hiệu ứng header ẩn/hiện dựa vào hướng scroll, chỉ animate khi trạng thái đổi
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY < 0) return;
    if (currentY < lastScrollY.current) {
      // Kéo lên
      if (headerIsHidden.current) {
        Animated.timing(headerAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        headerIsHidden.current = false;
      }
    } else if (currentY > lastScrollY.current + 2) {
      // Kéo xuống
      if (!headerIsHidden.current) {
        Animated.timing(headerAnim, {
          toValue: -HEADER_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }).start();
        headerIsHidden.current = true;
      }
    }
    lastScrollY.current = currentY;
  };


  useEffect(() => {
    dispatch(getPoPularProduct())
    dispatch(getPersonalizedSuggestions())
    dispatch(getPopularSuggestions())
  }, [])


  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing...');
    await dispatch(getPersonalizedSuggestions())
    await dispatch(getPopularSuggestions())
    await dispatch(getPoPularProduct());
    setRefreshing(false);
  };





  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.header,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            transform: [{ translateY: headerAnim }],
          },
        ]}
      >
        <Pressable onPress={() => {
          if (scrollViewRef.current) {
            // Nếu đang ở đầu trang, ấn logo sẽ reload
            if (lastScrollY.current < 10) {
              setRefreshing(true);
              onRefresh();
            } else {
              scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
          }
        }}>
          <View style={{ position: 'relative', width: 80, height: 80 }}>
            <PawIcon
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
              }}
              width={80}
              height={80}
            />
            <HomeLogo
              style={{
                position: 'relative',
                zIndex: 2,
                alignSelf: 'center'
              }}
              width={70}
              height={70}
            />
          </View>
        </Pressable>
        {/* Typing banner động */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TypingBanner />
        </View>
        <View style={styles.headerIcons}>
          <Pressable onPress={() => mainNav.navigate('Notification')}>
            <View
              style={styles.headerIcon}
            >
              <NotifiIcon width={25} height={25}/>
            </View>
          </Pressable>
          <Pressable onPress={() => mainNav.navigate('AllCategoriesScreen')}>
            <View style={styles.headerIcon}>
              <CategoryIcon width={25} height={25}/>
            </View>
          </Pressable>
        </View>
      </Animated.View>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, paddingTop: HEADER_HEIGHT }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2196F3"
            title="Đang làm mới..."/>
        }
      >
      <View style={styles.searchContainer}>
        <Image
          source={assets.icons.homeScreen.search}
          style={styles.searchIcon}
        />
        <TextInput
          focusable={false}
          placeholder="Tìm kiếm sản phẩm..."
          style={styles.searchInput}
          // value={searchParam}
          // onChangeText={(text) =>
          //   setSearchParam(text)
          // }
          // returnKeyType='search'
          // onSubmitEditing={() => {
          //   if (searchParam.trim() != "") {
          //     mainNav.navigate('ProductShow', { title: `kết quả của "${searchParam}"`, filter: { search: searchParam.trim() } })
          //   } else {
          //     Keyboard.dismiss();
          //     setSearchParam('');
          //   }

          // }}
          onPress={()=>mainNav.navigate('ProductShow', { title: ``, filter: {  } })}
        />
      </View>

      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTitle}>Mua sắm ngay!</Text>
          <Text style={styles.bannerSubtitle}>
            Hãy tìm kiếm những sản phẩm thú cưng yêu thích của bạn
          </Text>
          <TouchableOpacity style={styles.shopNowButton} onPress={()=>{mainNav.navigate('ExploreScreen')}}>
            <Text style={{ color: 'white' }}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={assets.images.image}
          style={styles.bannerImage}
        />
      </View>

 
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
      </View>
      <HorizontalAutoScrollSlider
        data={personalizedSuggestions}
        fps={90}
        scrollSpeed={0.2}
        onPressItem={(item) => mainNav.navigate('ProductDetail', { productId: item._id })}
      />

  
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sản phẩm phổ biến</Text>
      </View>
      <HorizontalAutoScrollSlider
      scrollSpeed={0.3}
      fps={50}
        data={popularSuggestions}
        onPressItem={(item) => mainNav.navigate('ProductDetail', { productId: item._id })}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Khám phá</Text>
        <TouchableOpacity onPress={() => mainNav.navigate('ExploreScreen')}>
          <Text style={styles.sectionLink}>Khám phá sản phẩm</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ marginHorizontal: 10 }}
        data={popularProductList}
        numColumns={2}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 24 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 6 }}
        scrollEnabled={false}
        renderItem={({ item }) => {
          return (
            <ProductCard
              item={item}
              onPress={() => mainNav.navigate('ProductDetail', { productId: item._id })}
              // Thêm hiệu ứng nhấn nếu muốn
            />
          )
        }}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pet Services</Text>
        <TouchableOpacity onPress={() => {
          // mainNav.navigate('ProductShow',{filter:{limit:10},title:"Tất cả"})
          /**todo */
        }}>
          <Text style={styles.sectionLink}>See All</Text>
        </TouchableOpacity>

      </View>
      {/* Pet Services scroll ngang */}
      <FlatList
        data={[
          {
            id: 1,
            title: 'Pet Grooming',
            desc: 'Professional care',
            icon: assets.icons.homeScreen.scissors,
          },
          {
            id: 2,
            title: 'Pet Sitting',
            desc: 'Care at your home',
            icon: assets.icons.homeScreen.house,
          },
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 12, marginBottom: 20 }}
        renderItem={({ item, index }) => (
          <View style={index % 2 === 0 ? styles.serviceCardPink : styles.serviceCardBlue}>
            <Image source={item.icon} style={styles.serviceIcon} />
            <Text style={styles.serviceTitle}>{item.title}</Text>
            <Text style={styles.serviceDesc}>{item.desc}</Text>
            <TouchableOpacity style={styles.bookNowButton}>
              <Text style={styles.bookNowText}>Book now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      </Animated.ScrollView>
    </View>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: colors.background.default,
    height: 100,
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'flex-start',
    backgroundColor: colors.app.primary.main,
    borderRadius: 50,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    padding: 10,
    backgroundColor: colors.grey[400],
    borderRadius: 50,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    elevation: 4,
    shadowRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    marginTop:20,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    elevation: 4,
    shadowRadius: 4,
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
  banner: {
    backgroundColor: colors.app.primary.lighter,
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerTitle: {
    fontSize: 18,
    fontFamily: Fonts.roboto.bold,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    marginBottom: 6,
    fontFamily: Fonts.roboto.regular,
    maxWidth: 200
  },
  bannerImage: {
    width: 87,
    height: 87,
    borderRadius: 10,
  },
  shopNowButton: {
    backgroundColor: colors.app.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 0,

  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  sectionLink: {
    color: colors.app.primary.main,
    fontWeight: 'bold',
    fontSize: 18,
  },
  productCard: {
    flex: 1,
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
    marginHorizontal: 6,
    // Thêm hiệu ứng nhấn nếu muốn
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

  services: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 20,
    // scroll ngang sẽ dùng FlatList horizontal ở phần render
  },
  serviceCardPink: {
    backgroundColor: colors.pink.light,
    padding: 16,
    borderRadius: 10,
    width: 180,
    marginRight: 16,
  },
  serviceCardBlue: {
    backgroundColor: colors.blue.light,
    padding: 16,
    borderRadius: 10,
    width: 180,
    marginRight: 16,
  },
  serviceIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 14,
    marginBottom: 8,
  },
  bookNowButton: {
    borderWidth: 0,
    backgroundColor: colors.app.primary.main,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  bookNowText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
