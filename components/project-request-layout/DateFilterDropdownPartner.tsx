import { DateRange } from '@/types/date/date';
import { FontAwesome5 } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DatePickerSection from '../layouts/datepickersection'; // đúng path nhé

interface Props {
  onChange: (data: {
    dateFilterType: 'Created' | 'Start - End' | 'Approved' | 'Rejected' | 'Pending' | 'All';
    dateRange: DateRange;
  }) => void;
  resetTrigger?: boolean;
}

const DateFilterDropdownPartner = ({ onChange, resetTrigger }: Props) => {
  const [selectedType, setSelectedType] = useState<
    'All' | 'Created' | 'Start - End' | 'Approved' | 'Rejected' | 'Pending'
  >('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({});

  const options = ['All', 'Created', 'Start - End', 'Approved', 'Rejected', 'Pending'];

  useEffect(() => {
    if (resetTrigger) {
      setSelectedType('All');
      setDateRange({});
      onChange({ dateFilterType: 'All', dateRange: {} });
    }
  }, [resetTrigger]);

  const handleSelect = (type: typeof selectedType) => {
    setSelectedType(type);
    setDropdownOpen(false);

    if (type === 'All') {
      setDateRange({});
      onChange({ dateFilterType: type, dateRange: {} });
    } else {
      // mở chọn ngày from
      setShowFromPicker(true);
    }
  };

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to)
      return `(${dayjs(dateRange.from).format('DD/MM')} → ${dayjs(dateRange.to).format('DD/MM/YYYY')})`;
    if (dateRange.from) return `(${dayjs(dateRange.from).format('DD/MM/YYYY')})`;
    return '';
  };

  return (
    <View className="mb-4">
      {/* Button hiển thị trạng thái hiện tại */}
      <TouchableOpacity
        onPress={() => setDropdownOpen(!dropdownOpen)}
        className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2"
      >
        <Text className="text-sm text-gray-700">
          {selectedType} {formatDateRange()}
        </Text>
        <FontAwesome5 name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#555" />
      </TouchableOpacity>

      {/* Dropdown danh sách lựa chọn */}
      {dropdownOpen && (
        <View className="mt-2 rounded-lg border border-gray-200 bg-white shadow-md">
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleSelect(option as any)}
              className={`px-3 py-2 ${selectedType === option ? 'bg-blue-50' : 'bg-white'}`}
            >
              <Text
                className={`text-sm ${
                  selectedType === option ? 'font-semibold text-blue-600' : 'text-gray-700'
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Calendar modal — giữ nguyên logic bạn có */}
      <DatePickerSection
        visible={showFromPicker}
        title={`Select ${selectedType} Date`}
        onClose={() => setShowFromPicker(false)}
        onSelect={(date) => {
          const from = dayjs(date).toISOString();
          setDateRange({ from });
          setShowFromPicker(false);
          setShowToPicker(true);
        }}
      />

      <DatePickerSection
        visible={showToPicker}
        title="Select end date"
        onClose={() => setShowToPicker(false)}
        onSelect={(date) => {
          const to = dayjs(date).toISOString();
          const newRange = { ...dateRange, to };
          setDateRange(newRange);
          setShowToPicker(false);
          onChange({ dateFilterType: selectedType, dateRange: newRange });
        }}
      />
    </View>
  );
};

export default DateFilterDropdownPartner;
