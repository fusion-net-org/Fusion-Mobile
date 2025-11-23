import { FilterItem } from '@/interfaces/base';
import { useRef, useState } from 'react';
import {
  findNodeHandle,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

interface FilterDropdownSquareProps {
  label: string;
  items: FilterItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void; // cho phép reset
}

export default function FilterDropdownSquare({
  label,
  items,
  selectedId,
  onSelect,
}: FilterDropdownSquareProps) {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const headerRef = useRef<View>(null);

  const openDropdown = () => {
    if (headerRef.current) {
      const handle = findNodeHandle(headerRef.current);
      if (handle) {
        UIManager.measureInWindow(handle, (x, y, width, height) => {
          setDropdownPos({ x, y, width, height });
          setOpen(true);
        });
      }
    }
  };

  return (
    <View ref={headerRef} className="mr-2 flex-1">
      {/* Header */}
      <TouchableOpacity
        onPress={openDropdown}
        className="flex-row items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm"
      >
        <Text className="text-base font-medium text-gray-800">
          {selectedId ? items.find((i) => i.id === selectedId)?.name : label}
        </Text>
        <Text className="ml-2 text-gray-400">{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal transparent visible={open} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/20"
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View
            className="absolute rounded-xl bg-white p-2 shadow-lg"
            style={{
              top: dropdownPos.y + dropdownPos.height + 4,
              left: dropdownPos.x,
              width: dropdownPos.width,
              maxHeight: 300,
            }}
          >
            {/* Options */}
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item.id);
                    setOpen(false);
                  }}
                  className={`my-1 rounded-lg px-4 py-2 ${
                    selectedId === item.id ? 'bg-blue-600 shadow-md' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`${selectedId === item.id ? 'text-white' : 'text-gray-800'} text-sm font-medium`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
