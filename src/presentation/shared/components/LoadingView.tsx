import LottieView from "lottie-react-native";
import { useRef } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { View } from "react-native";


export const LoadingView = () => {
    const animation = useRef<LottieView>(null);
    if (Platform.OS === 'web') {
        return (
            <View style={{ flex: 1, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                
            </View>
        );
    }
    return (
        <LottieView
            autoPlay={true}
            ref={animation}
            loop={true}
            style={{
                backgroundColor: '#eee',
                flex: 1
            }}
            source={require('src/raw/lottie-animation/paw-loading.json')}
            onAnimationFinish={() => animation.current?.play()}>

        </LottieView>
    )
}
