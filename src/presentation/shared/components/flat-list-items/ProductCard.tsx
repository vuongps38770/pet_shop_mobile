import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { assets } from 'shared/theme/assets';
import { FormatProduct } from 'shared/components/format-price';
import { ProductRespondSimplizeDto } from 'src/presentation/dto/res/product-respond.dto';
import { colors } from 'shared/theme/colors';

interface ProductCardProps {
  item: ProductRespondSimplizeDto;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.productCard} onPress={onPress}>
    <Image source={{ uri: item.images[0] }} resizeMode='contain' style={styles.productImage} />
    <View style={styles.starRow}>
      {[...Array(5)].map((_, i) => (
        <Image
          key={i}
          source={assets.icons.homeScreen.star}
          style={styles.starIcon}
        />
      ))}
      <Text> {5}</Text>
    </View>
    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.productName}>{item.name}</Text>
    <Text style={styles.productPrice}>
      <FormatProduct item={item} />
    </Text>
    <TouchableOpacity style={styles.addButton}>
      <Image
        source={assets.icons.homeScreen.cart}
        style={styles.plusIcon}
      />
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  productCard: {
    width: '46%',
    backgroundColor: colors.grey[200],
    height: 280,
    borderRadius: 24,
    padding: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
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
    backgroundColor: colors.app.primary.main,
    width: 45,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 0,
    right: 0,
    borderTopEndRadius: 22,
    borderBottomStartRadius: 16
  },
  plusIcon: {
    width: 16,
    height: 16,
  },
});

export default ProductCard;