import { useNavigation } from '@react-navigation/native'
import { useMainNavigation } from '../../../shared/hooks/navigation-hooks/useMainNavigationHooks'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/presentation/store/store'
import { getPoPularProduct } from '../homeSlice'
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  Keyboard,
  RefreshControl,
} from 'react-native';
import { colors } from 'shared/theme/colors';
import { assets } from 'shared/theme/assets';
import { Fonts } from 'shared/theme/fonts';
import ProductCard from 'shared/components/flat-list-items/ProductCard'
import HomeLogo from 'assets/images/logo.svg'
import PawIcon from 'assets/icons/paw-icon.svg'
const HomeScreen = () => {
  const mainNav = useMainNavigation()
  const dispatch = useDispatch<AppDispatch>()
  const { popularProductList, fetchPopularProductListStatus } = useSelector((state: RootState) => state.home)
  const [searchParam, setSearchParam] = useState("");
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -100], 
    extrapolate: 'clamp',
  });

  useEffect(() => {
    dispatch(getPoPularProduct())


  }, [])


  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing...');
    await dispatch(getPoPularProduct());
    setRefreshing(false);
  };


  
  useEffect(() => {

    console.log(popularProductList);

  }, [popularProductList])



  return (
    <Animated.ScrollView
      style={{ flex: 1 }}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#2196F3"
          title="Đang làm mới..."/>
      }
    >
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
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

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => mainNav.navigate('Notification')}>
            <Image
              source={assets.icons.homeScreen.bell}
              style={styles.headerIcon}

            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => mainNav.navigate('AllCategoriesScreen')}>
            <Image
              source={assets.icons.homeScreen.bell}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => mainNav.navigate('CartScreen')}>
            <Image
              source={assets.icons.homeScreen.cart}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.searchContainer}>
        <Image
          source={assets.icons.homeScreen.search}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search for pet product..."
          style={styles.searchInput}
          value={searchParam}
          onChangeText={(text) =>
            setSearchParam(text)
          }
          returnKeyType='search'
          onSubmitEditing={() => {
            if (searchParam.trim() != "") {
              mainNav.navigate('ProductShow', { title: `kết quả của "${searchParam}"`, filter: { search: searchParam.trim() } })
            } else {
              Keyboard.dismiss();
              setSearchParam('');
            }

          }}
        />
      </View>

      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTitle}>Special Offer!</Text>
          <Text style={styles.bannerSubtitle}>
            Get 20% off on all pet food this week
          </Text>
          <TouchableOpacity style={styles.shopNowButton}>
            <Text style={{ color: 'white' }}>Shop now</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={assets.images.image}
          style={styles.bannerImage}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Products</Text>
        <TouchableOpacity onPress={() => {
          /**todo */
        }
        }>
          <Text style={styles.sectionLink}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ marginHorizontal: 10 }}
        data={popularProductList}
        numColumns={2}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{}}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 6 }}
        scrollEnabled={false}

        renderItem={({ item }) => {
          return (
            <ProductCard
              item={item}
              onPress={() => mainNav.navigate('ProductDetail', { productId: item._id })}

            />
          )
        }
        }
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
      <View style={styles.services}>
        <View style={styles.serviceCardPink}>
          <Image
            source={assets.icons.homeScreen.scissors}
            style={styles.serviceIcon}
          />
          <Text style={styles.serviceTitle}>Pet Grooming</Text>
          <Text style={styles.serviceDesc}>Professional care</Text>
          <TouchableOpacity style={styles.bookNowButton}>
            <Text style={styles.bookNowText}>Book now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.serviceCardBlue}>
          <Image
            source={assets.icons.homeScreen.house}
            style={styles.serviceIcon}
          />
          <Text style={styles.serviceTitle}>Pet Sitting</Text>
          <Text style={styles.serviceDesc}>Care at your home</Text>
          <TouchableOpacity style={styles.bookNowButton}>
            <Text style={styles.bookNowText}>Book now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.ScrollView >
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
    width: 40,
    height: 40,

  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey[300],
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
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
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderColor: colors.black,
    borderWidth: 1,

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
    fontSize: 20,
    marginBottom: 10,
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
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  serviceCardPink: {
    backgroundColor: colors.pink.light,
    padding: 16,
    borderRadius: 10,
    width: '48%',
  },
  serviceCardBlue: {
    backgroundColor: colors.blue.light,
    padding: 16,
    borderRadius: 10,
    width: '48%',
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
    borderWidth: 1,
    borderColor: colors.blue.main,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  bookNowText: {
    color: colors.blue.main,
    fontWeight: '600',
    fontSize: 14,
  },
});
