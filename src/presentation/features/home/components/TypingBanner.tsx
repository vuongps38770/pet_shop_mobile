import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

const bannerMessages = [
  "Xin chào, bạn!",
  "Ưu đãi hôm nay",
  "Khám phá sản phẩm hot",
];

const TypingBanner = () => {
  const [displayText, setDisplayText] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentMsg = bannerMessages[msgIndex];
    if (typing) {
      if (displayText.length < currentMsg.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentMsg.slice(0, displayText.length + 1));
        }, 28); 
      } else {
        timeout = setTimeout(() => setTyping(false), 2500); 
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentMsg.slice(0, displayText.length - 1));
        }, 1); 
      } else {
        setTyping(true);
        setMsgIndex((msgIndex + 1) % bannerMessages.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, typing, msgIndex]);

  return (
    <Text style={{
      fontSize: 15, // nhỏ lại
      fontWeight: 'bold',
      color: '#FFAF42',
      textAlign: 'center',
      marginTop: 8,
      minHeight: 22,
      letterSpacing: 1.2,
    }}>
      {displayText}
      <Text style={{ color: '#FFAF42' }}>|</Text>
    </Text>
  );
};

export default TypingBanner;