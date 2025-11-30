import DatePickerSection from '@/components/layouts/datepickersection';
import { ProjectRequest } from '@/interfaces/project_request';
import { ROUTES } from '@/routes/route';
import { GetProjectRequestByCompanyId } from '@/src/services/project_requestService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, FileText, Filter, Inbox, X, XCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

type DateFilterType =
  | 'CreatedDate'
  | 'StartEndDate'
  | 'ApprovedDate'
  | 'RejectedDate'
  | 'PendingDate';

const ProjectRequestPage = () => {
  const router = useRouter();
  const { id: companyId } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [data, setData] = useState<ProjectRequest[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'AsRequester' | 'AsExecutor'>('AsRequester');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'All' | string>('All');
  const [selectedDateType, setSelectedDateType] = useState<DateFilterType | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedDateType(null);
    setDateFrom(null);
    setDateTo(null);
    fetchData();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'Finished':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'Rejected':
        return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'Accepted':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const getPTypeStyle = (isRequester?: boolean) => {
    if (isRequester) {
      return {
        label: 'Requester',
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
      };
    }
    return {
      label: 'Executor',
      bg: 'bg-gray-100',
      text: 'text-gray-600',
    };
  };

  enum ProjectRequestStatusEnum {
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
    Finished = 3,
  }

  // Map string dropdown sang enum
  const statusParam: string | null =
    selectedStatus && selectedStatus !== 'All' ? selectedStatus : null;

  // Truyền ViewMode nullable
  const viewModeParam: 'AsRequester' | 'AsExecutor' | null = viewMode || null;

  const fetchData = async (pageNumber: number = 1, append: boolean = false) => {
    if (!companyId) return;
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      console.log(viewModeParam);
      const res = await GetProjectRequestByCompanyId(
        companyId as string,
        searchTerm || null,
        statusParam,
        null,
        null,
        viewModeParam,
        selectedDateType || undefined,
        dateFrom ? dateFrom.toISOString().split('T')[0] : null,
        dateTo ? dateTo.toISOString().split('T')[0] : null,
        pageNumber,
        5,
        'CreateAt',
        false,
      );

      const items = res.items || [];
      setTotalCount(res.totalCount || 0);

      if (append) {
        setData((prev) => [...prev, ...items]);
      } else {
        setData(items);
      }
      setPage(pageNumber);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Something went wrong',
        position: 'top',
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Hàm load more
  const loadMore = () => {
    if (data.length >= totalCount) return;
    fetchData(page + 1, true);
  };

  useEffect(() => {
    fetchData();
  }, [companyId, searchTerm, selectedStatus, selectedDateType, dateFrom, dateTo, viewMode]);

  const renderStatusBadge = (status: string) => {
    const style = getStatusStyle(status);
    return (
      <View className={`rounded-full px-2 py-0.5 ${style.bg}`}>
        <Text className={`text-[10px] font-semibold ${style.text}`}>{status}</Text>
      </View>
    );
  };

  const renderPTypeBadge = (isRequest?: boolean, label?: string) => {
    const style = getPTypeStyle(isRequest);
    return (
      <View className={`rounded-full px-2 py-0.5 ${style.bg}`}>
        <Text className={`text-[10px] font-semibold ${style.text}`}>{label || style.label}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-gray-800">Project Requests</Text>
      </View>

      {/* Search + Filter row */}
      <View className="mb-4 flex-row items-center space-x-2">
        {/* Search input */}
        <TextInput
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2"
          placeholder="Search project/requester/executor..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {/* Filter button */}
        <TouchableOpacity
          className="ml-2 rounded-lg bg-blue-400 px-3 py-2"
          onPress={() => setFilterVisible(true)}
        >
          <Filter className="h-5 w-5 text-white" />
        </TouchableOpacity>
      </View>

      {/* View Mode Tabs */}
      <View className="mb-4 flex-row space-x-2">
        <TouchableOpacity
          className={`flex-1 items-center rounded-full py-2 ${
            viewMode === 'AsRequester' ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          onPress={() => setViewMode('AsRequester')}
        >
          <Text
            className={`font-medium ${viewMode === 'AsRequester' ? 'text-white' : 'text-gray-700'}`}
          >
            My Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center rounded-full py-2 ${
            viewMode === 'AsExecutor' ? 'bg-purple-600' : 'bg-gray-200'
          }`}
          onPress={() => setViewMode('AsExecutor')}
        >
          <Text
            className={`font-medium ${viewMode === 'AsExecutor' ? 'text-white' : 'text-gray-700'}`}
          >
            Requests To Me
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View className="items-center py-10">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}

      {/* Filter Modal */}
      {filterVisible && (
        <View className="absolute left-4 right-4 top-20 z-50 rounded-xl bg-white p-4 shadow">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-semibold text-gray-800">Filter</Text>
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <X className="h-5 w-5 text-gray-600" />
            </TouchableOpacity>
          </View>
          {/* Status */}
          <Text className="mb-1 text-sm text-gray-600">Status</Text>
          <View className="mb-2 flex-row flex-wrap">
            {['Pending', 'Accepted', 'Rejected', 'Finished'].map((s) => (
              <TouchableOpacity
                key={s}
                className={`mb-2 mr-2 rounded-full px-3 py-1 ${
                  selectedStatus === s ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                onPress={() => setSelectedStatus(s)}
              >
                <Text
                  className={`text-xs font-medium ${selectedStatus === s ? 'text-white' : 'text-gray-700'}`}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className={`mb-2 mr-2 rounded-full px-3 py-1 ${
                selectedStatus === 'All' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              onPress={() => setSelectedStatus('All')}
            >
              <Text
                className={`text-xs font-medium ${selectedStatus === 'All' ? 'text-white' : 'text-gray-700'}`}
              >
                All
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="mb-1 text-sm text-gray-600">Date Type</Text>
          <View className="mb-2 flex-row flex-wrap">
            {['CreatedDate', 'StartEndDate', 'ApprovedDate', 'RejectedDate', 'PendingDate'].map(
              (d) => (
                <TouchableOpacity
                  key={d}
                  className={`mb-2 mr-2 rounded-full px-3 py-1 ${
                    selectedDateType === d ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  onPress={() => setSelectedDateType(d as DateFilterType)}
                >
                  <Text
                    className={`text-xs font-medium ${selectedDateType === d ? 'text-white' : 'text-gray-700'}`}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
          {/* Chỉ hiện date pickers khi đã chọn DateType */}
          {selectedDateType && (
            <View className="mb-2 flex-row space-x-2">
              <TouchableOpacity
                className={`flex-1 rounded-lg border px-3 py-2 ${
                  dateFrom ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-100'
                }`}
                onPress={() =>
                  dateFrom !== null || !dateFrom ? setShowFromPicker(true) : setShowFromPicker(true)
                }
              >
                <Text className="text-xs text-gray-700">
                  {dateFrom ? dateFrom.toLocaleDateString() : 'From'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded-lg border px-3 py-2 ${
                  dateTo ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-100'
                }`}
                onPress={() =>
                  dateTo !== null || !dateTo ? setShowToPicker(true) : setShowToPicker(true)
                }
              >
                <Text className="text-xs text-gray-700">
                  {dateTo ? dateTo.toLocaleDateString() : 'To'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {showFromPicker && (
            <DatePickerSection
              visible={showFromPicker}
              title="Select Start Date"
              initialDate={dateFrom || new Date()}
              onClose={() => setShowFromPicker(false)}
              onSelect={(date) => setDateFrom(date)}
            />
          )}
          {showToPicker && (
            <DatePickerSection
              visible={showToPicker}
              title="Select End Date"
              initialDate={dateTo || new Date()}
              onClose={() => setShowToPicker(false)}
              onSelect={(date) => setDateTo(date)}
            />
          )}
          {/* DatePickerSection cho From */}
          <DatePickerSection
            visible={showFromPicker}
            title="Select Start Date"
            initialDate={dateFrom}
            onClose={() => setShowFromPicker(false)}
            onSelect={(date: any) => setDateFrom(date)}
          />
          {/* DatePickerSection cho To */}
          <DatePickerSection
            visible={showToPicker}
            title="Select End Date"
            initialDate={dateTo}
            onClose={() => setShowToPicker(false)}
            onSelect={(date: any) => setDateTo(date)}
          />
          <View className="mt-2 flex-row space-x-4 px-2">
            {/* Reset button */}
            <TouchableOpacity
              className="flex-1 rounded-lg border border-gray-300 py-2"
              onPress={() => {
                resetFilters();
              }}
            >
              <Text className="text-center font-medium text-gray-700">Reset</Text>
            </TouchableOpacity>

            {/* Apply button */}
            <TouchableOpacity
              className="ml-2 flex-1 rounded-lg bg-blue-600 py-2"
              onPress={() => {
                setFilterVisible(false);
                fetchData();
              }}
            >
              <Text className="text-center font-medium text-white">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* List */}
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              router.push({
                pathname: `${ROUTES.PROJECT_REQUEST.DETAIL}/${item.id}` as any,
                params: {
                  projectRequestId: item.id,
                  companyId: companyId,
                },
              });
            }}
            className="mb-3 rounded-xl bg-white p-4 shadow"
          >
            {/* Title row */}
            <View className="mb-1 flex-row items-start justify-between">
              <View className="flex-shrink flex-row items-center space-x-2">
                <Text className="flex-shrink text-sm font-semibold text-gray-800">
                  {item.projectName}
                </Text>
              </View>

              <View className="flex-col items-center space-y-1 pt-2">
                {renderStatusBadge(item.status)}
                <Text
                  className={`text-xs font-medium ${item.isDeleted ? 'text-red-600' : 'text-green-600'}`}
                >
                  {item.isDeleted ? 'Not Active' : 'Active'}
                </Text>
              </View>
            </View>

            {/* Companies */}
            <Text className="mb-0.5 text-xs text-gray-500">
              Requester: {item.requesterCompanyName}
            </Text>
            <Text className="mb-0.5 text-xs text-gray-500">
              Executor: {item.executorCompanyName}
            </Text>

            {/* Dates */}
            <Text className="text-xs text-gray-400">
              {new Date(item.startDate).toLocaleDateString()} -{' '}
              {new Date(item.endDate).toLocaleDateString()}
            </Text>

            {/* Project / Deleted aligned right */}
            <View className="mt-1 flex-row items-center justify-between">
              <View className="flex-row items-center space-x-1">
                {item.isHaveProject ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <Text className="ml-2 text-xs">
                  {item.isHaveProject ? 'Project' : 'No Project'}
                </Text>
              </View>
            </View>

            {/* Contract Buttons */}
            <View className="mt-2 flex-row justify-end space-x-2">
              {item.contractId && (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: `${ROUTES.PROJECT_REQUEST.CONTRACT}/${item.contractId}` as any,
                      params: { id: item.contractId, projectRequestId: item.id },
                    })
                  }
                  className="rounded-full bg-blue-100 px-3 py-1"
                >
                  <FileText className="h-4 w-4 text-blue-600" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <View className="flex-row items-center space-x-2">
                <Inbox className="h-8 w-8 text-gray-400" />
                <Text className="text-sm font-medium text-gray-500">No project requests found</Text>
              </View>
            </View>
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="items-center py-4">
              <ActivityIndicator size="small" color="#3B82F6" />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (!loadingMore && data.length < totalCount) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
};

export default ProjectRequestPage;
