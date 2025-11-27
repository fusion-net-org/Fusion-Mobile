import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

const Tickets = () => {
  const { id: companyId } = useLocalSearchParams();

  return (
    <View>
      <Text>Tickets</Text>
      <Text>{companyId}</Text>
    </View>
  );
};

export default Tickets;
