import { FontAwesome5 } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function FilterSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [sortAZ, setSortAZ] = useState(true);
  const [sortColumn, setSortColumn] = useState('');
  const [relationship, setRelationship] = useState<'All' | 'Owner' | 'Member'>('All');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const height = useSharedValue(0);
  const contentHeight = useRef(0);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    height.value = withTiming(isOpen ? 0 : contentHeight.current, { duration: 250 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden',
  }));

  return (
    <View className="mt-3 px-4">
      {/* Header filter */}
      <TouchableOpacity
        onPress={toggleOpen}
        className="flex-row items-center justify-between rounded-xl bg-gray-100 px-4 py-2"
      >
        <Text className="font-semibold text-gray-700">Filter</Text>
        <FontAwesome5 name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#555" />
      </TouchableOpacity>

      {/* Animated container */}
      <Animated.View style={animatedStyle}>
        {/* Hidden measuring view */}
        <View
          className="absolute left-0 right-0 opacity-0"
          onLayout={(e) => {
            contentHeight.current = e.nativeEvent.layout.height + 20;
          }}
        >
          <FilterContent
            sortAZ={sortAZ}
            setSortAZ={setSortAZ}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            relationship={relationship}
            setRelationship={setRelationship}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
          />
        </View>

        {/* Actual visible content */}
        <FilterContent
          sortAZ={sortAZ}
          setSortAZ={setSortAZ}
          sortColumn={sortColumn}
          setSortColumn={setSortColumn}
          relationship={relationship}
          setRelationship={setRelationship}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
        />
      </Animated.View>
    </View>
  );
}

function FilterContent({
  sortAZ,
  setSortAZ,
  sortColumn,
  setSortColumn,
  relationship,
  setRelationship,
  selectedRoles,
  setSelectedRoles,
}: any) {
  return (
    <View className="pt-7">
      {/* Sort */}
      <View className="flex-row items-center justify-between pb-4 pr-2">
        {/* Sort Column Input */}
        <View className="mr-3 flex-1">
          <Text className="mb-1 text-xs text-gray-500">Sort Column</Text>
          <TextInput
            value={sortColumn}
            onChangeText={setSortColumn}
            placeholder="Enter column name"
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
          />
        </View>

        {/* ASC/DESC Toggle */}
        <TouchableOpacity
          onPress={() => setSortAZ((prev: any) => !prev)}
          className="flex-row items-center justify-end"
        >
          <FontAwesome5 name="sort" size={14} color="#555" className="pt-6" />
          <Text className="ml-2 pt-6 text-sm text-gray-600">Sort: {sortAZ ? 'ASC' : 'DESC'}</Text>
        </TouchableOpacity>
      </View>

      {/* Relationship */}
      <View className="mb-4">
        <Text className="mb-2 font-medium text-gray-600">Relationship:</Text>
        <View className="flex-row">
          {['All', 'Owner', 'Member'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setRelationship(item as any)}
              className={`mr-2 rounded-full border px-4 py-2 ${
                relationship === item ? 'border-blue-400 bg-blue-100' : 'border-gray-300 bg-white'
              }`}
            >
              <Text
                className={`text-sm ${
                  relationship === item ? 'font-semibold text-blue-600' : 'text-gray-600'
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Role */}
      <View className="mb-3">
        <Text className="mb-2 font-medium text-gray-600">Role:</Text>
        <View className="flex-row flex-wrap">
          {['Product Manager', 'Teamlead', 'Dev'].map((tag) => {
            const selected = selectedRoles.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                onPress={() =>
                  setSelectedRoles((prev: any) =>
                    selected ? prev.filter((r: any) => r !== tag) : [...prev, tag],
                  )
                }
                className={`mb-2 mr-2 rounded-full border px-3 py-1 ${
                  selected ? 'border-orange-400 bg-orange-50' : 'border-gray-300 bg-white'
                }`}
              >
                <Text
                  className={`text-sm ${
                    selected ? 'font-medium text-orange-600' : 'text-gray-600'
                  }`}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
