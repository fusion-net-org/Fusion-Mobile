import { useLocalSearchParams } from 'expo-router';

import { StatusBar, Text, View } from 'react-native';

const Projects = () => {
  const { id } = useLocalSearchParams();
  return (
    <>
      <StatusBar hidden />
      <View>
        <Text>Company ID for Projects: {id}</Text>
      </View>
    </>
  );
};

export default Projects;
