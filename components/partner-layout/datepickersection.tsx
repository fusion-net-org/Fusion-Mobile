import { FontAwesome5 } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-ui-datepicker';

interface DatePickerModalProps {
  visible: boolean;
  title?: string;
  initialDate?: Date | null;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

export default function DatePickerSection({
  visible,
  title = 'Select Date',
  initialDate = new Date(),
  onClose,
  onSelect,
}: DatePickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className="w-11/12 rounded-2xl bg-white p-4 shadow-lg">
          {/* Header */}
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-700">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times" size={18} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          <DatePicker
            mode="single"
            date={dayjs(initialDate || new Date())}
            onChange={(params) => {
              const selectedDate = dayjs(params.date).toDate();
              onSelect(selectedDate);
              onClose();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
