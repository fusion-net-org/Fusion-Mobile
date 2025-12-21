import AuthHeroSection from '@/components/auth-layout/authherosection';
import { useRouter } from 'expo-router';
import { Linking, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROUTES } from '../../routes/route';

export default function AuthLayout() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#0B66FF]">
      <StatusBar barStyle="light-content" backgroundColor="#0B66FF" />

      <View className="flex-1 px-6">
        <AuthHeroSection />

        {/* Buttons */}
        <View className="mt-auto pb-8">
          {/* Login */}
          <TouchableOpacity
            activeOpacity={0.85}
            className="mb-4 rounded-md bg-white py-3.5"
            onPress={() => router.push(ROUTES.AUTH.LOGIN as any)}
          >
            <Text className="text-center text-base font-semibold text-[#0B66FF]">Log in</Text>
          </TouchableOpacity>

          {/* Register */}
          <TouchableOpacity
            activeOpacity={0.85}
            className="mb-6 mt-4 rounded-md border border-white py-3.5"
            onPress={() => router.push(ROUTES.AUTH.REGISTER as any)}
          >
            <Text className="text-center text-base font-semibold text-white">Sign up</Text>
          </TouchableOpacity>

          <View className="mt-4 px-4">
            <Text className="text-center text-base text-white/70">
              By signing up, you agree to our <Text className="underline">Terms of Service</Text>{' '}
              and <Text className="underline">Privacy Policy</Text>.
            </Text>
          </View>

          {/* Help */}
          <Text
            className="pt-5 text-center text-sm text-white/80 underline"
            onPress={() => Linking.openURL('#')}
          >
            Can’t log in or sign up?
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
