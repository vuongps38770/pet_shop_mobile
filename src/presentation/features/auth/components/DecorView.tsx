import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import PawStep from 'assets/images/paw-step.svg';
import Bubbles from 'assets/images/bubbles.svg';

type DecorProps={
    pawVal?:number,
    bubblesVal?:number
}
const Decor: React.FC<DecorProps> = ({ pawVal=-30, bubblesVal=-100 }) => {
  const pawAnim = useRef(new Animated.Value(-150)).current;
  const bubblesAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pawAnim, { toValue: -30, useNativeDriver: false }),
      Animated.spring(bubblesAnim, { toValue: bubblesVal, useNativeDriver: false }),
    ]).start();
    return () => {
      Animated.parallel([
        Animated.timing(pawAnim, { toValue: -150, duration: 300, useNativeDriver: false }),
        Animated.timing(bubblesAnim, { toValue: -250, duration: 300, useNativeDriver: false }),
      ]).start();
    };
  }, []);

  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <Animated.View style={{ position: 'absolute', top: -20, left: pawAnim }}>
        <PawStep width={130} height={130} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', top: -40, right: bubblesAnim }}>
        <Bubbles width={230} height={230} />
      </Animated.View>
    </View>
  );
};

export default Decor;