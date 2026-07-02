import { FileText } from 'lucide-react';
import { FeaturePlaceholder } from '../../../components/dashboard/FeaturePlaceholder';

export function AdmissionsPage() {
  return (
    <FeaturePlaceholder
      icon={FileText}
      title="Admissions Management"
      description="Review and process student admission applications, track statuses, and communicate with applicants."
      badge="Coming Next"
    />
  );
}
