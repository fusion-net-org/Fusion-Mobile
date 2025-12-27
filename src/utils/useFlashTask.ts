import { useRef } from 'react';
import { Animated } from 'react-native';

export const useFlashTask = (defaultColor: string = '#2e8bff') => {
  const anim = useRef(new Animated.Value(0)).current;

  const flash = (color?: string) => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [defaultColor + '33', 'transparent'],
  });

  return { flash, backgroundColor };
};
