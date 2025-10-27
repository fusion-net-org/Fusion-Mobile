import CalendarHeaderNavbar from '@/components/calendar-layout/calendar-header-navbar';
import AlertHeader from '@/components/layouts/alert-header';
import { ROUTES } from '@/routes/route';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { mockTasks } from '../../../constants/data/task';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // đánh dấu các ngày có task
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    mockTasks.forEach((task) => {
      marks[task.dueDate] = {
        marked: true,
        dots: [{ color: '#2563EB' }],
      };
    });
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: '#2563EB',
      };
    }
    return marks;
  }, [selectedDate]);

  // lọc task theo ngày
  const tasksForDay = selectedDate ? mockTasks.filter((t) => t.dueDate === selectedDate) : [];

  const renderTask = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: ROUTES.TASK.CALENDAR_TASK as any, params: { id: item.id } })
      }
      className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <Text className="text-base font-semibold text-gray-900">{item.title}</Text>
      <Text className="text-sm text-gray-500">{item.description}</Text>
      <View className="mt-1 flex-row items-center justify-between">
        <Text
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            item.priority === 'High'
              ? 'bg-red-100 text-red-600'
              : item.priority === 'Medium'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-green-100 text-green-600'
          }`}
        >
          {item.priority}
        </Text>
        <Text className="text-xs text-gray-400">{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <AlertHeader />
      <View className="flex-1 bg-gray-50">
        <CalendarHeaderNavbar />

        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {/* 📅 Lịch chiếm phần lớn màn hình */}
          <View className="min-h-[325px] flex-1 rounded-2xl bg-white p-3 shadow-sm">
            <Calendar
              onDayPress={(day) =>
                setSelectedDate((prev) => (prev === day.dateString ? null : day.dateString))
              }
              markedDates={markedDates}
              theme={{
                selectedDayBackgroundColor: '#2563EB',
                todayTextColor: '#2563EB',
                arrowColor: '#2563EB',
                textDayFontSize: 18,
                textMonthFontSize: 22,
                textMonthFontWeight: 'bold',
              }}
              style={{
                flex: 1, // ✅ ép giãn toàn bộ trong View cha
                borderRadius: 12,
                justifyContent: 'center',
              }}
            />
          </View>

          {/* 📋 Task list chỉ hiện khi có chọn ngày */}
          {selectedDate && (
            <View className="mt-6">
              <Text className="mb-3 text-lg font-semibold text-gray-800">
                Tasks on {dayjs(selectedDate).format('DD/MM/YYYY')}
              </Text>

              {tasksForDay.length === 0 ? (
                <Text className="text-center text-gray-500">No tasks for this day.</Text>
              ) : (
                <FlatList
                  data={tasksForDay}
                  keyExtractor={(item) => item.id}
                  renderItem={renderTask}
                  scrollEnabled={false} // không tách scroll khỏi scrollview chính
                  contentContainerStyle={{ paddingBottom: 60 }}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
