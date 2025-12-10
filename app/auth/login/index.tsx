import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

import { loginGoogle } from '@/src/services/authService';
import { images } from '../../../constants/image/image';
import { ROUTES } from '../../../routes/route';
import { AppDispatch } from '../../../src/redux/store';
import { registerUserDevice } from '../../../src/redux/userDeviceSlice';
import { loginUser, loginUserThunk } from '../../../src/redux/userSlice';

WebBrowser.maybeCompleteAuthSession();
const WEB_CLIENT_ID = '109449510030-0no07rem23qsum7soganoqfa7uhelc3s.apps.googleusercontent.com';
const ANDROID_CLIENT_ID =
  '130323105827-umcurb87ac7kpdubkluac30fe6vlupad.apps.googleusercontent.com';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: false, // dev standalone APK không dùng proxy
    scheme: 'fusion', // scheme trùng app.json
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID, // dùng client vừa tạo
    scopes: ['profile', 'email'],
    redirectUri,
  });

  // Google login
  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;

      if (!idToken) {
        Toast.show({
          type: 'error',
          text1: 'Login Fail',
          text2: 'Google did not return ID Token',
        });
        return;
      }

      handleGoogleBackend(idToken);
    }
  }, [response]);

  // Gửi token Google về backend Fusion
  const handleGoogleBackend = async (idToken: string) => {
    try {
      const data = await loginGoogle({ token: idToken });

      dispatch(loginUser(data));

      try {
        await dispatch(registerUserDevice()).unwrap();
      } catch (err) {
        console.warn('⚠️ Device register failed:', err);
      }

      router.replace(ROUTES.HOME.COMPANY as any);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Fail',
        text2: err.message || 'Backend Google login failed',
      });
    }
  };

  // Normal login
  const handleLogin = async () => {
    try {
      const res = await dispatch(loginUserThunk({ email, password }));

      if (loginUserThunk.fulfilled.match(res)) {
        const userData = res.payload.data;

        dispatch(
          loginUser({
            userName: userData.userName,
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken,
          }),
        );

        await dispatch(registerUserDevice()).unwrap();

        router.replace(ROUTES.HOME.COMPANY as any);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Fail',
          text2: 'Invalid email or password.',
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Login Fail',
        text2: 'Something went wrong.',
      });
    }
  };

  const handleGoogleLogin = () => {
    if (request) promptAsync();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B66FF]">
      <StatusBar barStyle="light-content" backgroundColor="#0B66FF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 px-6"
      >
        {/* Logo */}
        <View className="items-center pt-6">
          <Image
            source={images.logoFusion}
            style={{ width: 120, height: 36, resizeMode: 'contain' }}
          />
        </View>

        {/* Login Card */}
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
              >
                <Ionicons name={show ? 'eye-off' : 'eye'} size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <View className="mb-4 items-end">
              <TouchableOpacity onPress={() => router.push(ROUTES.AUTH.REQUIRE_EMAIL as any)}>
                <Text className="text-sm font-medium text-[#0B66FF]">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login button */}
            <TouchableOpacity
              className="mb-5 rounded-full bg-[#0B66FF] py-3 shadow-md shadow-[#0B66FF]/40"
              style={{ elevation: 6 }}
              onPress={handleLogin}
            >
              <Text className="text-center text-base font-semibold text-white">Log In</Text>
            </TouchableOpacity>

            {/* OR */}
            <View className="mb-4 flex-row items-center justify-center">
              <View className="mr-3 h-px flex-1 bg-gray-200" />
              <Text className="text-sm text-gray-400">Or</Text>
              <View className="ml-3 h-px flex-1 bg-gray-200" />
            </View>

            {/* Google Sign-in */}
            <TouchableOpacity
              disabled={!request}
              onPress={handleGoogleLogin}
              className="mb-2 flex-row items-center justify-center rounded-lg border border-gray-200 bg-white py-3 shadow-sm"
            >
              <Image className="mr-3 h-5 w-5" resizeMode="contain" source={images.google} />
              <Text className="font-medium text-gray-700">Sign in with Google</Text>
            </TouchableOpacity>

            {/* Sign up link */}
            <View className="mt-3 items-center space-y-2">
              <Text className="mt-3 text-sm text-gray-600">
                Don&apos;t have account?{' '}
                <Text
                  className="font-semibold text-[#0B66FF]"
                  onPress={() => router.push(ROUTES.AUTH.REGISTER as any)}
                >
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <View className="h-6" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
