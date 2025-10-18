import { useLocalSearchParams } from 'expo-router';

import { StatusBar, Text, View } from 'react-native';

const Partners = () => {
  const { id } = useLocalSearchParams();
  return (
    <>
      <StatusBar hidden />
      <View>
        <Text>Company ID for Partners: {id}</Text>
      </View>
    </>
  );
};

export default Partners;
