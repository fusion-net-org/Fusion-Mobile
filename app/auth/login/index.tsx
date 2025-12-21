import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
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
import { auth, webClientId } from '@/src/utils/firebaseConfig';

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

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      if (!idToken) {
        throw new Error('Google ID token not found');
      }

      // Firebase login
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);

      const firebaseToken = await result.user.getIdToken();
      const data = await loginGoogle({ token: firebaseToken });

      dispatch(loginUser(data));
      await dispatch(registerUserDevice()).unwrap();

      router.replace(ROUTES.HOME.COMPANY as any);
    } catch (err) {
      console.error('Google login error:', err);
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
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 px-6"
      >
        {/* Logo */}
        <View className="items-center pt-6">
          <Image source={images.logoFusion} style={{ width: 120, height: 36 }} />
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
              className="mb-4 rounded-xl border bg-white px-4 py-3"
            />

            {/* Password */}
            <View className="relative mb-4">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!show}
                className="rounded-xl border bg-white px-4 py-3 pr-12"
              />
              <TouchableOpacity onPress={() => setShow(!show)} className="absolute right-3 top-3">
                <Ionicons name={show ? 'eye-off' : 'eye'} size={20} />
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
              className="flex-row items-center justify-center rounded-lg border bg-white py-3"
            >
              <Image source={images.google} className="mr-3 h-5 w-5" />
              <Text className="font-medium text-gray-700">Sign in with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
