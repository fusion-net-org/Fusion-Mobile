import { useLocalSearchParams } from 'expo-router';

import { Text, View } from 'react-native';

const Members = () => {
  const { id } = useLocalSearchParams();

  return (
    <>
      <View>
        <Text>Company ID for Members: {id}</Text>
      </View>
    </>
  );
};

export default Members;
