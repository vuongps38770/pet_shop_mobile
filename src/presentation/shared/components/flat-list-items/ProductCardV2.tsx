import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from 'shared/theme/colors';

interface ProductCardV2Props {
  image: string;
  title?: string;
  onPress?: () => void;
  showBorder?: boolean;
}

const ProductCardV2: React.FC<ProductCardV2Props> = ({ image, title, onPress, showBorder = true }) => {
  const borderAnim = useRef(new Animated.Value(showBorder ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: showBorder ? 1 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [showBorder]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,167,38,0)', '#FFA726'],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.absoluteBorder,
          {
            borderColor,
            borderWidth: 2,
          },
        ]}
      />
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={styles.mainImage} resizeMode='contain' />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 18,
    width: 200,
    aspectRatio: 1,
    margin: 8,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  absoluteBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 18,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 12,
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '90%',
    height: '90%',
    borderRadius: 14,
  },
});

export default ProductCardV2;
