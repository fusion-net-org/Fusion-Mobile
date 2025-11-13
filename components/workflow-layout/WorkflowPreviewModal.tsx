import { Workflow } from '@/interfaces/workflow';
import { X } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Circle, Defs, Marker, Path, Polygon, Text as SvgText } from 'react-native-svg';

interface WorkflowPreviewModalProps {
  open: boolean;
  onClose: () => void;
  workflow: Workflow;
}

const WorkflowPreviewModal: React.FC<WorkflowPreviewModalProps> = ({ open, onClose, workflow }) => {
  const { width } = Dimensions.get('window');
  const canvasWidth = Math.max(...workflow.statuses.map((s) => s.x)) + 200;
  const canvasHeight = Math.max(...workflow.statuses.map((s) => s.y)) + 200;

  const findStatus = (id: string) => workflow.statuses.find((s) => s.id === id);

  return (
    <Modal visible={open} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          className="h-[80%] w-[90%] rounded-xl bg-white p-4"
        >
          {/* Header */}
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-semibold">{workflow.name}</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <X size={22} color="#111" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={{ width: Math.max(canvasWidth, width) }}
            showsHorizontalScrollIndicator={false}
          >
            <ScrollView
              contentContainerStyle={{ height: canvasHeight }}
              showsVerticalScrollIndicator={false}
            >
              <Svg width={canvasWidth} height={canvasHeight}>
                <Defs>
                  <Marker
                    id="arrow"
                    markerWidth="10"
                    markerHeight="10"
                    refX="6"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <Polygon points="0 0, 6 3, 0 6" fill="#333" />
                  </Marker>
                </Defs>

                {/* Draw transitions */}
                {workflow.transitions.map((t, i) => {
                  const from = findStatus(t.fromStatusId);
                  const to = findStatus(t.toStatusId);
                  if (!from || !to) return null;

                  const dx = to.x - from.x;
                  const dy = to.y - from.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const offsetX = (dx / dist) * 40;
                  const offsetY = (dy / dist) * 40;

                  return (
                    <Path
                      key={i}
                      d={`M${from.x + offsetX},${from.y + offsetY} L${to.x - offsetX},${to.y - offsetY}`}
                      stroke={t.type === 'failure' ? '#ef4444' : '#333'}
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrow)"
                    />
                  );
                })}

                {/* Draw statuses */}
                {workflow.statuses.map((s, i) => (
                  <React.Fragment key={s.id}>
                    <Circle
                      cx={s.x}
                      cy={s.y}
                      r="30"
                      fill={s.color || '#ccc'}
                      stroke={s.isStart ? '#00bcd4' : s.isEnd ? '#4caf50' : '#333'}
                      strokeWidth={s.isStart || s.isEnd ? 3 : 1}
                    />
                    <SvgText x={s.x} y={s.y + 45} textAnchor="middle" fontSize="12" fill="#333">
                      {s.name}
                    </SvgText>
                  </React.Fragment>
                ))}
              </Svg>
            </ScrollView>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default WorkflowPreviewModal;
