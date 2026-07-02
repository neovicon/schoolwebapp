import { BarChart3 } from 'lucide-react';
import { FeaturePlaceholder } from '../../../components/dashboard/FeaturePlaceholder';

export function ReportsPage() {
  return (
    <FeaturePlaceholder
      icon={BarChart3}
      title="Academic Reports"
      description="Generate and export detailed reports on student performance, attendance trends, and institutional metrics."
      badge="Coming Next"
    />
  );
}
