import { Platform, UIManager } from 'react-native';
import  {
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Animation types
export type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'spring';
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

// Animation configuration interface
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
}

// Default animation configurations
export const DEFAULT_CONFIG = {
  duration: 300,
  delay: 0,
  easing: Easing.ease,
} as const;

/**
 * Fade animation
 */
export const useFadeAnimation = (initialValue: number = 0) => {
  const opacity = useSharedValue(initialValue);

  const fadeIn = (config: AnimationConfig = {}) => {
    opacity.value = withTiming(1, {
      duration: config.duration || DEFAULT_CONFIG.duration,
      easing: config.easing || DEFAULT_CONFIG.easing,
    });
  };

  const fadeOut = (config: AnimationConfig = {}) => {
    opacity.value = withTiming(0, {
      duration: config.duration || DEFAULT_CONFIG.duration,
      easing: config.easing || DEFAULT_CONFIG.easing,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { animatedStyle, fadeIn, fadeOut };
};

/**
 * Slide animation
 */
export const useSlideAnimation = (
  initialValue: number = 0,
  direction: AnimationDirection = 'up'
) => {
  const translate = useSharedValue(initialValue);

  const slideIn = (config: AnimationConfig = {}) => {
    const toValue = direction === 'up' || direction === 'left' ? -100 : 100;
    translate.value = withTiming(toValue, {
      duration: config.duration || DEFAULT_CONFIG.duration,
      easing: config.easing || DEFAULT_CONFIG.easing,
    });
  };

  const slideOut = (config: AnimationConfig = {}) => {
    translate.value = withTiming(0, {
      duration: config.duration || DEFAULT_CONFIG.duration,
      easing: config.easing || DEFAULT_CONFIG.easing,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const transforms = [];
    if (direction === 'left' || direction === 'right') {
      transforms.push({ translateX: translate.value });
    } else {
      transforms.push({ translateY: translate.value });
    }
    return {
      transform: transforms,
    };
  });

  return { animatedStyle, slideIn, slideOut };
};

/**
 * Scale animation
 */
export const useScaleAnimation = (initialValue: number = 0) => {
  const scale = useSharedValue(initialValue);

  const scaleIn = (config: AnimationConfig = {}) => {
    scale.value = withTiming(1, {
      duration: config.duration || DEFAULT_CONFIG.duration,
      easing: config.easing || DEFAULT_CONFIG.easing,
    });
  };

  const scaleOut = (config: AnimationConfig = {}) => {
    scale.value = withTiming(0, {
      duration: config.duration || DEFAULT_CONFIG.duration,
      easing: config.easing || DEFAULT_CONFIG.easing,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, scaleIn, scaleOut };
};

/**
 * Bounce animation
 */
export const useBounceAnimation = (initialValue: number = 0) => {
  const scale = useSharedValue(initialValue);

  const bounce = (config: AnimationConfig = {}) => {
    scale.value = withSequence(
      withSpring(1.2, {
        damping: 8,
        stiffness: 40,
      }),
      withSpring(1, {
        damping: 8,
        stiffness: 40,
      })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, bounce };
};

/**
 * Spring animation
 */
export const useSpringAnimation = (initialValue: number = 0) => {
  const value = useSharedValue(initialValue);

  const spring = (toValue: number, config: AnimationConfig = {}) => {
    value.value = withSpring(toValue, {
      damping: 7,
      stiffness: 40,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: value.value }],
  }));

  return { animatedStyle, spring };
}; 