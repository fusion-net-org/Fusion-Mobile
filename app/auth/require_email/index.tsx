import { passwordImage } from '@/constants/image/image';
import { requestPasswordReset } from '@/src/services/authService';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const RequireEmail = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Toast.show({ type: 'error', text1: 'Please enter your email.' });
      return;
    }

    try {
      setLoading(true);
      const res = await requestPasswordReset(email);
      console.log(res);

      if (res.data && res.succeeded) {
        Toast.show({
          type: 'success',
          text1: 'Email sent successfully!',
          text2: 'Please check your inbox for the reset link.',
        });
        // router.push('/verify-code');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to send email.',
          text2: res.message || 'Please try again later.',
        });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -150} // 👈 tùy chỉnh khoảng cách
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 300 }}>
            <View className="flex-1 bg-white px-6">
              {/* Header */}
              <View className="mt-1 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-3 rounded-full p-2">
                  <FontAwesome5 name="arrow-left" size={18} color="#1E3A8A" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-gray-800">Forget password</Text>
              </View>

              {/* Nội dung chính */}
              <View className="mt-6 flex-1 bg-white px-2">
                {/* Illustration */}
                <Image
                  source={passwordImage.requireEmail}
                  className="mb-10 mt-20 h-80 w-full self-center"
                  resizeMode="contain"
                />

                {/* Title */}
                <Text className="mb-2 mt-4 text-center text-xl font-semibold text-gray-900">
                  Forget password
                </Text>

                {/* Subtitle */}
                <Text className="mb-6 text-center text-gray-500">
                  Please enter your email address to receive a verification code
                </Text>

                {/* Email input */}
                <TextInput
                  className="mb-4 h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800"
                  placeholder="Email Address"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />

                {/* Send Code button */}
                <TouchableOpacity
                  onPress={handleSendCode}
                  disabled={loading}
                  className={`mb-4 h-12 w-full items-center justify-center rounded-xl ${
                    loading ? 'bg-gray-400' : 'bg-blue-500'
                  }`}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-base font-semibold text-white">Send code</Text>
                  )}
                </TouchableOpacity>

                {/* Try another way */}
                <TouchableOpacity>
                  <Text className="text-center text-sm text-gray-500 underline">
                    Try another way
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RequireEmail;
