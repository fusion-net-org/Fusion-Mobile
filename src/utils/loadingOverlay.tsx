import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading, message }) => {
  if (!loading) return null;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/40">
      <ActivityIndicator size="large" color="#fff" />
      {message && <Text className="mt-2 text-white">{message}</Text>}
    </View>
  );
};

export default LoadingOverlay;
