import { MemberRef } from '@/interfaces/task';
import { formatLocalDate } from '@/src/utils/formatLocalDate';
import { useFlashTask } from '@/src/utils/useFlashTask';
import { CalendarDays, Check, Clock, Flag, MoveDown, TimerReset } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const initials = ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
  return <Text className="text-[10px] font-semibold text-slate-700">{initials || '?'}</Text>;
}

function Avatar({ m }: { m: MemberRef }) {
  return (
    <View className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-slate-200 ring-1 ring-white">
      {m.avatarUrl ? (
        <Image source={{ uri: m.avatarUrl }} className="h-full w-full" />
      ) : (
        <Initials name={m.name} />
      )}
    </View>
  );
}

function AvatarGroup({ members }: { members: MemberRef[] }) {
  const shown = (members ?? []).slice(0, 2);
  const more = (members ?? []).length - shown.length;
  return (
    <View className="flex-row items-center">
      {shown.map((m, i) => (
        <View key={`${m.id}-${i}`} className={i > 0 ? '-ml-2' : ''}>
          <Avatar m={m} />
        </View>
      ))}
      {more > 0 && (
        <View className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 ring-1 ring-white">
          <Text className="text-[10px] font-semibold text-slate-700">+{more}</Text>
        </View>
      )}
    </View>
  );
}

interface FlashRef {
  current: (() => void) | null;
}

export default function TaskInfoSection({
  t,
  onMarkDone,
  onNext,
  onSplit,
  onMoveNext,
  onMoveToSprint,
  onOpenTask,
  onLongPress,
  isActive = false,
  statusColorHex,
  statusLabel,
  flashRef,
}: any) {
  const { flash, backgroundColor } = useFlashTask(statusColorHex);
  if (flashRef) flashRef.current = flash;

  const isDone = t.statusCategory === 'DONE';
  const blocked = (t.dependsOn || []).length > 0;

  const statusText = (statusLabel ?? t.statusCode ?? '').trim();
  const statusColor = statusColorHex ?? '#0F172A';

  const assignees = t.assignees || [];
  const uniqueAssigneesMap = new Map<string, MemberRef>();
  assignees.forEach((a: MemberRef) => {
    if (!uniqueAssigneesMap.has(a.name)) uniqueAssigneesMap.set(a.name, a);
  });
  const uniqueAssignees = Array.from(uniqueAssigneesMap.values());

  const isUrgent = t.priority === 'Urgent';

  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isUrgent) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [isUrgent]);

  return (
    <Pressable
      onLongPress={onLongPress}
      pointerEvents={isActive ? 'none' : 'auto'}
      style={[
        {
          transform: [{ scale: isActive ? 1.03 : 1 }],
          opacity: isActive ? 0.92 : 1,
          zIndex: isActive ? 999 : 1,
          elevation: isActive ? 8 : 2,
          borderColor: isUrgent ? '#DC2626' : '#E5E7EB',
          borderWidth: isUrgent ? 1.5 : 1,
        },
      ]}
      className="mb-2 rounded-lg border bg-white p-3 shadow"
    >
      {/* Header */}
      <View className="mb-1 flex-row items-start justify-between">
        <Text className="text-[10px] text-slate-500">{t.code}</Text>

        <View className="flex-row flex-wrap items-center gap-1">
          {statusText ? (
            <View
              className="rounded-full border px-2 py-0.5"
              style={{ backgroundColor: '#F9FAFB', borderColor: statusColor }}
            >
              <Text className="text-[9px]" style={{ color: statusColor }}>
                {statusText}
              </Text>
            </View>
          ) : null}

          {blocked && (
            <View className="rounded-full border border-rose-500 bg-white px-2 py-0.5">
              <Text className="text-[9px] text-rose-700">Blocked</Text>
            </View>
          )}

          {t.priority && (
            <View className="rounded-full border bg-white px-2 py-0.5">
              <Text className="text-[9px] text-slate-700">{t.priority}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Title */}
      <Pressable onPress={() => onOpenTask?.(t.id)}>
        <Text className="mb-1 text-[13px] font-semibold text-blue-600">{t.title}</Text>
      </Pressable>

      {/* Meta */}
      <View className="mb-1 flex-row flex-wrap gap-2">
        <View className="flex-row items-center gap-1">
          <Flag width={12} height={12} />
          <Text className="text-[9px]">{t.type}</Text>
        </View>

        <View className="flex-row items-center gap-1">
          <TimerReset width={12} height={12} />
          <Text className="text-[9px]">{Math.max(0, t.storyPoints ?? 0)} pts</Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Clock width={12} height={12} />
          <Text className="text-[9px]">
            {Math.max(0, t.remainingHours ?? 0)}/{t.estimateHours ?? 0}h
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-1">
        <CalendarDays width={12} height={12} />
        <Text className="text-[9px]">Due: {formatLocalDate(t.dueDate) ?? 'N/A'}</Text>
      </View>

      {/* Assignees */}
      <View className="mb-2 flex-row items-center justify-between pt-2">
        <AvatarGroup members={uniqueAssignees || []} />
        <Text className="max-w-[100px] truncate text-[9px] text-slate-600">
          {uniqueAssignees.length > 0
            ? uniqueAssignees.map((a) => a.name).join(', ')
            : 'Unassigned'}
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row flex-wrap gap-2">
        {!isDone && (
          <Pressable
            className="flex-row items-center gap-1 rounded-lg border border-emerald-300 px-2 py-1"
            onPress={() => onMarkDone(t)}
          >
            <Check width={12} height={12} />
            <Text className="text-[9px] text-emerald-700">Done</Text>
          </Pressable>
        )}

        <Pressable
          className="flex-row items-center gap-1 rounded-lg border border-slate-300 px-2 py-1"
          onPress={() => onMoveNext(t)}
        >
          <MoveDown width={12} height={12} />
          <Text className="text-[9px] text-slate-600">Next</Text>
        </Pressable>
      </View>

      {isUrgent && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#EF4444',
            borderWidth: 2,
            borderColor: '#fff',
            opacity: pulseAnim,
          }}
        />
      )}
    </Pressable>
  );
}
