import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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

import { images } from '@/constants/image/image';
import { ROUTES } from '@/routes/route';
import { AppDispatch } from '@/src/redux/store';
import { registerUserDevice } from '@/src/redux/userDeviceSlice';
import { loginUser, loginUserThunk } from '@/src/redux/userSlice';
import { loginGoogle } from '@/src/services/authService';
import { webClientId } from '@/src/utils/firebaseConfig';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId,
      offlineAccess: false,
    });
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('Google ID token not found');
      }
      const data = await loginGoogle({ token: idToken });
      console.log(data, 'Data User');
      dispatch(loginUser(data.data));
      await dispatch(registerUserDevice()).unwrap();

      router.replace(ROUTES.HOME.COMPANY as any);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Google Login Failed',
        text2: 'Please try again',
      });
    }
  }, [dispatch, router]);

  const handleLogin = async () => {
    try {
      const res = await dispatch(loginUserThunk({ email, password }));

      if (!loginUserThunk.fulfilled.match(res)) {
        throw new Error('Invalid credentials');
      }

      dispatch(loginUser(res.payload.data));
      await dispatch(registerUserDevice()).unwrap();

      router.replace(ROUTES.HOME.COMPANY as any);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Invalid email or password',
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B66FF]">
      <StatusBar barStyle="light-content" backgroundColor="#0B66FF" translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 px-6"
      >
        {/* LOGO*/}
        <View className="items-center pt-6">
          <Image
            source={images.logoFusion}
            style={{ width: 150, height: 70, resizeMode: 'contain' }}
          />
          <Text className="text-xl font-bold tracking-widest text-white">FUSION</Text>
        </View>

        {/* Card */}
        <View className="flex-1 justify-center">
          <View className="rounded-3xl bg-gray-100 p-6 shadow-lg">
            <Text className="mb-6 text-center text-2xl font-bold">Sign in</Text>

            {/* Email */}
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3"
            />

            {/* Password */}
            <View className="relative mb-2">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!show}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12"
              />
              <TouchableOpacity onPress={() => setShow(!show)} className="absolute right-3 top-3">
                <Ionicons name={show ? 'eye-off' : 'eye'} size={20} />
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <View className="mb-4 items-end">
              <TouchableOpacity onPress={() => router.push(ROUTES.AUTH.REQUIRE_EMAIL as any)}>
                <Text className="text-sm text-[#0B66FF]">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login */}
            <TouchableOpacity onPress={handleLogin} className="mb-4 rounded-full bg-[#0B66FF] py-3">
              <Text className="text-center font-semibold text-white">Log In</Text>
            </TouchableOpacity>

            {/* OR */}
            <View className="my-3 flex-row items-center">
              <View className="h-px flex-1 bg-gray-300" />
              <Text className="mx-3 text-gray-400">OR</Text>
              <View className="h-px flex-1 bg-gray-300" />
            </View>

            {/* Google */}
            <TouchableOpacity
              onPress={handleGoogleLogin}
              className="mb-4 flex-row items-center justify-center rounded-lg border border-gray-200 bg-white py-3"
            >
              <Image source={images.google} className="mr-3 h-5 w-5" />
              <Text className="font-medium text-gray-700">Sign in with Google</Text>
            </TouchableOpacity>

            {/* Register */}
            <View className="items-center">
              <Text className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Text
                  className="font-semibold text-[#0B66FF]"
                  onPress={() => router.push(ROUTES.AUTH.REGISTER as any)}
                >
                  Register
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
