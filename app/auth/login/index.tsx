import { sendNotification } from '@/src/services/notificationService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { images } from '../../../constants/image/image';
import { ROUTES } from '../../../routes/route';
import { AppDispatch } from '../../../src/redux/store';
import { registerUserDevice } from '../../../src/redux/userDeviceSlice';
import { loginUser, loginUserThunk } from '../../../src/redux/userSlice';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const response = await dispatch(
        loginUserThunk({
          email,
          password,
        }),
      ).unwrap();

      const userData = response.data;
      const loginData = {
        userName: userData.userName,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      };
      // Lưu user data vào Redux
      dispatch(loginUser(loginData));

      // Sau khi lưu user data, gọi register device
      try {
        await dispatch(registerUserDevice()).unwrap();
      } catch (deviceError) {
        console.warn('⚠️ Device registration failed after login:', deviceError);
      }

      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        console.warn('⚠️ Không tìm thấy user trong AsyncStorage');
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.userId;
      if (!userId) {
        console.warn('⚠️ userId không tồn tại trong AsyncStorage');
        return;
      }

      try {
        dispatch(
          await sendNotification({
            userId: userId,
            title: '🎉 Đăng nhập thành công!',
            body: `Chào mừng ${userData.userName} quay trở lại ứng dụng 👋`,
            event: 'UserLogin',
            context: JSON.stringify({ time: new Date().toISOString() }),
            notificationType: 'SYSTEM',
          }),
        ).unwrap();
        console.log('✅ Notification sent to user');
      } catch (notifyErr) {
        console.warn('⚠️ Send notification failed:', notifyErr);
      }

      router.replace(ROUTES.HOME.COMPANY as any); // điều hướng sang trang chính
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B66FF]">
      <StatusBar barStyle="light-content" backgroundColor="#0B66FF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 px-6"
      >
        {/* Top logo */}
        <View className="items-center pt-6">
          <Image
            source={images.logoFusion}
            style={{ width: 120, height: 36, resizeMode: 'contain' }}
          />
        </View>

        {/* Card login */}
        <View className="flex-1 justify-center">
          <View
            className="rounded-3xl bg-gray-100 p-6 shadow-lg shadow-[#0B3ECC]/40"
            style={{
              elevation: 10,
              shadowColor: '#0B3ECC',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              transform: [{ translateY: -8 }],
            }}
          >
            <Text className="mb-6 text-center text-2xl font-bold text-gray-900">Sign in</Text>

            {/* Email */}
            <Text className="mb-2 text-sm text-gray-500">Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#9AA8DB"
              keyboardType="email-address"
              autoCapitalize="none"
              className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm"
            />

            {/* Password */}
            <View className="relative mb-4">
              <Text className="mb-2 text-sm text-gray-500">Password</Text>

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9AA8DB"
                secureTextEntry={!show}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 shadow-sm"
              />

              <TouchableOpacity
                onPress={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 pt-7"
                accessibilityRole="button"
                accessibilityLabel={show ? 'Hide password' : 'Show password'}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name={show ? 'eye-off' : 'eye'} size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {error ? <Text className="mb-2 text-sm text-red-500">{error}</Text> : null}

            {/* Forgot password */}
            <View className="mb-4 items-end">
              <TouchableOpacity activeOpacity={0.8}>
                <Text className="text-sm font-medium text-[#0B66FF]">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Button Login */}
            <TouchableOpacity
              activeOpacity={0.9}
              className="mb-5 rounded-full bg-[#0B66FF] py-3 shadow-md shadow-[#0B66FF]/40"
              style={{ elevation: 6 }}
              onPress={() => {
                handleLogin();
              }}
            >
              <Text className="text-center text-base font-semibold text-white">Log In</Text>
            </TouchableOpacity>

            {/* OR divider */}
            <View className="mb-4 flex-row items-center justify-center">
              <View className="mr-3 h-px flex-1 bg-gray-200" />
              <Text className="text-sm text-gray-400">Or</Text>
              <View className="ml-3 h-px flex-1 bg-gray-200" />
            </View>

            {/* Google Sign-in */}
            <TouchableOpacity
              activeOpacity={0.85}
              className="mb-2 flex-row items-center justify-center rounded-lg border border-gray-200 bg-white py-3 shadow-sm"
            >
              <Image className="mr-3 h-5 w-5" resizeMode="contain" source={images.google} />
              <Text className="font-medium text-gray-700">Sign in with Google</Text>
            </TouchableOpacity>

            {/* Sign up link*/}
            <View className="mt-3 items-center space-y-2">
              <Text className="mt-3 text-sm text-gray-600">
                Don&apos;t have account?{' '}
                <Text
                  className="font-semibold text-[#0B66FF]"
                  onPress={() => {
                    router.push(ROUTES.AUTH.REGISTER as any);
                  }}
                >
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-6" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
