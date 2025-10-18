import { useLocalSearchParams } from 'expo-router';

import { StatusBar, Text, View } from 'react-native';

const WorkFlows = () => {
  const { id } = useLocalSearchParams();
  return (
    <>
      <StatusBar hidden />
      <View>
        <Text>Company ID for WorkFlows: {id}</Text>
      </View>
    </>
  );
};

export default WorkFlows;
