import { Users } from 'lucide-react';
import { FeaturePlaceholder } from '../../../components/dashboard/FeaturePlaceholder';

export function TeachersPage() {
  return (
    <FeaturePlaceholder
      icon={Users}
      title="Teacher Management"
      description="Manage teacher profiles, subject assignments, schedules, and performance records."
      badge="Coming Next"
    />
  );
}
