import { useDebounce } from '@/hooks/Debounce';
import { Search } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';
import { getProjectMemberByProjectId } from '../../src/services/projectMemberService';

interface Props {
  projectId: string;
  rowsPerPage?: number;
}

const MembersSection: React.FC<Props> = ({ projectId, rowsPerPage = 10 }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMembers = useCallback(
    async (pageNumber: number, loadMore = false) => {
      if (!loadMore) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await getProjectMemberByProjectId(
          projectId,
          debouncedSearch,
          '',
          '',
          pageNumber,
          rowsPerPage,
        );

        if (res?.succeeded) {
          if (loadMore) setMembers((prev) => [...prev, ...res.data.items]);
          else setMembers(res.data.items);

          setTotalCount(res.data.totalCount);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [projectId, debouncedSearch],
  );

  useEffect(() => {
    setPage(1);
    fetchMembers(1);
  }, [debouncedSearch]);

  const loadMore = () => {
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    if (page >= totalPages || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMembers(nextPage, true);
  };

  const renderItem = ({ item }: any) => (
    <View className="mx-2 mb-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <Text className="font-semibold text-gray-800">{item.userName}</Text>
      <Text className="text-sm text-gray-600">{item.email}</Text>
      <Text className="text-sm text-gray-600">{item.phone || '-'}</Text>
      <Text className="mt-1 text-xs text-gray-500">
        Joined: {new Date(item.joinedAt).toLocaleDateString('vi-VN')}
      </Text>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Search */}
      <View className="flex-row items-center gap-2 p-3">
        <Search size={20} color="#6b7280" />
        <TextInput
          placeholder="Search by name, email, phone..."
          value={search}
          onChangeText={(t) => setSearch(t)}
          className="flex-1 rounded-lg bg-gray-100  px-3 py-2"
        />
      </View>

      {/* List */}
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={members}
          renderItem={renderItem}
          keyExtractor={(item) => item.userId.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#4f46e5" style={{ marginVertical: 10 }} />
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

export default MembersSection;
