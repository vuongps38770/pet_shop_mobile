import React, { useRef, useState } from 'react';
import { Animated, PanResponder, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const PULL_DISTANCE = 40;

type CustomPullToRefreshProps = {
  refreshing?: boolean;
  onRefresh?: () => void;
  children?: React.ReactNode;
};

const CustomPullToRefresh: React.FC<CustomPullToRefreshProps> = ({ refreshing=false, onRefresh, children }) => {
  const [isPulling, setIsPulling] = useState(false);
  const offset = useRef(new Animated.Value(0)).current;


  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0 && !refreshing,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0 && gestureState.dy < PULL_DISTANCE * 2) {
          offset.setValue(gestureState.dy / 2);
          setIsPulling(true);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > PULL_DISTANCE) {
          
          Animated.timing(offset, {
            toValue: PULL_DISTANCE,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            onRefresh && onRefresh();
          });
        } else {
          // Kéo chưa đủ, trả về 0
          Animated.timing(offset, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
          }).start(() => setIsPulling(false));
        }
      },
    })
  ).current;

  // Khi tắt load, animate về 0
  React.useEffect(() => {
    if (!refreshing && isPulling) {
      Animated.timing(offset, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setIsPulling(false));
    }
  }, [refreshing]);

  return (
    <View style={{ flex: 1, overflow: 'hidden' }} {...panResponder.panHandlers}>
      <Animated.View style={{ height: offset, alignItems: 'center', justifyContent: 'flex-end' }}>
        {(refreshing || isPulling) && (
          <View style={styles.refreshView}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.text}>Đang làm mới...</Text>
          </View>
        )}
      </Animated.View>
      <Animated.View style={{ flex: 1, transform: [{ translateY: offset }] }}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  refreshView: {
    height: PULL_DISTANCE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 4,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default CustomPullToRefresh;