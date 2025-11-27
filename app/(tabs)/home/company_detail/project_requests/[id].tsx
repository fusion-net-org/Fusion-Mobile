import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

const ProjectRequest = () => {
  const { id: companyId } = useLocalSearchParams();

  return (
    <View>
      <Text>ProjectRequest</Text>
      <Text>{companyId}</Text>
    </View>
  );
};

export default ProjectRequest;
