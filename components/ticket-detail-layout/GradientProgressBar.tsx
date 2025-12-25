import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface Props {
  percent: number;
  height?: number;
}

export default function GradientProgressBar({ percent, height = 10 }: Props) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percent,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: '#e5e7eb',
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          height,
          width: widthInterpolated,
        }}
      >
        <LinearGradient
          colors={['#f97316', '#3b82f6', '#22c55e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flex: 1,
            borderRadius: height / 2,
          }}
        />
      </Animated.View>
    </View>
  );
}
