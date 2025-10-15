import AlertHeader from '@/components/layouts/alert-header';
import { StatusBar, Text, View } from 'react-native';

const Index = () => {
  return (
    <>
      <StatusBar hidden={true} />
      <AlertHeader />
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-amber-300">calendar</Text>
      </View>
    </>
  );
};

export default Index;
