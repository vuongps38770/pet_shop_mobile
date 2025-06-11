import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimation } from '../../hooks/common/useAnimation';
import { colors } from '../../theme/colors';

/**
 * AnimationSample Component
 * 
 * Hướng dẫn sử dụng các loại animation trong React Native
 */
const AnimationSample: React.FC = () => {
  // Fade Animation
  const { animatedStyle: fadeStyle, fadeIn, fadeOut } = useAnimation({ type: 'fade' });
  
  // Slide Animation
  const { animatedStyle: slideStyle, slideIn, slideOut } = useAnimation({ type: 'slide', direction: 'up' });
  
  // Scale Animation
  const { animatedStyle: scaleStyle, scaleIn, scaleOut } = useAnimation({ type: 'scale' });
  
  // Bounce Animation
  const { animatedStyle: bounceStyle, bounce } = useAnimation({ type: 'bounce' });
  
  // Spring Animation
  const { animatedStyle: springStyle, spring } = useAnimation({ type: 'spring' });
  
  // Layout Animation
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Fade Animation Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Fade Animation</Text>
        <Animated.View style={[styles.box, fadeStyle]}>
          <Text style={styles.boxText}>Fade Box</Text>
        </Animated.View>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => fadeIn()}
          >
            <Text style={styles.buttonText}>Fade In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => fadeOut()}
          >
            <Text style={styles.buttonText}>Fade Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Slide Animation Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Slide Animation</Text>
        <Animated.View style={[styles.box, slideStyle]}>
          <Text style={styles.boxText}>Slide Box</Text>
        </Animated.View>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => slideIn()}
          >
            <Text style={styles.buttonText}>Slide In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => slideOut()}
          >
            <Text style={styles.buttonText}>Slide Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scale Animation Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Scale Animation</Text>
        <Animated.View style={[styles.box, scaleStyle]}>
          <Text style={styles.boxText}>Scale Box</Text>
        </Animated.View>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => scaleIn()}
          >
            <Text style={styles.buttonText}>Scale In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => scaleOut()}
          >
            <Text style={styles.buttonText}>Scale Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bounce Animation Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Bounce Animation</Text>
        <Animated.View style={[styles.box, bounceStyle]}>
          <Text style={styles.boxText}>Bounce Box</Text>
        </Animated.View>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => bounce()}
          >
            <Text style={styles.buttonText}>Bounce!</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Spring Animation Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Spring Animation</Text>
        <Animated.View style={[styles.box, springStyle]}>
          <Text style={styles.boxText}>Spring Box</Text>
        </Animated.View>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => spring(1.5)}
          >
            <Text style={styles.buttonText}>Spring!</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Layout Animation Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Layout Animation</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={toggleExpand}
        >
          <Text style={styles.buttonText}>Toggle Expand</Text>
        </TouchableOpacity>
        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.boxText}>Expanded Content</Text>
          </View>
        )}
      </View>

      {/* Usage Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hướng dẫn sử dụng</Text>
        <Text style={styles.instructionText}>
          1. Import useAnimation hook từ hooks/common/useAnimation{'\n\n'}
          2. Sử dụng hook trong component:{'\n'}
          const {'{'} animatedStyle, fadeIn, fadeOut {'}'} = useAnimation({'{\n'}
            type: 'fade',{'\n'}
            initialValue: 0,{'\n'}
            config: {'{\n'}
              duration: 300,{'\n'}
              easing: Easing.ease,{'\n'}
            {'}'},{'\n'}
          {'}'});{'\n\n'}
          3. Các loại animation có sẵn:{'\n'}
          - fade: hiệu ứng mờ dần{'\n'}
          - slide: hiệu ứng trượt{'\n'}
          - scale: hiệu ứng phóng to/thu nhỏ{'\n'}
          - bounce: hiệu ứng nảy{'\n'}
          - spring: hiệu ứng lò xo{'\n\n'}
          4. Sử dụng Animated.View từ react-native-reanimated{'\n\n'}
          5. Gọi các hàm animation để kích hoạt{'\n\n'}
          
          Tips:{'\n'}
          - Animation chạy trên JS thread nên không gây lag{'\n'}
          - Có thể kết hợp nhiều animation{'\n'}
          - Sử dụng withTiming và withSpring cho animation mượt mà{'\n'}
          - Test kỹ trên cả iOS và Android
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: colors.blue.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  boxText: {
    color: colors.background.default,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: colors.blue.main,
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background.default,
    fontWeight: 'bold',
  },
  expandedContent: {
    backgroundColor: colors.blue.light,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  instructionText: {
    color: colors.text.secondary,
    lineHeight: 24,
  },
});

export default AnimationSample; 