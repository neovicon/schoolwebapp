import { Layers } from 'lucide-react';
import { FeaturePlaceholder } from '../../../components/dashboard/FeaturePlaceholder';

export function ClassesPage() {
  return (
    <FeaturePlaceholder
      icon={Layers}
      title="Classes & Sections"
      description="Organise class sections, assign teachers, and manage student rosters for each academic period."
      badge="Coming Next"
    />
  );
}
