import { Users } from 'lucide-react';
import { FeaturePlaceholder } from '../../../components/dashboard/FeaturePlaceholder';

export function UsersPage() {
  return (
    <FeaturePlaceholder
      icon={Users}
      title="User Management"
      description="Manage all portal users — administrators, teachers, and students — from a single interface."
      badge="Coming Next"
    />
  );
}
