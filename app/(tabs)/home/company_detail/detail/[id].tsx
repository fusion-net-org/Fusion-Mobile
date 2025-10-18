import { useLocalSearchParams } from 'expo-router';

import { StatusBar, Text, View } from 'react-native';

const CompanyDetail = () => {
  const { id } = useLocalSearchParams();
  return (
    <>
      <StatusBar hidden />
      <View>
        <Text>Company ID: {id}</Text>
      </View>
    </>
  );
};

export default CompanyDetail;
