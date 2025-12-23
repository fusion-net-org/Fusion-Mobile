import { AppDispatch } from '@/src/redux/store';
import { registerUserDevice } from '@/src/redux/userDeviceSlice';
import { loginUser, registerUserThunk } from '@/src/redux/userSlice';
import { loginGoogle } from '@/src/services/authService';
import { webClientId } from '@/src/utils/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Checkbox from 'expo-checkbox';
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
import { images } from '../../../constants/image/image';
import { ROUTES } from '../../../routes/route';

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch<AppDispatch>();

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
      console.log(userInfo);
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('Google ID token not found');
      }
      const data = await loginGoogle({ token: idToken });
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

  const handleRegister = async () => {
    setError('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the terms and privacy policy.');
      return;
    }

    try {
      const resultAction = await dispatch(
        registerUserThunk({ firstName, lastName, email, password, confirmPassword }),
      );

      if (registerUserThunk.fulfilled.match(resultAction)) {
        console.log('Register success:', resultAction.payload);
        router.replace(ROUTES.AUTH.LOGIN as any);
      } else {
        setError(resultAction.payload as string);
      }
    } catch (err: any) {
      setError(err.message || 'Register failed');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B66FF]">
      <StatusBar barStyle="light-content" backgroundColor="#0B66FF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 px-6"
      >
        {/* Logo */}
        <View className="flex-row items-center justify-center pt-6">
          <Image
            source={images.logoFusion}
            style={{ width: 32, height: 32, resizeMode: 'contain' }}
          />
          <Text className="ml-0.5 text-xl font-bold tracking-widest text-white">FUSION</Text>
        </View>

        {/* Register Card */}
        <View className="flex-1 justify-center pt-6">
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
            <Text className="mb-6 text-center text-2xl font-bold text-gray-900">Sign Up</Text>

            {/* First Name */}
            <Text className="mb-2 text-sm text-gray-500">First Name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              placeholderTextColor="#9AA8DB"
              className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm"
            />

            {/* Last Name */}
            <Text className="mb-2 text-sm text-gray-500">Last Name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              placeholderTextColor="#9AA8DB"
              className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm"
            />

            {/* Email */}
            <Text className="mb-2 text-sm text-gray-500">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
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
                placeholder="Password"
                placeholderTextColor="#9AA8DB"
                secureTextEntry={!show}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 shadow-sm"
              />
              <TouchableOpacity
                onPress={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 pt-7"
              >
                <Ionicons name={show ? 'eye-off' : 'eye'} size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View className="relative mb-4">
              <Text className="mb-2 text-sm text-gray-500">Confirm Password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor="#9AA8DB"
                secureTextEntry={!showConfirm}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 shadow-sm"
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 pt-7"
              >
                <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Terms and Conditions */}
            <View className="mb-5 flex-row items-start pt-2">
              <Checkbox
                value={agreeTerms}
                onValueChange={setAgreeTerms}
                color={agreeTerms ? '#0B66FF' : undefined}
              />
              <Text className="ml-2 flex-1 text-xs text-gray-500">
                By creating an account you agree to the{' '}
                <Text className="text-[#0B66FF]">terms of use</Text> and{' '}
                <Text className="text-[#0B66FF]">privacy policy</Text>.
              </Text>
            </View>

            {/* Hiển thị lỗi */}
            {error ? <Text className="mb-2 text-sm text-red-500">{error}</Text> : null}

            {/* Button Register */}
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={!agreeTerms}
              onPress={handleRegister}
              className={`mb-5 rounded-full py-3 shadow-md shadow-[#0B66FF]/40 ${
                agreeTerms ? 'bg-[#0B66FF]' : 'bg-gray-300'
              }`}
            >
              <Text className="text-center text-base font-semibold text-white">Create Account</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="mb-4 flex-row items-center justify-center">
              <View className="mr-3 h-px flex-1 bg-gray-200" />
              <Text className="text-sm text-gray-400">Or</Text>
              <View className="ml-3 h-px flex-1 bg-gray-200" />
            </View>

            {/* Google Sign-up */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleGoogleLogin}
              className="mb-2 flex-row items-center justify-center rounded-lg border border-gray-200 bg-white py-3 shadow-sm"
            >
              <Image className="mr-3 h-5 w-5" resizeMode="contain" source={images.google} />
              <Text className="font-medium text-gray-700">Sign up with Google</Text>
            </TouchableOpacity>

            {/* Already have account */}
            <View className="mt-3 items-center">
              <Text className="text-sm text-gray-600">
                Already have an account?{' '}
                <Text
                  className="font-semibold text-[#0B66FF]"
                  onPress={() => router.push(ROUTES.AUTH.LOGIN as any)}
                >
                  Log in
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
