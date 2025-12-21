import { authHeroSlides } from '@/constants/data/auth';
import { images } from '@/constants/image/image';
import { useState } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';

const PagerView = require('react-native-pager-view').default;
const { width } = Dimensions.get('window');

export default function AuthHeroSection() {
  const [page, setPage] = useState(0);
  const { width } = Dimensions.get('window');
  const CAROUSEL_WIDTH = width * 0.9;

  return (
    <View className="w-full items-center">
      {/* Logo */}
      <View className="flex-row items-center justify-center pt-6">
        <Image
          source={images.logoFusion}
          style={{ width: 36, height: 36, resizeMode: 'contain' }}
        />

        <Text className="ml-2 text-xl font-bold tracking-widest text-white">FUSION</Text>
      </View>

      {/* Carousel */}
      <PagerView
        style={{ width: '100%', height: 360 }}
        initialPage={0}
        onPageSelected={(e: any) => setPage(e.nativeEvent.position)}
      >
        {authHeroSlides.map((item, index) => (
          <View
            key={index}
            className="items-center justify-center"
            style={{ width: CAROUSEL_WIDTH, alignSelf: 'center' }}
          >
            <Image
              source={item.image}
              style={{
                width: CAROUSEL_WIDTH * 3,
                height: 250,
                resizeMode: 'contain',
              }}
            />

            <Text className="mt-4 px-2 text-center text-lg leading-7 text-white">{item.text}</Text>
          </View>
        ))}
      </PagerView>

      {/* Dots */}
      <View className="mt-3 flex-row justify-center">
        {authHeroSlides.map((_, i) => (
          <View
            key={i}
            className={`mx-1 h-1.5 w-1.5 rounded-full ${page === i ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </View>
    </View>
  );
}
