import { CompanyFilter } from '@/interfaces/company';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface Props {
  onFilterChange: (filter: Partial<CompanyFilter>) => void;
}

export default function FilterSection({ onFilterChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | undefined>(undefined);
  const [sortColumn, setSortColumn] = useState('');
  const [relationship, setRelationship] = useState<'All' | 'Owner' | 'Member'>('All');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [totalProject, setTotalProject] = useState('');
  const [totalMember, setTotalMember] = useState('');

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

  // 🧠 Hàm gọi search
  const triggerSearch = (order: 'ASC' | 'DESC' | undefined = sortOrder) => {
    onFilterChange({
      sortColumn,
      sortOrder: order,
      totalProject: totalProject ? Number(totalProject) : undefined,
      totalMember: totalMember ? Number(totalMember) : undefined,
      relationship,
    });
  };

  const handleSort = (order: 'ASC' | 'DESC') => {
    if (order === sortOrder) {
      setSortOrder(undefined);
      triggerSearch(undefined);
      return; // ⛔ Không gọi API nữa
    }
    setSortOrder(order);
    triggerSearch(order);
  };

  // Khi chọn relationship → gọi search luôn
  useEffect(() => {
    triggerSearch();
  }, [relationship]);

  return (
    <View className="mt-3 px-4">
      <TouchableOpacity
        onPress={toggleOpen}
        className="flex-row items-center justify-between rounded-xl bg-gray-100 px-4 py-2"
      >
        <Text className="font-semibold text-gray-700">Filter</Text>
        <FontAwesome5 name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#555" />
      </TouchableOpacity>

      <Animated.View style={animatedStyle}>
        <View
          className="absolute left-0 right-0 opacity-0"
          onLayout={(e) => {
            contentHeight.current = e.nativeEvent.layout.height + 20;
          }}
        >
          <FilterContent
            sortOrder={sortOrder}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            totalProject={totalProject}
            setTotalProject={setTotalProject}
            totalMember={totalMember}
            setTotalMember={setTotalMember}
            relationship={relationship}
            setRelationship={setRelationship}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            handleSort={handleSort}
          />
        </View>

        <FilterContent
          sortOrder={sortOrder}
          sortColumn={sortColumn}
          setSortColumn={setSortColumn}
          totalProject={totalProject}
          setTotalProject={setTotalProject}
          totalMember={totalMember}
          setTotalMember={setTotalMember}
          relationship={relationship}
          setRelationship={setRelationship}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
          handleSort={handleSort}
        />
      </Animated.View>
    </View>
  );
}

function FilterContent({
  sortOrder,
  sortColumn,
  setSortColumn,
  totalProject,
  setTotalProject,
  totalMember,
  setTotalMember,
  relationship,
  setRelationship,
  selectedRoles,
  setSelectedRoles,
  handleSort,
}: any) {
  return (
    <View className="pt-7">
      {/* Sort Column + Inputs */}
      <View className="mb-4">
        <Text className="mb-1 text-xs text-gray-500">Sort Column</Text>
        <TextInput
          value={sortColumn}
          onChangeText={setSortColumn}
          placeholder="Enter column name"
          className="mb-2 rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
        />

        <View className="flex-row">
          <View className="mr-2 flex-1">
            <Text className="mb-1 text-xs text-gray-500">Total Project</Text>
            <TextInput
              value={totalProject}
              onChangeText={setTotalProject}
              keyboardType="numeric"
              placeholder="Ex: 10"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
            />
          </View>

          <View className="flex-1">
            <Text className="mb-1 text-xs text-gray-500">Total Member</Text>
            <TextInput
              value={totalMember}
              onChangeText={setTotalMember}
              keyboardType="numeric"
              placeholder="Ex: 50"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
            />
          </View>
        </View>

        {/* ASC / DESC */}
        <View className="mt-3 flex-row justify-end space-x-3">
          <TouchableOpacity
            onPress={() => handleSort('ASC')}
            className={`rounded-full border px-4 py-1 ${
              sortOrder === 'ASC' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                sortOrder === 'ASC' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              ASC
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSort('DESC')}
            className={`rounded-full border px-4 py-1 ${
              sortOrder === 'DESC' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                sortOrder === 'DESC' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              DESC
            </Text>
          </TouchableOpacity>
        </View>
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
