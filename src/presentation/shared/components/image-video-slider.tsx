import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import LeftTriangle from 'assets/icons/left-filled-arrow-triangle.svg'
import RightTriangle from 'assets/icons/right-filled-arrow-triangle.svg'
import VolumeIcon from 'assets/icons/volume.svg'
import VolumeMuteIcon from 'assets/icons/mute-volume.svg'
type Media = {
    urls: string
    type: string
}
type ImageVideoSliderProps = {
    medias: Media[]
    height: number;
    showIndicator?: boolean;
    indicatorColor?: string;
    indicatorInactiveColor?: string;
    showNavigationButtons?: boolean;
    borderRadius?: number;
    autoScroll?: boolean;
    autoScrollInterval?: number;
    isVisible: boolean
};

const ImageVideoSlider: React.FC<ImageVideoSliderProps> = ({ height, showIndicator = true,
    indicatorColor = '#fff',
    indicatorInactiveColor = '#888',
    showNavigationButtons = true,
    borderRadius = 0,
    autoScroll = false,
    autoScrollInterval = 3000, medias = [],
    isVisible = true }:
    ImageVideoSliderProps
) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollToIndex = (index: number) => {
        if (index >= 0 && index < medias.length) {
            flatListRef.current?.scrollToIndex({ index, animated: true });
            setCurrentIndex(index);
        }
    };

    const handlePrev = () => scrollToIndex(currentIndex - 1);
    const handleNext = () => scrollToIndex(currentIndex + 1);
    // Auto scroll effect
    useEffect(() => {
        if (autoScroll && medias.length > 1) {
            const interval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % medias.length;
                scrollToIndex(nextIndex);
            }, autoScrollInterval);

            return () => clearInterval(interval);
        }
    }, [currentIndex, autoScroll, autoScrollInterval, medias.length]);
    const [containerWidth, setContainerWidth] = useState(0);





    return (
        <View style={[styles.container, { width: "100%", height, borderRadius }]}
            onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
            <FlatList<Media>
                ref={flatListRef}
                horizontal
                pagingEnabled
                data={medias}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => {
                    if (item.type === "IMAGE") {
                        return (
                            <Image
                                source={{ uri: item.urls }}
                                resizeMode='cover'
                                style={{ width: containerWidth, height, borderRadius }}
                            />
                        );
                    }
                    else if (item.type === 'VIDEO') {
                        return (
                            <VideoSlide
                                uri={item.urls}
                                isActive={isVisible && index === currentIndex}
                                height={height}
                                width={containerWidth}
                            />
                        );
                    }
                    else {
                        return null;
                    }
                }}
                getItemLayout={(_, index) => ({
                    length: containerWidth,
                    offset: containerWidth * index,
                    index,
                })}
                onMomentumScrollEnd={e => {
                    const newIndex = Math.round(
                        e.nativeEvent.contentOffset.x / containerWidth
                    );
                    setCurrentIndex(newIndex);
                }}
                scrollEnabled={true}
            />
            {showIndicator && (
                <View style={styles.indicatorContainer}>
                    {medias.map((_, idx) => (
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
                    <LeftTriangle width={14} height={14} />
                </TouchableOpacity>
            )}
            {showNavigationButtons && currentIndex < medias.length - 1 && (
                <TouchableOpacity style={styles.rightButton} onPress={handleNext}>
                    <RightTriangle width={14} height={14} />
                </TouchableOpacity>
            )}
        </View>
    );
};
const VideoSlide = ({ uri, isActive, width, height }: { uri: string; isActive: boolean, width: number, height: number }) => {
    const player = useVideoPlayer(uri);
    player.loop = true;

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (!player) return;
        if (isActive) {
            player.play();
            setIsPlaying(true);
        } else {
            player.pause();
            setIsPlaying(false);
        }
    }, [isActive, player]);

    const togglePlayPause = () => {
        if (!player) return;
        if (isPlaying) {
            player.pause();
            setIsPlaying(false);
        } else {
            player.play();
            setIsPlaying(true);
        }
    };

    const toggleMute = () => {
        if (!player) return;
        player.volume = isMuted ? 1 : 0;
        setIsMuted(!isMuted);
    };

    useEffect(() => {
        if (!player) return;
        if (isActive) {
            player.play();
        } else {
            player.pause();
        }
    }, [isActive, player]);

    return (
        <View style={{ width, height }}>
            <TouchableOpacity
                activeOpacity={1}
                style={{ width, height }}
                onPress={togglePlayPause}
            >
                <VideoView
                    style={{ width, height }}
                    player={player}
                    allowsFullscreen={false}
                    nativeControls={false}
                />
            </TouchableOpacity>

            {/* Nút bật/tắt âm lượng */}
            <TouchableOpacity
                onPress={toggleMute}
                style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: 8,
                    borderRadius: 20,
                }}
            >

                {isMuted
                    ?
                    <VolumeMuteIcon width={16} height={16} />
                    :
                    <VolumeIcon width={16} height={16} />
                }

            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 0,
    },
    leftButton: {
        position: 'absolute',
        top: '40%',
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 20,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ImageVideoSlider;
