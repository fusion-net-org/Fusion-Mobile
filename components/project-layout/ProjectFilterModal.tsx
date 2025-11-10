import { ProjectFilter } from '@/interfaces/project';
import { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: ProjectFilter) => void;
  onReset: () => void;
}

export default function ProjectFilterModal({ visible, onClose, onApply, onReset }: Props) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'recent' | 'start' | 'name'>('recent');

  const [status, setStatus] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const toggle = (list: string[], setter: any, item: string) => {
    if (list.includes(item)) setter(list.filter((x) => x !== item));
    else setter([...list, item]);
  };

  const apply = () => {
    onApply({
      search,
      sort,
      status,
      types,
    });
    onClose();
  };

  const reset = () => {
    setSearch('');
    setSort('recent');
    setStatus([]);
    setTypes([]);
    onReset();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[85%] rounded-t-3xl bg-white p-5">
          <Text className="mb-3 text-lg font-bold text-gray-800">Filter Projects</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Search */}
            <View className="mb-4">
              <Text className="mb-1 text-sm text-gray-600">Search</Text>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search project name..."
                className="rounded-xl border border-gray-300 px-3 py-2 text-gray-700"
              />
            </View>

            {/* Sort */}
            <View className="mb-4">
              <Text className="mb-2 text-sm text-gray-600">Sort by</Text>
              <View className="flex-row flex-wrap">
                {[
                  { label: 'Recent', value: 'recent' },
                  { label: 'Start date', value: 'start' },
                  { label: 'Name A → Z', value: 'name' },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setSort(opt.value as any)}
                    className={`mb-2 mr-2 rounded-full border px-4 py-2 ${
                      sort === opt.value
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        sort === opt.value ? 'font-semibold text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status */}
            <View className="mb-4">
              <Text className="mb-2 text-sm text-gray-600">Status</Text>
              <View className="flex-row flex-wrap">
                {['Planned', 'InProgress', 'OnHold', 'Completed'].map((item) => {
                  const selected = status.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => toggle(status, setStatus, item)}
                      className={`mb-2 mr-2 rounded-full border px-4 py-2 ${
                        selected ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <Text
                        className={`text-[12px] ${
                          selected ? 'font-semibold text-green-600' : 'text-gray-600'
                        }`}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Types */}
            <View className="mb-4">
              <Text className="mb-2 text-sm text-gray-600">Types</Text>
              <View className="flex-row flex-wrap">
                {['Internal', 'Outsourced'].map((item) => {
                  const selected = types.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => toggle(types, setTypes, item)}
                      className={`mb-2 mr-2 rounded-full border px-4 py-2 ${
                        selected ? 'border-orange-500 bg-orange-100' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          selected ? 'font-semibold text-orange-600' : 'text-gray-600'
                        }`}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Bottom buttons */}
          <View className="mt-3 flex-row justify-between">
            <TouchableOpacity onPress={reset} className="rounded-xl bg-gray-200 px-4 py-3">
              <Text className="font-semibold text-gray-700">Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={apply} className="rounded-xl bg-blue-600 px-6 py-3">
              <Text className="font-semibold text-white">Apply</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} className="rounded-xl bg-gray-100 px-4 py-3">
              <Text className="font-semibold text-gray-600">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
