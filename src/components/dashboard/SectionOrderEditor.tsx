"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_SECTION_ORDER,
  SECTION_LABELS,
  type PortfolioSectionKey,
} from "@/lib/portfolio-sections";

type SectionVisibility = Record<PortfolioSectionKey, boolean>;

interface SectionOrderEditorProps {
  order: PortfolioSectionKey[];
  visibility: SectionVisibility;
  onOrderChange: (order: PortfolioSectionKey[]) => void;
  onVisibilityChange: (visibility: SectionVisibility) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

interface SortableRowProps {
  section: PortfolioSectionKey;
  visible: boolean;
  onToggleVisible: () => void;
}

function SortableRow({ section, visible, onToggleVisible }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label={`Drag ${SECTION_LABELS[section]}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">{SECTION_LABELS[section]}</span>
      </div>
      <Switch
        checked={visible}
        onChange={onToggleVisible}
        aria-label={`Toggle ${SECTION_LABELS[section]} visibility`}
      />
    </div>
  );
}

export function SectionOrderEditor({
  order,
  visibility,
  onOrderChange,
  onVisibilityChange,
  onSave,
  saving,
}: SectionOrderEditorProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id as PortfolioSectionKey);
    const newIndex = order.indexOf(over.id as PortfolioSectionKey);
    if (oldIndex < 0 || newIndex < 0) return;

    onOrderChange(arrayMove(order, oldIndex, newIndex));
  };

  const resetDefaults = () => {
    onOrderChange(DEFAULT_SECTION_ORDER);
    onVisibilityChange(
      DEFAULT_SECTION_ORDER.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as SectionVisibility),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Layout</CardTitle>
        <CardDescription>
          Drag sections to reorder your public portfolio. Toggle visibility per section.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {order.map((section) => (
                <SortableRow
                  key={section}
                  section={section}
                  visible={visibility[section]}
                  onToggleVisible={() =>
                    onVisibilityChange({
                      ...visibility,
                      [section]: !visibility[section],
                    })
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={resetDefaults}>
            Reset Defaults
          </Button>
          <Button type="button" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save Section Layout"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
