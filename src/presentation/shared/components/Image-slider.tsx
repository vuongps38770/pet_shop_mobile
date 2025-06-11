import React, { useRef, useState } from 'react';
import {
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';


type ImageSliderProps = {
    urls: string[];
    width: number;
    height: number;
    showIndicator?: boolean;
    indicatorColor?: string;
    indicatorInactiveColor?: string;
};

const ImageSlider = ({ urls, height, width, showIndicator = true,
    indicatorColor = '#fff',
    indicatorInactiveColor = '#888', }: ImageSliderProps) => {
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

    return (
        <View style={[styles.container, { width, height }]}>
            <FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled
                data={urls}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} resizeMode='cover' style={{ width, height }} />
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
            {currentIndex > 0 && (
                <TouchableOpacity style={styles.leftButton} onPress={handlePrev}>
                    <Text style={styles.buttonText}>◀</Text>
                </TouchableOpacity>
            )}
            {currentIndex < urls.length - 1 && (
                <TouchableOpacity style={styles.rightButton} onPress={handleNext}>
                    <Text style={styles.buttonText}>▶</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
    leftButton: {
        position: 'absolute',
        top: '40%',
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 20,
        zIndex: 1,
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
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ImageSlider;
