import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ProductRespondSimplizeDto } from '../../../dto/res/product-respond.dto';
import { colors } from '../../../shared/theme/colors';
import { HeartAnimatedIcon } from '../../../shared/components/HeartAnimatedIcon';
import { PriceFormatter } from 'app/utils/priceFormatter';
import { FormatProduct } from 'shared/components/format-price';

interface FavoriteCardProps {
  item: ProductRespondSimplizeDto;
  isFavorite: boolean;
  onPress: (productId: string) => void; // Khi nhấn vào card
  onHeartPress: (productId: string, isFavorite: boolean) => void; // Khi nhấn icon tim
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  item,
  isFavorite,
  onPress,
  onHeartPress,
}) => {
  return (
    <View style={styles.cardContainer} >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />

        {/* Rating Bubble */}
        {/* <View style={styles.ratingBubble}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.ratingText}>4.5</Text>
          <Text style={styles.reviewCount}>(20+)</Text>
        </View> */}

        {/* Heart Icon */}
        <View style={styles.heartIconContainer}>
          <HeartAnimatedIcon
            unFavoriteIconColor={colors.grey[500]}
            isFavorite={isFavorite}
            onPress={() => onHeartPress(item._id, !isFavorite)}
          />
        </View>
      </View>

      {/* Price Tag - Di chuyển ra ngoài imageWrapper */}
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>{PriceFormatter.formatPrice(item.minPromotionalPrice)} - {PriceFormatter.formatPrice(item.maxPromotionalPrice)}</Text>
      </View>

      <View style={styles.infoContainer}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(item._id)} >
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          {/* category có thể lấy từ đâu đó trong DTO nếu có, tạm để Dog Food */}
          <Text style={styles.productCategory}>Dog Food</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default FavoriteCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.app.primary.main,
    borderRadius: 20,
    flex: 1,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 0 4px rgba(0,0,0,0.3)',
    margin: 2,

  },
  imageWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 10,
    borderRadius: 20,
    boxShadow: '0 0 4px rgba(0,0,0,0.5)',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,

  },
  productImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  ratingBubble: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  starIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.black,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 5,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceTag: {
    height: 40,
    position: 'absolute',
    top: 160,
    right: 20,
    backgroundColor: colors.app.primary.main,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    zIndex: 999,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoContainer: {
    marginTop: 10,
    width: '100%',
    position: 'relative',
    paddingHorizontal: 12,
    paddingBottom: 20,
    paddingTop: 13,
    backgroundColor: colors.background.transparent.invincible,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 13,
    color: colors.black,
    opacity: 0.8,
  },
});