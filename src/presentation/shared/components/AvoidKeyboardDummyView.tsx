import React, { useEffect, useState } from "react";
import { View, Keyboard } from "react-native";

interface AvoidKeyboardDummyViewProps {
  minHeight?: number;
  maxHeight?: number;
}

const AvoidKeyboardDummyView: React.FC<AvoidKeyboardDummyViewProps> = ({
  minHeight = 50,
  maxHeight = 400,
}) => {
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setHeight(maxHeight));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setHeight(minHeight));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [minHeight, maxHeight]);

  return <View style={{ height }} />;
};

export default AvoidKeyboardDummyView;