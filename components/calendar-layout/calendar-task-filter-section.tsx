import { FilterItem } from '@/interfaces/base';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FilterDropdownSquare from '../layouts/FilterDropdownSquare';

interface CalendarTaskFilterSectionProps {
  projects: FilterItem[];
  sprints: FilterItem[];
  priorities: FilterItem[];
  types: FilterItem[];
  selectedProjectId: string | null;
  selectedSprintId: string | null;
  selectedPriorityId: string | null;
  selectedTypeId: string | null;
  onSelectProject: (id: string | null) => void;
  onSelectSprint: (id: string | null) => void;
  onSelectPriority: (id: string | null) => void;
  onSelectType: (id: string | null) => void;
  onResetAll: () => void;
}

export default function CalendarTaskFilterSection({
  projects,
  sprints,
  priorities,
  types,
  selectedProjectId,
  selectedSprintId,
  selectedPriorityId,
  selectedTypeId,
  onSelectProject,
  onSelectSprint,
  onSelectPriority,
  onSelectType,
  onResetAll,
}: CalendarTaskFilterSectionProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3 p-2">
      <View className="flex-row space-x-2">
        <FilterDropdownSquare
          label="Project"
          items={projects}
          selectedId={selectedProjectId}
          onSelect={onSelectProject}
        />
        {selectedProjectId && (
          <FilterDropdownSquare
            label="Sprint"
            items={sprints}
            selectedId={selectedSprintId}
            onSelect={onSelectSprint}
          />
        )}
        <FilterDropdownSquare
          label="Priority"
          items={priorities}
          selectedId={selectedPriorityId}
          onSelect={onSelectPriority}
        />
        <FilterDropdownSquare
          label="Type"
          items={types}
          selectedId={selectedTypeId}
          onSelect={onSelectType}
        />
        <TouchableOpacity
          onPress={onResetAll}
          className="justify-center rounded-lg bg-red-100 px-4 py-2"
        >
          <Text className="text-sm font-medium text-red-600">Reset All</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
