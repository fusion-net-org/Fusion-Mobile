import AuthHeroSection from '@/components/auth-layout/authherosection';
import { useRouter } from 'expo-router';
import { Linking, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROUTES } from '../../routes/route';

export default function AuthLayout() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-[#0b66ff]">
      <StatusBar barStyle="light-content" backgroundColor="#0b66ff" />
      <View className="flex-1 items-center justify-between px-6">
        <AuthHeroSection />

        {/* Buttons */}
        <View className="w-full gap-y-1 pb-12">
          <TouchableOpacity
            activeOpacity={0.8}
            className="mb-4 rounded-lg bg-white py-3"
            onPress={() => {
              router.push(ROUTES.AUTH.LOGIN as any);
            }}
          >
            <Text className="text-center font-semibold text-[#0b66ff]">SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="mb-4 rounded-lg border border-white py-3"
            onPress={() => {
              //navigation.navigate('Register')
            }}
          >
            <Text className="text-center font-semibold text-white">CREATE ACCOUNT</Text>
          </TouchableOpacity>

          <View className="items-center">
            <Text
              className="text-center text-sm text-white underline"
              onPress={() => Linking.openURL('#')} // mo link deploy website FE
            >
              Trouble signing in or registering?
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
