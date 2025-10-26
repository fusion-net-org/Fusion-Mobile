import { passwordComponent } from '@/constants/data/password';
import { passwordImage } from '@/constants/image/image';
import { changePasswordService } from '@/src/services/userService';
import { password_field } from '@/types/password/password';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
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

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState<Record<password_field, boolean>>({
    current: false,
    newPass: false,
    confirm: false,
  });

  const [captcha, setCaptcha] = useState('');
  const [inputCaptcha, setInputCaptcha] = useState('');

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const generateCaptcha = () => {
    const text = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(text);
  };

  const onSubmit = async (data: any) => {
    if (inputCaptcha.toUpperCase() !== captcha) {
      Alert.alert('Captcha incorrect', 'Please enter the correct captcha.');
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      Alert.alert('Password mismatch', 'New password and confirm password do not match.');
      return;
    }

    try {
      const response = await changePasswordService({
        confirmPassword: data.confirmPassword,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Password changed successfully 🎉',
          text2: 'Your password has been updated.',
          position: 'top',
        });
        reset();
        generateCaptcha();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to change password',
          text2: response.message || 'Please try again later.',
          position: 'top',
        });
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  // Generate captcha when mounted
  useState(() => {
    generateCaptcha();
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            className="px-5 pt-6"
            keyboardShouldPersistTaps="handled"
          >
            <View className="mb-6 items-center">
              <Image
                source={passwordImage.changePassword}
                style={{ width: 150, height: 150, resizeMode: 'contain' }}
              />
            </View>
            {passwordComponent.map((item) => (
              <View key={item.name} className="mb-4">
                <Text className="mb-1 text-gray-600">{item.label}</Text>
                <View className="flex-row items-center rounded-lg border border-gray-300 px-3">
                  <FontAwesome5 name={item.icon as any} size={16} color="#2563EB" />
                  <Controller
                    control={control}
                    name={item.name as any}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        className="flex-1 px-3 py-2 text-gray-800"
                        secureTextEntry={!showPassword[item.key as keyof typeof showPassword]}
                        value={value}
                        onChangeText={onChange}
                        placeholder={item.label}
                      />
                    )}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        [item.key as password_field]: !prev[item.key as password_field],
                      }))
                    }
                  >
                    <FontAwesome5
                      name={
                        showPassword[item.key as keyof typeof showPassword] ? 'eye' : 'eye-slash'
                      }
                      size={16}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Captcha */}
            <View className="mb-4 mt-3">
              <Text className="mb-1 text-gray-600">Captcha</Text>
              <View className="flex-row items-center justify-between">
                <View className="mr-2 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2">
                  <Text className="text-center text-lg font-bold tracking-widest text-blue-600">
                    {captcha}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={generateCaptcha}
                  className="rounded-lg bg-blue-500 px-3 py-2"
                >
                  <FontAwesome5 name="redo" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <TextInput
                className="mt-3 rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Enter captcha"
                value={inputCaptcha}
                onChangeText={setInputCaptcha}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="mt-6 rounded-xl bg-blue-500 py-3"
            >
              <Text className="text-center text-lg font-semibold text-white">Confirm</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePassword;
