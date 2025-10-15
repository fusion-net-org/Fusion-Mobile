import { authHeroSlides } from '@/constants/data/auth';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { images } from '../../constants/image/image';

export default function AuthHeroSection() {
  const [page, setPage] = useState(0);

  return (
    <View className="w-full items-center justify-center">
      {/* Logo Section */}
      <View className="mb-4 mt-8 items-center">
        <Image source={images.logoFusion} className="h-30 w-30" resizeMode="contain" />
      </View>

      {/* Carousel */}
      <PagerView
        style={{ width: '100%', height: 450 }}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {authHeroSlides.map((item, index) => (
          <View key={index} className="items-center justify-center">
            <Image source={item.image} className="h-100 w-100 mt-6" resizeMode="contain" />
            <Text className="text-center text-base text-white">{item.text}</Text>
          </View>
        ))}
      </PagerView>

      {/* Dots */}
      <View className="mt-6 flex-row justify-center">
        {authHeroSlides.map((_, i) => (
          <View
            key={i}
            className={`mx-1 h-2 w-2 rounded-full ${page === i ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </View>
    </View>
  );
}
