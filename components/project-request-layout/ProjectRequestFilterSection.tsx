import { ProjectRequestFilter } from '@/interfaces/project_request';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import DateFilterDropdownPartner from './DateFilterDropdownPartner';

interface Props {
  onFilterChange: (filter: Partial<ProjectRequestFilter>) => void;
}
export default function ProjectRequestFilterSection({ onFilterChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Accepted' | 'Rejected' | 'Finished' | 'All'>(
    'All',
  );
  const [viewMode, setViewModel] = useState<'Both' | 'Requester' | 'Executor'>('Both');

  const height = useSharedValue(0);
  const contentHeight = useRef(0);

  const toggleOpen = () => {
    if (isOpen) {
      // 👉 Đang mở → đóng lại, reset filter về mặc định
      setIsOpen(false);
      height.value = withTiming(0, { duration: 250 });

      // reset dữ liệu filter
      setKeyword('');
      setStatus('All');
      setViewModel('Both');
      onFilterChange({
        keyword: '',
        status: 'All',
        viewMode: 'Both',
        dateFilterType: 'All',
        dateRange: undefined,
      });
    } else {
      // 👉 Đang đóng → mở ra
      setIsOpen(true);
      height.value = withTiming(contentHeight.current, { duration: 250 });

      // đảm bảo khi mở lại nút "All" và "Both" hiển thị xanh
      setStatus('All');
      setViewModel('Both');
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden',
  }));

  // Khi thay đổi filter → trigger callback
  useEffect(() => {
    onFilterChange({ keyword, status, viewMode });
  }, [keyword, status, viewMode]);

  return (
    <View className="px-4 pt-3">
      {/* Header filter (click để mở rộng) */}
      <TouchableOpacity
        onPress={toggleOpen}
        className="flex-row items-center justify-between rounded-xl bg-gray-100 px-4 py-2"
      >
        <Text className="font-semibold text-gray-700">Filter</Text>
        <FontAwesome5 name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#555" />
      </TouchableOpacity>

      <Animated.View style={animatedStyle}>
        {/* Hidden view để đo chiều cao */}
        <View
          className="absolute left-0 right-0 opacity-0"
          onLayout={(e) => {
            contentHeight.current = e.nativeEvent.layout.height + 20;
          }}
        >
          <FilterContent
            keyword={keyword}
            setKeyword={setKeyword}
            status={status}
            setStatus={setStatus}
            side={viewMode}
            setSide={setViewModel}
            isOpen={isOpen} // ✅ truyền đúng ở đây
            onFilterChange={onFilterChange}
          />
        </View>

        <FilterContent
          keyword={keyword}
          setKeyword={setKeyword}
          status={status}
          setStatus={setStatus}
          side={viewMode}
          setSide={setViewModel}
          isOpen={isOpen} // ✅ truyền đúng ở đây
          onFilterChange={onFilterChange}
        />
      </Animated.View>
    </View>
  );
}

function FilterContent({
  keyword,
  setKeyword,
  status,
  setStatus,
  side,
  setSide,
  isOpen, // 👈 thêm dòng này
  onFilterChange,
}: {
  keyword: string;
  setKeyword: (v: string) => void;
  status: string;
  setStatus: (v: any) => void;
  side: string;
  setSide: (v: any) => void;
  isOpen: boolean;

  onFilterChange: (filter: any) => void;
}) {
  return (
    <View className="pt-5">
      {/* Search input */}
      <Text className="mb-1 text-xs text-gray-500">Search Business name / ID Business</Text>
      <TextInput
        placeholder="Search..."
        value={keyword}
        onChangeText={setKeyword}
        className="mb-4 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
      />

      {/* 🗓 Date Filter */}
      <DateFilterDropdownPartner
        resetTrigger={!isOpen} // mỗi lần đóng sẽ reset dropdown
        onChange={(data) => {
          onFilterChange({
            dateFilterType: data.dateFilterType,
            dateRange: data.dateRange,
          });
        }}
      />

      {/* Status + Side */}
      <View className="flex-row justify-between">
        {/* Status */}
        <View className="mr-2 min-w-[48%] flex-1">
          <Text className="mb-1 text-xs text-gray-500">Status</Text>
          <View className="flex-row flex-wrap">
            {['All', 'Pending', 'Accepted', 'Rejected', 'Finished'].map((item) => {
              const active = status === item;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setStatus(item as any)}
                  className={`mb-2 mr-2 rounded-full border px-3 py-1 ${
                    active ? 'border-blue-400 bg-blue-100' : 'border-gray-300 bg-white'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      active ? 'font-semibold text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Side */}
        <View className="ml-2 min-w-[48%] flex-1">
          <Text className="mb-1 text-xs text-gray-500">Side</Text>
          <View className="flex-row flex-wrap">
            {['Both', 'Requester', 'Executor'].map((item) => {
              const active = side === item;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setSide(item as any)}
                  className={`mb-2 mr-2 rounded-full border px-3 py-1 ${
                    active ? 'border-blue-400 bg-blue-100' : 'border-gray-300 bg-white'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      active ? 'font-semibold text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
