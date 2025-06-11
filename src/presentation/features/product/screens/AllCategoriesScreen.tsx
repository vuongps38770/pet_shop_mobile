import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, UIManager, LayoutAnimation, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { CategoryRespondDto } from '../../../dto/res/category-respond.dto';

import { colors } from 'shared/theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import {fetchCategorByType} from '../product.slice'
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
const screenWidth = Dimensions.get('window').width
interface CategoryType {
  id: string;
  name: string;
  value: string;
}

const data: CategoryType[] = [
  { id: '1', name: 'Chó', value: 'DOG' },
  { id: '2', name: 'Mèo', value: 'CAT' },
];


export const AllCategoriesScreen= ()=> {
  const [selectedCategoryType, setSelectedCategoryType] = useState('DOG');
  const [currentCategoryId, setCurrentCategoryId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useMainNavigation()
  const categoryList = useSelector((state:RootState)=>state.product.categories)



  useEffect(() => {
    dispatch(fetchCategorByType({type:selectedCategoryType}))
  }, [selectedCategoryType])



  const renderItem = ({ item }: { item: CategoryType }) => {
    const isSelected = item.value === selectedCategoryType;
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategoryType(item.value)}
        style={[styles.button, isSelected && styles.selectedButton]}
      >
        <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  //childeren
  const renderItemChilderen = ({ item }: { item: CategoryRespondDto }) => {
    return (

      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          navigation.navigate('ProductShow', { filter: { categoryId: item._id }, title: item.name })
        }}
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };



  const renderItemCategory = ({ item }: { item: CategoryRespondDto }) => {
    return (
      <View >
        <View style={{
          padding: 10,
          flexDirection: 'column'
        }}>
          <View style={{
            flexDirection: 'row',
            padding: 15,
            borderWidth: 1,
            borderColor: item._id == currentCategoryId ? colors.app.primary.main : '#ccc',
            borderRadius: 10,
            shadowColor: item._id == currentCategoryId ? colors.app.primary.main : '#000',
            backgroundColor:colors.grey['100'],
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}>

            <TouchableOpacity style={{ width: 'auto' }} onPress={() => navigation.navigate('ProductShow', { title: item.name, filter: { rootCategoryId: item._id } })}>
              <Text style={{ fontSize: 18 }}>
                {
                  item.name
                }
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {

                setCurrentCategoryId(currentCategoryId == item._id ? "" : item._id)
              }}

              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}>
              <Image
                source={require('../../../../../assets/icons/icondowarrow.png')}
              />
            </TouchableOpacity>

          </View>



          {item._id == currentCategoryId && (
            <View style={{ marginTop: 20 }}>
              {/*todo: lam cai flastlist con*/}
              {item.children.length > 0 ?
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
                <Text style={{ width: '100%', textAlign: 'center', fontSize: 20 }}>Hiện chưa có danh mục!</Text>
              }

            </View>
          )}
        </View>
      </View >
    );
  };

  return (
    <View style={styles.container}>

      {/* header */}
      <View style={{ flexDirection: 'row', padding: 10, marginTop: 20 }}>
        <Text style={styles.headerTitle}>Tất Cả Danh Mục</Text>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.pop()}>
          <Image source={require('../../../../../assets/icons/Close.png')} />
        </TouchableOpacity>
      </View>


      {/* loai danh muc */}
      <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', width: '100%' }}>
        <FlashList
          data={data}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          extraData={selectedCategoryType}
          estimatedItemSize={100}
        />
      </View>

      {/* danh muc goc */}
      <FlashList<CategoryRespondDto>
        data={categoryList}
        renderItem={renderItemCategory}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        estimatedItemSize={100}
        extraData={currentCategoryId}
        style={{ marginTop: 20 }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
    backgroundColor: colors.background.default,
  },
  headerTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
  },
  icontitle: {
    position: 'absolute',
    right: '2%',
    top: '15%',
  },
  button: {
    height: 40,
    width: screenWidth / 3,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: colors.app.primary.lighter,
    borderWidth: 2,
    borderColor: colors.app.primary.main,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
  },
  itemContainer: {
    flex: 1,
    height: 'auto',
    paddingVertical: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.app.primary.main,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignSelf: 'center'
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
});
