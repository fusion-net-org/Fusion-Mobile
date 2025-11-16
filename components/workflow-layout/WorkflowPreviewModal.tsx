import { Workflow } from '@/interfaces/workflow';
import { X, ZoomIn, ZoomOut } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Marker, Path, Polygon, Text as SvgText } from 'react-native-svg';

interface WorkflowPreviewModalProps {
  open: boolean;
  onClose: () => void;
  workflow: Workflow;
}

const WorkflowPreviewModal: React.FC<WorkflowPreviewModalProps> = ({ open, onClose, workflow }) => {
  const { width: screenWidth } = Dimensions.get('window');
  const canvasWidth = Math.max(...workflow.statuses.map((s) => s.x)) + 200;
  const canvasHeight = Math.max(...workflow.statuses.map((s) => s.y)) + 200;

  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(3, Math.max(0.5, e.scale));
      focalX.value = e.focalX;
      focalY.value = e.focalY;
    })
    .onEnd(() => {
      scale.value = withTiming(Math.min(3, Math.max(0.5, scale.value)));
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: focalX.value },
      { translateY: focalY.value },
      { scale: scale.value },
      { translateX: -focalX.value },
      { translateY: -focalY.value },
    ],
  }));

  const zoom = (factor: number) => {
    scale.value = withTiming(Math.min(3, Math.max(0.5, scale.value * factor)), { duration: 150 });
  };

  const findStatus = (id: string) => workflow.statuses.find((s) => s.id === id);
  const transitionCountIndex: Record<string, number> = {};

  return (
    <Modal visible={open} transparent animationType="fade">
      <GestureHandlerRootView style={{ flex: 1 }}>
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

            {/* Canvas */}
            <ScrollView
              horizontal
              contentContainerStyle={{ width: Math.max(canvasWidth, screenWidth) }}
              showsHorizontalScrollIndicator={false}
            >
              <ScrollView
                contentContainerStyle={{ height: canvasHeight }}
                showsVerticalScrollIndicator={false}
              >
                <GestureDetector gesture={pinchGesture}>
                  <Animated.View style={animatedStyle}>
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

                      {/* Transitions */}
                      {workflow.transitions.map((t, i) => {
                        const from = findStatus(t.fromStatusId);
                        const to = findStatus(t.toStatusId);
                        if (!from || !to) return null;

                        const dx = to.x - from.x;
                        const dy = to.y - from.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const offsetX = (dx / dist) * 40;
                        const offsetY = (dy / dist) * 40;

                        const pairKey =
                          t.fromStatusId < t.toStatusId
                            ? `${t.fromStatusId}_${t.toStatusId}`
                            : `${t.toStatusId}_${t.fromStatusId}`;

                        transitionCountIndex[pairKey] = (transitionCountIndex[pairKey] || 0) + 1;
                        const duplicateIndex = transitionCountIndex[pairKey] - 1;

                        const normX = -dy / dist;
                        const normY = dx / dist;
                        const spacing = 25;

                        let offsetValue = 0;
                        if (duplicateIndex > 0) {
                          const pairIndex = Math.floor((duplicateIndex + 1) / 2);
                          const direction = duplicateIndex % 2 === 1 ? 1 : -1;
                          offsetValue = spacing * pairIndex * direction;
                        }

                        const offsetX2 = normX * offsetValue;
                        const offsetY2 = normY * offsetValue;

                        const path = `
                          M${from.x + offsetX + offsetX2},${from.y + offsetY + offsetY2}
                          L${to.x - offsetX + offsetX2},${to.y - offsetY + offsetY2}
                        `;

                        const midX = (from.x + to.x) / 2 + offsetX2;
                        const midY = (from.y + to.y) / 2 + offsetY2;

                        return (
                          <React.Fragment key={i}>
                            <Path
                              d={path}
                              stroke={t.type === 'failure' ? '#ef4444' : '#333'}
                              strokeWidth="2"
                              fill="none"
                              markerEnd="url(#arrow)"
                            />
                            <SvgText
                              x={midX}
                              y={midY - 5}
                              textAnchor="middle"
                              fontSize="10"
                              fill={t.type === 'failure' ? '#ef4444' : '#333'}
                            >
                              {t.label}
                            </SvgText>
                          </React.Fragment>
                        );
                      })}

                      {/* Nodes */}
                      {workflow.statuses.map((s) => (
                        <React.Fragment key={s.id}>
                          <Circle
                            cx={s.x}
                            cy={s.y}
                            r="30"
                            fill={s.color || '#ccc'}
                            stroke={s.isStart ? '#00bcd4' : s.isEnd ? '#4caf50' : '#333'}
                            strokeWidth={s.isStart || s.isEnd ? 3 : 1}
                          />
                          <SvgText
                            x={s.x}
                            y={s.y + 45}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#333"
                          >
                            {s.name}
                          </SvgText>
                          {(s.roles || []).map((role, idx) => (
                            <SvgText
                              key={role}
                              x={s.x}
                              y={s.y + 60 + idx * 15}
                              textAnchor="middle"
                              fontSize="10"
                              fill="#555"
                            >
                              {role}
                            </SvgText>
                          ))}
                        </React.Fragment>
                      ))}
                    </Svg>
                  </Animated.View>
                </GestureDetector>
              </ScrollView>
            </ScrollView>

            {/* Zoom buttons ở dưới cùng modal */}
            <View className="mt-3 flex-row justify-center space-x-4">
              <TouchableOpacity onPress={() => zoom(1.2)} className="rounded bg-gray-200 p-2">
                <ZoomIn size={20} color="#111" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => zoom(0.8)} className="rounded bg-gray-200 p-2">
                <ZoomOut size={20} color="#111" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default WorkflowPreviewModal;
