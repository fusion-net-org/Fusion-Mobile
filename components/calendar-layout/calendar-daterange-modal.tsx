import { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import DatePickerSection from '../layouts/datepickersection';

interface Props {
  visible: boolean;
  initialFrom?: Date;
  initialTo?: Date;
  onClose: () => void;
  onApply: (from: Date, to: Date) => void;
}

const CalendarDateRangeModal = ({ visible, initialFrom, initialTo, onClose, onApply }: Props) => {
  const [from, setFrom] = useState<Date>(initialFrom || new Date());
  const [to, setTo] = useState<Date>(initialTo || new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // Reset khi modal mở
  useEffect(() => {
    if (visible) {
      setFrom(initialFrom || new Date());
      setTo(initialTo || new Date());
    }
  }, [visible, initialFrom, initialTo]);

  const handleCancel = () => {
    setFrom(initialFrom || new Date());
    setTo(initialTo || new Date());
    onClose();
  };

  const handleApply = () => {
    onApply(from, to);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center bg-black/50 px-4">
        <View className="rounded-lg bg-white p-4">
          <Text className="mb-4 text-lg font-semibold">Select Date Range</Text>

          {/* From Date */}
          <TouchableOpacity
            className="mb-3 rounded-lg border border-gray-300 px-4 py-2"
            onPress={() => setShowFromPicker(true)}
          >
            <Text>From: {from.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {/* To Date */}
          <TouchableOpacity
            className="mb-3 rounded-lg border border-gray-300 px-4 py-2"
            onPress={() => setShowToPicker(true)}
          >
            <Text>To: {to.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <View className="mt-4 flex-row justify-end space-x-2">
            <TouchableOpacity onPress={handleCancel} className="rounded-lg bg-gray-200 px-4 py-2">
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply} className="rounded-lg bg-blue-600 px-4 py-2">
              <Text className="font-semibold text-white">Apply</Text>
            </TouchableOpacity>
          </View>

          {/* DatePickerSection cho From */}
          <DatePickerSection
            visible={showFromPicker}
            title="Select Start Date"
            initialDate={from}
            onClose={() => setShowFromPicker(false)}
            onSelect={(date: any) => setFrom(date)}
          />

          {/* DatePickerSection cho To */}
          <DatePickerSection
            visible={showToPicker}
            title="Select End Date"
            initialDate={to}
            onClose={() => setShowToPicker(false)}
            onSelect={(date: any) => setTo(date)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CalendarDateRangeModal;
