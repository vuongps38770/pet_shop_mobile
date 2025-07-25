import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import LeftTriangle from 'assets/icons/left-filled-arrow-triangle.svg'
import RightTriangle from 'assets/icons/right-filled-arrow-triangle.svg'

type ImageSliderProps = {
    urls: string[];
    width: number;
    height: number;
    showIndicator?: boolean;
    indicatorColor?: string;
    indicatorInactiveColor?: string;
    showNavigationButtons?: boolean;
    borderRadius?: number;
    autoScroll?: boolean;
    autoScrollInterval?: number;
};

const ImageSlider = ({ urls, height, width, showIndicator = true,
    indicatorColor = '#fff',
    indicatorInactiveColor = '#888',
    showNavigationButtons = true,
    borderRadius = 0,
    autoScroll = false,
    autoScrollInterval = 3000, }: ImageSliderProps) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollToIndex = (index: number) => {
        if (index >= 0 && index < urls.length) {
            flatListRef.current?.scrollToIndex({ index, animated: true });
            setCurrentIndex(index);
        }
    };

    const handlePrev = () => scrollToIndex(currentIndex - 1);
    const handleNext = () => scrollToIndex(currentIndex + 1);

    // Auto scroll effect
    useEffect(() => {
        if (autoScroll && urls.length > 1) {
            const interval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % urls.length;
                scrollToIndex(nextIndex);
            }, autoScrollInterval);

            return () => clearInterval(interval);
        }
    }, [currentIndex, autoScroll, autoScrollInterval, urls.length]);

    return (
        <View style={[styles.container, { width, height, borderRadius }]}>
            <FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled
                data={urls}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image 
                        source={{ uri: item }} 
                        resizeMode='cover' 
                        style={{ width, height, borderRadius }} 
                    />
                )}
                scrollEnabled={true}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                onMomentumScrollEnd={e => {
                    const newIndex = Math.round(
                        e.nativeEvent.contentOffset.x / width
                    );
                    setCurrentIndex(newIndex);
                }}
            />
            {showIndicator && (
                <View style={styles.indicatorContainer}>
                    {urls.map((_, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.indicator,
                                {
                                    backgroundColor:
                                        idx === currentIndex ? indicatorColor : indicatorInactiveColor,
                                },
                            ]}
                        />
                    ))}
                </View>
            )}
            {showNavigationButtons && currentIndex > 0 && (
                <TouchableOpacity style={styles.leftButton} onPress={handlePrev}>
                    {/* <Text style={styles.buttonText}>◀</Text> */}
                    <LeftTriangle width={20} height={20}/>
                </TouchableOpacity>
            )}
            {showNavigationButtons && currentIndex < urls.length - 1 && (
                <TouchableOpacity style={styles.rightButton} onPress={handleNext}>
                    {/* <Text style={styles.buttonText}>▶</Text> */}
                    <RightTriangle width={20} height={20}/>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 0, // Sẽ được override bởi prop
    },
    leftButton: {
        position: 'absolute',
        top: '40%',
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 20,
        zIndex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    rightButton: {
        position: 'absolute',
        top: '40%',
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 20,
        zIndex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ImageSlider;
