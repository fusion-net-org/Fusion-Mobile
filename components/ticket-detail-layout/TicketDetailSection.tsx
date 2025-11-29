import { useDebounce } from '@/hooks/Debounce';
import { GetProjectByProjectId } from '@/src/services/projectService';
import {
  CreateComment,
  DeleteComment,
  GetCommentsByTicketId,
} from '@/src/services/ticketCommentService';
import { GetTicketById } from '@/src/services/ticketService';
import { getUserById } from '@/src/services/userService';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import dayjs from 'dayjs';
import {
  AlertTriangle,
  Banknote,
  Calendar,
  Code,
  FileText,
  Flag,
  Layers,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  StickyNote,
  Trash2,
  User,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from 'react-native-paper';

interface TicketDetailSectionProps {
  id: string;
  backRoute?: string;
}

export default function TicketDetailSection({ id, backRoute }: TicketDetailSectionProps) {
  const ticketId = id;
  const [ticket, setTicket] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const debounced = useDebounce(searchKey, 500);

  const tabBarHeight = useBottomTabBarHeight();

  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  useEffect(() => {
    if (ticket?.projectId) loadProject();
    if (ticket?.submittedBy) loadUser();
  }, [ticket]);

  useEffect(() => {
    loadComments();
  }, [debounced]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#EF4444';
      case 'Medium':
        return '#FBBF24';
      case 'Low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return '#10B981';
      case 'InProgress':
        return '#F59E0B';
      case 'OnHold':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'OnHold':
        return 'bg-red-500';
      case 'InProgress':
        return 'bg-orange-400';
      case 'Completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-400';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getUrgencyBadgeColor = (isHighestUrgent: boolean) => {
    return isHighestUrgent ? 'bg-red-500' : 'bg-yellow-400';
  };

  const loadTicket = async () => {
    try {
      const res = await GetTicketById(ticketId as string);
      setTicket(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadProject = async () => {
    const res = await GetProjectByProjectId(ticket.projectId);
    setProject(res.data);
  };

  const loadUser = async () => {
    const res = await getUserById(ticket.submittedBy);
    setUser(res.data);
  };

  const loadComments = async () => {
    const res = await GetCommentsByTicketId(ticketId as string, debounced, '', '', '', 1, 999);
    setComments(res.data.items);
  };

  const handleCreate = async () => {
    if (!newComment.trim()) return;

    await CreateComment({
      ticketId,
      body: newComment,
    });

    setNewComment('');
    loadComments();
  };

  const handleDelete = async (commentId: string) => {
    try {
      await DeleteComment(commentId);
      loadComments();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading || !ticket)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
    >
      {/* HEADER */}
      <View className="mb-2 flex-row items-center gap-2">
        <MessageSquare size={24} color="#6366f1" />
        <Text className="text-2xl font-bold text-gray-800">Ticket Detail</Text>
      </View>

      {/* TICKET CARD */}
      <View className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow">
        <View className="mb-3 flex-row items-center space-x-2">
          <StickyNote size={20} color="#3B82F6" />
          <Text className="ml-2 text-xl font-semibold text-gray-900">{ticket.ticketName}</Text>
        </View>
        {/* Ticket info card */}
        <View className="rounded-2xl bg-white p-4 shadow">
          {[
            {
              icon: <Calendar size={20} color="#3B82F6" />,
              label: 'Created',
              value: dayjs(ticket.createdAt).format('DD/MM/YYYY'),
            },
            {
              icon: <Calendar size={20} color="#3B82F6" />,
              label: 'Updated',
              value: ticket.updatedAt ? dayjs(ticket.updatedAt).format('DD/MM/YYYY') : '-',
            },
            ticket.budget != null &&
              ticket.isBillable && {
                icon: <Banknote size={20} color="#FBBF24" />,
                label: 'Budget',
                value: `${ticket.budget} VND`,
              },
            {
              icon: <AlertTriangle size={20} color="#EF4444" />,
              label: 'Urgency',
              value: ticket.isHighestUrgent ? 'High' : 'Low',
              isBadge: true,
              badgeColor: getUrgencyBadgeColor(ticket.isHighestUrgent),
            },
            {
              icon: <Flag size={20} color={getPriorityColor(ticket.priority)} />,
              label: 'Priority',
              value: ticket.priority,
              badgeColor: getPriorityBadgeColor(ticket.priority),
              isBadge: true,
            },
          ]
            .filter(Boolean)
            .map((item, i) => (
              <View key={i} className="mb-3 flex-row items-center justify-between">
                {/* Left: icon + label */}
                <View className="flex-row items-center space-x-2">
                  {item.icon}
                  <Text className="ml-3 text-base font-semibold text-gray-700">{item.label}</Text>
                </View>

                {/* Right: value / badge */}
                {item.isBadge && item.badgeColor ? (
                  <View className={`${item.badgeColor} rounded-full px-4 py-1`}>
                    <Text className="text-base font-bold text-white">{item.value}</Text>
                  </View>
                ) : (
                  <Text className="text-base font-bold text-gray-900">{item.value}</Text>
                )}
              </View>
            ))}
        </View>
      </View>

      {/* PROJECT INFO */}
      <View className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow">
        <View className="mb-2 flex-row items-center gap-2">
          <Layers size={20} color="#6366f1" />
          <Text className="text-lg font-semibold">Project Info</Text>
        </View>

        <View className="rounded-2xl bg-white p-4 shadow">
          {[
            {
              icon: <FileText size={20} color="#3B82F6" />,
              label: 'Name',
              value: project?.name ?? '-',
            },
            {
              icon: <Code size={20} color="#3B82F6" />,
              label: 'Code',
              value: project?.code ?? '-',
            },
            {
              icon: <Flag size={20} color="#3B82F6" />,
              label: 'Status',
              value: project?.status ?? '-',
              isBadge: true,
              badgeColor: getStatusBadgeColor(project?.status),
            },
            project?.description && {
              icon: <FileText size={20} color="#3B82F6" />,
              label: 'Description',
              value: project.description,
            },
          ]
            .filter(Boolean)
            .map((item, i) => (
              <View key={i} className="mb-3 flex-row items-center justify-between">
                {/* Left: icon + label */}
                <View className="flex-row items-center space-x-2">
                  {item.icon}
                  <Text className="ml-3 text-base font-semibold text-gray-700">{item.label}</Text>
                </View>

                {/* Right: value / badge */}
                {item.isBadge ? (
                  <View className={`${item.badgeColor} rounded-full px-4 py-1`}>
                    <Text className="text-base font-bold text-white">{item.value}</Text>
                  </View>
                ) : (
                  <Text className="text-base font-bold text-gray-900">{item.value}</Text>
                )}
              </View>
            ))}
        </View>
      </View>

      {/* SUBMITTED BY */}
      <View className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow">
        <View className="mb-2 flex-row items-center gap-2">
          <User size={20} color="#6366f1" />
          <Text className="text-lg font-semibold">Submitted By</Text>
        </View>

        <View className="flex-row gap-4">
          <Avatar.Image size={70} source={{ uri: user?.avatar }} />
          <View className="ml-3 flex-1">
            <Text className="text-lg font-bold">{user?.userName}</Text>
            <Text className="text-gray-500">Ticket Submitter</Text>

            <View className="mt-2 gap-1">
              <Text className="text-gray-700">
                <Phone size={14} /> {user?.phone ?? '-'}
              </Text>

              <Text className="text-gray-700">
                <Mail size={14} /> {user?.email}
              </Text>

              <Text className="text-gray-700">
                <MapPin size={14} /> {user?.address ?? 'Unknown'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* COMMENTS */}
      <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow">
        <Text className="mb-3 text-lg font-semibold">Comments</Text>

        {/* SEARCH */}
        <TextInput
          value={searchKey}
          onChangeText={setSearchKey}
          placeholder="Search comments..."
          className="mb-3 rounded-xl border p-3 text-sm"
        />

        {/* COMMENT LIST */}
        {comments.length === 0 ? (
          <View className="mt-5 items-center justify-center">
            <Text className="text-4xl">📭</Text>
            <Text className="mt-2 text-lg font-semibold text-gray-700">No Comments Found</Text>
            <Text className="text-gray-500">Be the first to comment on this ticket.</Text>
          </View>
        ) : (
          comments
            .slice(0, visibleCount)
            .filter((c) => c.isDeleted === true)
            .sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())
            .map((c) => (
              <View
                key={c.id}
                className="mb-2 flex-row gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
              >
                <Avatar.Image size={40} source={{ uri: c.authorUserAvatar }} />

                <View className="flex-1">
                  <Text className="font-bold">{c.authorUserName}</Text>
                  <Text className="text-xs text-gray-500">
                    {dayjs(c.createAt).format('DD/MM/YYYY HH:mm')}
                  </Text>
                  <Text className="mt-1 text-gray-700">{c.body}</Text>
                </View>

                {c.isOwner && (
                  <TouchableOpacity onPress={() => handleDelete(c.id)}>
                    <Trash2 size={18} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))
        )}

        {visibleCount < comments.length && (
          <TouchableOpacity
            onPress={() => setVisibleCount((prev) => prev + 5)}
            className="mt-2 rounded-xl bg-gray-200 p-2"
          >
            <Text className="text-center text-gray-700">
              Load More ({comments.length - visibleCount} remaining)
            </Text>
          </TouchableOpacity>
        )}

        {/* ADD COMMENT */}
        <View className="mt-4 gap-2">
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
            className="rounded-xl border p-3 text-sm"
          />
          <TouchableOpacity onPress={handleCreate} className="rounded-xl bg-indigo-600 py-2">
            <Text className="text-center font-semibold text-white">Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
