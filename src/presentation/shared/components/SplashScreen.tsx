import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from 'theme/colors';
import Logo from 'assets/images/logo.svg'
import PawUp from 'assets/icons/PawUp.svg'
import PawDown from 'assets/icons/PawDown.svg'

interface PawPrintConfig {
    id: string;
    type: 'up' | 'down';
    top?: string;
    left?: string;
    right?: string;
    delay: number;

}

const pawPrintsConfig: PawPrintConfig[] = [
    { id: 'p1', type: 'up', top: '48%', left: '-2%', delay: 100},
    { id: 'p2', type: 'down', top: '-200', right: '-15%', delay: 200 },
];

const SplashScreen = () => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const pawPrintAnims = useRef(pawPrintsConfig.map(() => ({
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0),
    }))).current;

    useEffect(() => {

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1, 
                duration: 1000,
                easing: Easing.elastic(1),
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1.3, 
                duration: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();


        const pawPrintAnimations = pawPrintsConfig.map((config, index) =>
            Animated.sequence([
                Animated.delay(config.delay),
                Animated.parallel([
                    Animated.timing(pawPrintAnims[index].scale, {
                        toValue: 1.5, 
                        duration: 500,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pawPrintAnims[index].opacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        );

        Animated.parallel(pawPrintAnimations).start();
    }, []);

    return (
        <View style={styles.container}>
            {pawPrintsConfig.map((config, index) => {
                const PawComponent = config.type === 'up' ? PawUp : PawDown;
                const pawPrintAnimatedStyle: any = {
                    position: 'absolute',
                    width: 90, // Increased size for paw prints
                    height: 90, // Increased size for paw prints
                    transform: [
                        { scale: pawPrintAnims[index].scale },
                    ],
                    opacity: pawPrintAnims[index].opacity,
                };

                if (config.top) {
                    pawPrintAnimatedStyle.top = config.top;
                }
                if (config.left) {
                    pawPrintAnimatedStyle.left = config.left;
                }
                if (config.right) {
                    pawPrintAnimatedStyle.right = config.right;
                }

                return (
                    <Animated.View
                        key={config.id}
                        style={pawPrintAnimatedStyle}
                    >
                        <PawComponent width={60}  />
                    </Animated.View>
                );
            })}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            >
                <Logo width={300} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.app.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },

});

export default SplashScreen;