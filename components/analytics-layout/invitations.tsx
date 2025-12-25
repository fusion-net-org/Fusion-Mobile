import { useDebounce } from '@/hooks/Debounce';
import { setUserCompanies } from '@/src/redux/userSlice';
import { getAllCompanies } from '@/src/services/companyServices';
import {
  AcceptJoinMemberById,
  GetCompanyMemberByUserId,
  RejectJoinMemberById,
} from '@/src/services/memberService';
import { Calendar, Clock, MapPin, Phone, User } from 'lucide-react-native';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { useDispatch } from 'react-redux';

const Invitation = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [viewGrid, setViewGrid] = useState(false);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Active' | 'Inactive'>(
    'All',
  );
  const [loading, setLoading] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalItems, setTotalItems] = useState(0);

  const dispatch = useDispatch();

  const fetchMembers = async (page: number = 1, size: number = pageSize) => {
    try {
      setLoading(true);
      const response = await GetCompanyMemberByUserId(
        debouncedSearchText,
        statusFilter !== 'All' ? statusFilter : null,
        null,
        null,
        null,
        null,
        null,
        null,
        page,
        size,
        'JoinedAt',
        true,
      );
      if (response.statusCode === 200) {
        setMembers(response.data.items);
        setTotalItems(response.data.totalCount);
        setPageNumber(page);
        setPageSize(size);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (memberId: number) => {
    try {
      setLoading(true);
      await AcceptJoinMemberById(memberId);
      fetchMembers(pageNumber);
      const companiesRes = await getAllCompanies();
      if (companiesRes.succeeded) dispatch(setUserCompanies(companiesRes.data.items));
      else dispatch(setUserCompanies([]));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (memberId: number) => {
    try {
      setLoading(true);
      await RejectJoinMemberById(memberId);
      fetchMembers(pageNumber);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(1);
  }, [debouncedSearchText, statusFilter]);

  const getStatusTag = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Text className="font-bold text-green-600">Accepted</Text>;
      case 'inactive':
        return <Text className="font-bold text-red-600">Rejected</Text>;
      default:
        return <Text className="font-bold text-orange-500">Pending</Text>;
    }
  };

  const renderActionButton = (status: string, memberId: number) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'pending') {
      return (
        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="rounded bg-blue-600 px-3 py-1"
            onPress={() => handleAccept(memberId)}
          >
            <Text className="text-white">Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded bg-red-600 px-3 py-1"
            onPress={() => handleReject(memberId)}
          >
            <Text className="text-white">Reject</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (lowerStatus === 'active') {
      return (
        <View className="rounded bg-green-600 px-3 py-1">
          <Text className="text-white">Active</Text>
        </View>
      );
    } else if (lowerStatus === 'inactive') {
      return (
        <View className="rounded bg-red-600 px-3 py-1">
          <Text className="text-white">Inactive</Text>
        </View>
      );
    }
    return null;
  };

  const renderMemberCard = ({ item }: { item: any }) => (
    <View className="mb-3 rounded-xl bg-white p-3 shadow">
      <View className="mb-2 flex-row items-center">
        <Avatar
          source={item.companyAvatar ? { uri: item.companyAvatar } : undefined}
          size={64}
          title={item.companyName?.[0]}
        />
        <View className="ml-3 flex-1">
          <Text className="truncate text-lg font-bold">{item.companyName}</Text>
          {getStatusTag(item.status)}
        </View>
      </View>

      <View className="mb-2 space-y-1">
        <Text className="flex-row items-center">
          <User size={14} /> Owner: {item.companyOwner}
        </Text>
        <Text className="flex-row items-center">
          <Phone size={14} /> Phone: {item.companyPhone}
        </Text>
        <Text className="flex-row items-center">
          <MapPin size={14} /> Address: {item.companyAddress || '--'}
        </Text>
        <Text className="flex-row items-center">
          <Calendar size={14} /> Created: {moment(item.companyCreateAt).format('DD/MM/YYYY')}
        </Text>
        <Text className="flex-row items-center">
          <Clock size={14} /> Joined:{' '}
          {!item.memberJoinAt || item.memberJoinAt.startsWith('0001')
            ? '--'
            : moment(item.memberJoinAt).format('DD/MM/YYYY')}
        </Text>
      </View>

      <View className="mb-2 flex-row flex-wrap space-x-1 space-y-1">
        {item.roles?.length > 0 ? (
          item.roles.map((role: string, i: number) => (
            <View key={i} className="rounded bg-gray-300 px-2 py-0.5">
              <Text className="text-xs">{role}</Text>
            </View>
          ))
        ) : (
          <View className="rounded bg-gray-200 px-2 py-0.5">
            <Text className="text-xs">None</Text>
          </View>
        )}
      </View>

      <View>{renderActionButton(item.status, item.id)}</View>
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-gray-100 p-3"
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
    >
      {/* Search */}
      <TextInput
        placeholder="Search company name, email, phone..."
        value={searchText}
        onChangeText={setSearchText}
        className="mb-3 rounded bg-white p-2"
      />

      {/* Status filter */}
      <View className="mb-3 flex-row space-x-2">
        {['All', 'Pending', 'Active', 'Inactive'].map((status) => (
          <TouchableOpacity
            key={status}
            className={`rounded px-3 py-1 ${statusFilter === status ? 'bg-blue-600' : 'bg-gray-300'}`}
            onPress={() => setStatusFilter(status as any)}
          >
            <Text className={statusFilter === status ? 'text-white' : 'text-black'}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#1890ff" className="my-5" />}

      {/* Members */}
      <View className={viewGrid ? 'flex-row flex-wrap justify-between' : ''}>
        {members.map((item) => (
          <View key={item.id} className={`mb-3 ${viewGrid ? 'w-[48%]' : 'w-full'}`}>
            {renderMemberCard({ item })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Invitation;
