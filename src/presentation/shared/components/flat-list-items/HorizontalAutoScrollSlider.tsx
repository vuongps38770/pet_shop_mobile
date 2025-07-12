import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Dimensions } from 'react-native';
import ProductCardV2 from './ProductCardV2';

const ITEM_WIDTH = 220;
const SPACING = 8;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HorizontalAutoScrollSliderProps {
  data: { _id: string; name?: string; images: string[] }[];
  onPressItem: (item: any) => void;
  scrollSpeed?: number;
  fps?: number;
}

const MULTIPLIER = 20;

const HorizontalAutoScrollSlider: React.FC<HorizontalAutoScrollSliderProps> = ({
  data,
  onPressItem,
  scrollSpeed = 1.2,
  fps = 60,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollOffset = useRef(0);
  const [centerDisplayIndex, setCenterDisplayIndex] = useState(0);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  const userInteracting = useRef(false);
  const lastCenterIndex = useRef<number>(-1);

  const loopedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    let arr: any[] = [];
    for (let i = 0; i < MULTIPLIER; i++) {
      arr = arr.concat(data);
    }
    return arr;
  }, [data]);

  const middleIndex = Math.floor(loopedData.length / 2);

  const startAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);

    autoScrollInterval.current = setInterval(() => {
      if (!flatListRef.current || !loopedData.length) return;
      scrollOffset.current += scrollSpeed;
      flatListRef.current.scrollToOffset({ offset: scrollOffset.current, animated: false });
    }, 1000 / fps);
  }, [loopedData.length, scrollSpeed, fps]);

  useEffect(() => {
    if (!loopedData.length) return;

    setTimeout(() => {
      scrollOffset.current = (ITEM_WIDTH + SPACING) * middleIndex;
      flatListRef.current?.scrollToOffset({ offset: scrollOffset.current, animated: false });
    }, 100);

    startAutoScroll();

    return () => {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    };
  }, [loopedData, startAutoScroll, middleIndex]);

  const onScrollBeginDrag = () => {
    userInteracting.current = true;
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
  };

  const onScrollEndDrag = () => {
    userInteracting.current = false;
    setTimeout(() => {
      if (!userInteracting.current) startAutoScroll();
    }, 2000);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    scrollOffset.current = offsetX;

    const center = offsetX + SCREEN_WIDTH / 2;
    const idx = Math.floor(center / (ITEM_WIDTH + SPACING));

    if (lastCenterIndex.current !== idx) {
      setCenterDisplayIndex(idx);
      lastCenterIndex.current = idx;
    }
  };

  return (
    <FlatList
      ref={flatListRef}
      data={loopedData}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, idx) => idx.toString()}
      contentContainerStyle={styles.list}
      snapToAlignment="start"
      decelerationRate="fast"
      windowSize={5}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      removeClippedSubviews={true}
      onScroll={onScroll}
      onScrollBeginDrag={onScrollBeginDrag}
      onScrollEndDrag={onScrollEndDrag}
      renderItem={({ item, index }) => (
        <ProductCardV2
          image={item.images[0]}
          title={item.name}
          showBorder={index === centerDisplayIndex}
          onPress={() => onPressItem(item)}
        />
      )}
      getItemLayout={(_, index) => ({
        length: ITEM_WIDTH + SPACING,
        offset: (ITEM_WIDTH + SPACING) * index,
        index,
      })}
      initialScrollIndex={middleIndex}
      scrollEventThrottle={16}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
});

export default HorizontalAutoScrollSlider;
