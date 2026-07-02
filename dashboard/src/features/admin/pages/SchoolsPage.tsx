import { School } from 'lucide-react';
import { FeaturePlaceholder } from '../../../components/dashboard/FeaturePlaceholder';

export function SchoolsPage() {
  return (
    <FeaturePlaceholder
      icon={School}
      title="Institution Management"
      description="Manage all affiliated schools and campuses. Configure each institution's settings and administrator assignments."
      badge="Super Admin Only"
    />
  );
}
