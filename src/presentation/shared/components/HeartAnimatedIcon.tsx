import React, { useState, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { LucideHeart } from 'lucide-react-native';
import { colors } from '../theme/colors';

export const APP_ICON_SIZE = 24;

const siz_icon = APP_ICON_SIZE * 1.2;

const AnimatedHeart = Animated.createAnimatedComponent(LucideHeart);

type Props = {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
  unFavoriteIconColor?:string
};

export const HeartAnimatedIcon = ({ isFavorite, onPress,size= siz_icon,unFavoriteIconColor=colors.white}: Props) => {
  const scale = useSharedValue(1);
  const [iconColor, setIconColor] = useState(isFavorite ? colors.red.main : unFavoriteIconColor);

  useEffect(() => {
    setIconColor(isFavorite ? colors.red.main : unFavoriteIconColor);
  }, [isFavorite]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    scale.value = withSpring(
      1.2,
      {
        damping: 2,
        stiffness: 150,
      },
      () => {
        scale.value = withSpring(1);
      },
    );
    if (onPress) {
      runOnJS(onPress)();
    }
  };

  return (
    <AnimatedHeart
      size={size}
      color={iconColor}
      fill={iconColor === colors.red.main ? colors.red.main : 'transparent'}
      style={animatedStyle}
      onPress={handlePress}
      /* Accessibility Props */
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Unlike' : 'Like'}
    />
  );
};
