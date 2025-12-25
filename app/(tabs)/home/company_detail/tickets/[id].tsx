import { useDebounce } from '@/hooks/Debounce';
import { TicketItem } from '@/interfaces/ticket';
import { ROUTES } from '@/routes/route';
import { GetProjectsByCompany, GetTicketPaged } from '@/src/services/ticketService';
import { formatLocalDate } from '@/src/utils/formatLocalDate';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { FilterIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Project {
  id: string;
  name: string;
}

const Tickets: React.FC = () => {
  const { id: companyId } = useLocalSearchParams();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    'All' | 'Pending' | 'Accepted' | 'Rejected' | 'Finished'
  >('All');
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedSearch = useDebounce(searchKeyword, 500);

  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const [filterVisible, setFilterVisible] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'AsRequester' | 'AsExecutor'>('AsRequester');

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await GetProjectsByCompany(companyId as string, '', '');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const fetchTickets = async (pageNumber: number = 1, append: boolean = false) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const params: any = {
        keyword: debouncedSearch || '',
        projectId: selectedProjectId || null,
        status: filterStatus === 'All' ? null : filterStatus,
        viewMode,
        pageNumber,
        pageSize: 10,
        companyRequestId: viewMode === 'AsRequester' ? companyId : null,
        companyExecutorId: viewMode === 'AsExecutor' ? companyId : null,
      };

      const res = await GetTicketPaged(params);

      const items = res.pageData.items || [];
      setTotalCount(res.pageData.totalCount || 0);

      if (append) {
        setTickets((prev) => [...prev, ...items]);
      } else {
        setTickets(items);
      }
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const resetFilter = () => {
    setSelectedProjectId(null);
    setFilterStatus('All');
    fetchTickets(1, false);
  };

  const applyFilter = () => {
    fetchTickets(1, false);
    setFilterVisible(false);
  };

  const handleLoadMore = () => {
    if (loadingMore || tickets.length >= totalCount) return;
    fetchTickets(page + 1, true);
  };

  const goToDetail = (ticket: TicketItem) => {
    router.push(`${ROUTES.TICKET.DETAIL}/${ticket.id}` as any);
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchTickets(1, false);
  }, [debouncedSearch, selectedProjectId, filterStatus, viewMode, companyId]);

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Header & Search */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold">Tickets</Text>
        <TouchableOpacity
          className="rounded-lg bg-blue-600 px-4 py-2"
          onPress={() => setFilterVisible(true)}
        >
          <FilterIcon className="h-6 w-6 text-black" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <TextInput
        placeholder="Search tickets..."
        className="mb-4 rounded-xl border border-gray-300 bg-white px-3 py-2"
        value={searchKeyword}
        onChangeText={setSearchKeyword}
      />

      {/* View Mode Tabs */}
      <View className="mb-4 flex-row space-x-2">
        <TouchableOpacity
          className={`flex-1 items-center rounded-full py-2 ${viewMode === 'AsRequester' ? 'bg-blue-600' : 'bg-gray-200'}`}
          onPress={() => setViewMode('AsRequester')}
        >
          <Text
            className={`font-medium ${viewMode === 'AsRequester' ? 'text-white' : 'text-gray-700'}`}
          >
            My Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center rounded-full py-2 ${viewMode === 'AsExecutor' ? 'bg-purple-600' : 'bg-gray-200'}`}
          onPress={() => setViewMode('AsExecutor')}
        >
          <Text
            className={`font-medium ${viewMode === 'AsExecutor' ? 'text-white' : 'text-gray-700'}`}
          >
            Requests To Me
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tickets List */}
      {loading && pageNumber === 1 ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => {
            const priorityColor =
              item.priority === 'Urgent'
                ? 'text-red-600'
                : item.priority === 'High'
                  ? 'text-orange-500'
                  : item.priority === 'Medium'
                    ? 'text-yellow-500'
                    : item.priority === 'Low'
                      ? 'text-green-600'
                      : 'text-gray-800';

            const statusColor =
              item.status === 'Pending'
                ? 'text-yellow-500'
                : item.status === 'Accepted'
                  ? 'text-blue-500'
                  : item.status === 'Rejected'
                    ? 'text-red-500'
                    : item.status === 'Finished'
                      ? 'text-green-500'
                      : 'text-gray-400';

            return (
              <TouchableOpacity
                onPress={() => goToDetail(item)}
                className="mb-3 flex-row items-start rounded-2xl bg-white px-4 py-3 shadow-sm"
              >
                <View
                  className={`mr-3 rounded-full p-2 ${
                    item.priority === 'Urgent'
                      ? 'bg-red-100'
                      : item.priority === 'High'
                        ? 'bg-orange-100'
                        : item.priority === 'Medium'
                          ? 'bg-yellow-100'
                          : item.priority === 'Low'
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                  }`}
                >
                  <Ionicons
                    name={
                      item.priority === 'Urgent'
                        ? 'alert-circle'
                        : item.priority === 'High'
                          ? 'alert-circle'
                          : item.priority === 'Medium'
                            ? 'checkmark-circle'
                            : item.priority === 'Low'
                              ? 'checkmark-circle'
                              : 'help-circle'
                    }
                    size={20}
                    className={
                      item.priority === 'Urgent'
                        ? 'text-red-600'
                        : item.priority === 'High'
                          ? 'text-orange-500'
                          : item.priority === 'Medium'
                            ? 'text-yellow-500'
                            : item.priority === 'Low'
                              ? 'text-green-600'
                              : 'text-gray-800'
                    }
                  />
                </View>

                <View className="flex-1">
                  <Text className="mb-1 text-base font-semibold text-gray-900" numberOfLines={1}>
                    {item.ticketName}
                  </Text>

                  <Text className="mb-2 text-sm text-gray-500" numberOfLines={1}>
                    {item.projectName}
                  </Text>

                  <View className="flex-row items-center justify-between gap-2">
                    {/* Date */}
                    <Text className="flex-1 text-xs text-gray-400">
                      {item.createdAt
                        ? `${formatLocalDate(item.createdAt)} → ${
                            item.closedAt
                              ? formatLocalDate(item.closedAt)
                              : item.resolvedAt
                                ? formatLocalDate(item.resolvedAt)
                                : item.updatedAt
                                  ? formatLocalDate(item.updatedAt)
                                  : 'N/A'
                          }`
                        : 'N/A'}
                    </Text>

                    {/* Priority + Status */}
                    <View className="flex-row items-center gap-2">
                      {/* Priority Badge */}
                      <View
                        className={`rounded-full px-2 py-1 ${
                          item.priority === 'Urgent'
                            ? 'bg-red-100'
                            : item.priority === 'High'
                              ? 'bg-orange-100'
                              : item.priority === 'Medium'
                                ? 'bg-yellow-100'
                                : item.priority === 'Low'
                                  ? 'bg-green-100'
                                  : 'bg-gray-100'
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            item.priority === 'Urgent'
                              ? 'text-red-600'
                              : item.priority === 'High'
                                ? 'text-orange-500'
                                : item.priority === 'Medium'
                                  ? 'text-yellow-500'
                                  : item.priority === 'Low'
                                    ? 'text-green-600'
                                    : 'text-gray-800'
                          }`}
                        >
                          {item.priority}
                        </Text>
                      </View>

                      {/* Status */}
                      <Text
                        className={`text-xs font-semibold ${
                          item.status === 'Pending'
                            ? 'text-yellow-500'
                            : item.status === 'Accepted'
                              ? 'text-blue-500'
                              : item.status === 'Rejected'
                                ? 'text-red-500'
                                : item.status === 'Finished'
                                  ? 'text-green-500'
                                  : 'text-gray-400'
                        }`}
                      >
                        {item.status || 'Unknown'}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row flex-wrap items-center gap-4 pt-1">
                    <Text className="pt-1 text-xs text-gray-500">Budget: {item.budget ?? 0}$</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#3b82f6" /> : null
          }
        />
      )}

      {/* Filter Modal */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/30">
          <View className="rounded-t-2xl bg-white p-4 shadow-lg">
            {/* Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <Ionicons name="funnel" size={24} color="#3b82f6" />
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <Ionicons name="close" size={24} color="#3b82f6" />
              </TouchableOpacity>
            </View>

            {/* Project Dropdown */}
            <View className="mb-4">
              <Text className="mb-1 font-semibold">Project</Text>
              <TouchableOpacity
                className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2"
                onPress={() => setShowProjectDropdown(!showProjectDropdown)}
              >
                <Text className={`${selectedProjectId ? 'text-black' : 'text-gray-400'}`}>
                  {selectedProjectId
                    ? projects.find((p) => p.id === selectedProjectId)?.name
                    : 'All'}
                </Text>
                <Ionicons
                  name={showProjectDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#3b82f6"
                />
              </TouchableOpacity>

              {showProjectDropdown && (
                <ScrollView
                  style={{
                    marginTop: 4,
                    maxHeight: 200,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                  }}
                  nestedScrollEnabled
                >
                  <TouchableOpacity
                    style={{ paddingVertical: 8, paddingHorizontal: 12 }}
                    onPress={() => {
                      setSelectedProjectId(null);
                      setShowProjectDropdown(false);
                    }}
                  >
                    <Text>All</Text>
                  </TouchableOpacity>

                  {projects.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={{ paddingVertical: 8, paddingHorizontal: 12 }}
                      onPress={() => {
                        setSelectedProjectId(p.id);
                        setShowProjectDropdown(false);
                      }}
                    >
                      <Text>{p.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Status Dropdown */}
            <View className="mb-4">
              <Text className="mb-1 font-semibold">Status</Text>
              <TouchableOpacity
                className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2"
                onPress={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <Text className={`${filterStatus !== 'All' ? 'text-black' : 'text-gray-400'}`}>
                  {filterStatus}
                </Text>
                <Ionicons
                  name={showStatusDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#3b82f6"
                />
              </TouchableOpacity>

              {showStatusDropdown && (
                <ScrollView
                  style={{
                    marginTop: 4,
                    maxHeight: 200,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                  }}
                  nestedScrollEnabled
                >
                  {['All', 'Pending', 'Accepted', 'Rejected', 'Finished'].map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={{ paddingVertical: 8, paddingHorizontal: 12 }}
                      onPress={() => {
                        setFilterStatus(s as any);
                        setShowStatusDropdown(false);
                      }}
                    >
                      <Text>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Buttons */}
            <View className="mt-6 flex-row justify-between">
              <TouchableOpacity className="rounded-lg bg-gray-200 px-6 py-2" onPress={resetFilter}>
                <Text className="font-medium text-gray-700">Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity className="rounded-lg bg-blue-600 px-6 py-2" onPress={applyFilter}>
                <Text className="font-medium text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Tickets;
