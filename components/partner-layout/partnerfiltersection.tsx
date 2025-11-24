import { formatLocalDate } from '@/src/utils/formatLocalDate';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import DatePickerSection from '../layouts/datepickersection';

export default function PartnerFilterSection({ onFilterChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<'from' | 'to' | null>(null);

  const height = useSharedValue(0);
  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      height.value = withTiming(next ? 180 : 0, { duration: 250 });
      if (!next) setShowDatePicker(null);
      return next;
    });
  };
  const animatedStyle = useAnimatedStyle(() => ({ height: height.value, overflow: 'hidden' }));

  useEffect(() => {
    onFilterChange({
      keyword: search,
      status,
      fromDate: dateFrom ? formatLocalDate(dateFrom) : null,
      toDate: dateTo ? formatLocalDate(dateTo) : null,
    });
  }, [search, status, dateFrom, dateTo]);

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
        <View className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {/* Search */}
          <View className="mb-3">
            <Text className="mb-1 text-xs text-gray-500">Search Company / Owner / Status</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Type keyword..."
              // onBlur={triggerFilter}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
            />
          </View>

          {/* Date Range */}
          <View className="mb-3 flex-row items-center justify-between">
            <TouchableOpacity
              className="mr-2 flex-1 rounded-lg border border-gray-300 px-3 py-2"
              onPress={() => setShowDatePicker('from')}
            >
              <Text className="text-sm text-gray-600">
                {dateFrom ? dateFrom.toLocaleDateString() : 'Date From'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
              onPress={() => setShowDatePicker('to')}
            >
              <Text className="text-sm text-gray-600">
                {dateTo ? dateTo.toLocaleDateString() : 'Date To'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Date picker modal */}
      <DatePickerSection
        visible={!!showDatePicker}
        title={showDatePicker === 'from' ? 'Select Start Date' : 'Select End Date'}
        initialDate={showDatePicker === 'from' ? dateFrom : dateTo}
        onClose={() => setShowDatePicker(null)}
        onSelect={(selected) => {
          if (showDatePicker === 'from') setDateFrom(selected);
          else setDateTo(selected);
          setShowDatePicker(null);
        }}
      />
    </View>
  );
}
