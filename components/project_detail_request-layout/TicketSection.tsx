import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Calendar, Eye, RotateCcw, Search, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import DatePickerSection from '@/components/layouts/datepickersection';
import type { Ticket, TicketResponse } from '@/interfaces/ticket';
import { ROUTES } from '@/routes/route';
import { router } from 'expo-router';
import { GetTicketByProjectId } from '../../src/services/ticketService';

const TicketSection = ({ projectId }: { projectId: string }) => {
  const navigation = useNavigation();

  const [ticketsResponse, setTicketsResponse] = useState<TicketResponse | null>(null);
  const [ticketSearch, setTicketSearch] = useState('');
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [ticketPriority, setTicketPriority] = useState('');

  const [ticketPage, setTicketPage] = useState(1);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const rowsPerPage = 10;

  // --- FETCH API ---
  const fetchTickets = async (page = 1) => {
    const res: TicketResponse = await GetTicketByProjectId(
      projectId,
      ticketSearch,
      ticketPriority,
      '',
      '',
      '',
      '',
      '',
      '',
      fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : '',
      toDate ? dayjs(toDate).format('YYYY-MM-DD') : '',
      page,
      rowsPerPage,
      '',
      null,
    );

    if (res?.succeeded) {
      if (page === 1) setTicketsResponse(res);
      else {
        setTicketsResponse((prev) =>
          prev
            ? { ...prev, data: { ...prev.data, items: [...prev.data.items, ...res.data.items] } }
            : res,
        );
      }
    }
  };

  useEffect(() => {
    if (projectId) fetchTickets(1);
  }, [projectId, ticketSearch, ticketPriority, fromDate, toDate]);

  const tickets: Ticket[] = ticketsResponse?.data?.items || [];

  const goToDetail = (ticket: Ticket) => {
    router.push(`${ROUTES.TICKET.DETAIL}/${ticket.id}` as any);
  };

  const loadMore = () => {
    if (tickets.length < (ticketsResponse?.data?.totalCount || 0)) {
      const next = ticketPage + 1;
      setTicketPage(next);
      fetchTickets(next);
    }
  };

  return (
    <View className="flex-1 bg-white p-3">
      {/* TITLE */}
      <Text className="mb-4 text-xl font-semibold text-gray-700">Project Tickets</Text>

      {/* SEARCH + FILTER */}
      <View className="relative mb-3 flex-row items-center gap-2">
        {/* SEARCH */}
        <View className="flex-1">
          <TextInput
            mode="outlined"
            placeholder="Search title..."
            value={ticketSearch}
            onChangeText={(text) => {
              setTicketSearch(text);
              setTicketPage(1);
            }}
            left={<TextInput.Icon icon={() => <Search size={18} color="#9ca3af" />} />}
            style={{
              height: 38,
              fontSize: 12,
              backgroundColor: '#f3f4f6',
              borderRadius: 999,
            }}
            outlineStyle={{
              borderRadius: 999,
              borderColor: '#e5e7eb',
            }}
            contentStyle={{
              paddingVertical: 0,
              paddingLeft: 0,
            }}
            theme={{
              roundness: 999,
            }}
          />
        </View>

        {/* FILTER BUTTON */}
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          onPress={() => setShowPriorityMenu((prev) => !prev)}
        >
          <SlidersHorizontal size={20} color="#4F46E5" />
        </TouchableOpacity>

        {/* RESET BUTTON */}
        <TouchableOpacity
          className="h-10 items-center justify-center rounded-full bg-gray-100 px-3"
          onPress={() => {
            setTicketSearch('');
            setTicketPriority('');
            setFromDate(null);
            setToDate(null);
            setTicketPage(1);
            fetchTickets(1);
          }}
        >
          <RotateCcw size={20} color="#4B5563" />
        </TouchableOpacity>

        {/* PRIORITY MENU */}
        {showPriorityMenu && (
          <View className="absolute right-12 top-12 z-50 w-32 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
            {['High', 'Medium', 'Low', ''].map((p) => (
              <TouchableOpacity
                key={p}
                className="rounded-lg p-2"
                onPress={() => {
                  setTicketPriority(p);
                  setShowPriorityMenu(false);
                  setTicketPage(1);
                }}
              >
                <Text className="text-gray-700">{p === '' ? 'All Priority' : p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* CALENDAR */}
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          onPress={() => setShowFromPicker(true)}
        >
          <Calendar size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* EMPTY STATE */}
      {tickets.length === 0 && (
        <View className="mt-10 items-center justify-center">
          <Text className="text-4xl">📭</Text>
          <Text className="mt-2 text-lg font-semibold text-gray-700">No Tickets Found</Text>
          <Text className="text-gray-500">Try adjusting your search or filters.</Text>
        </View>
      )}

      {/* DATE RANGE LABEL */}
      {(fromDate || toDate) && (
        <Text className="mb-2 text-sm text-gray-600">
          {fromDate ? dayjs(fromDate).format('DD/MM/YYYY') : '...'} →{' '}
          {toDate ? dayjs(toDate).format('DD/MM/YYYY') : '...'}
        </Text>
      )}

      {/* LIST */}
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToDetail(item)}
            className="mb-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-800">{item.ticketName}</Text>
              <Eye size={22} color="#4F46E5" />
            </View>

            <Text className="mt-1 text-gray-600">Assignee: {item.submittedByName}</Text>

            <Text
              className={`mt-2 self-start rounded-full px-3 py-1 text-xs font-bold ${
                item.priority === 'High'
                  ? 'bg-red-100 text-red-700'
                  : item.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {item.priority}
            </Text>

            <Text className="mt-2 text-gray-500">
              Created: {item.createdAt ? dayjs(item.createdAt).format('DD/MM/YYYY') : '-'}
            </Text>

            <Text
              className={`mt-2 font-semibold ${item.isDeleted ? 'text-red-500' : 'text-green-600'}`}
            >
              {item.isDeleted ? 'Deleted' : 'Active'}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* FROM DATE PICKER */}
      <DatePickerSection
        visible={showFromPicker}
        title="Select From Date"
        initialDate={fromDate || new Date()}
        onClose={() => setShowFromPicker(false)}
        onSelect={(date) => {
          setFromDate(date);
          setShowToPicker(true);
        }}
      />

      {/* TO DATE PICKER */}
      <DatePickerSection
        visible={showToPicker}
        title="Select To Date"
        initialDate={toDate || new Date()}
        onClose={() => setShowToPicker(false)}
        onSelect={(date) => setToDate(date)}
      />
    </View>
  );
};

export default TicketSection;
