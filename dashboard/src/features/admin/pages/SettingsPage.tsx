import { Settings } from 'lucide-react';
import { FeaturePlaceholder } from '../../../components/dashboard/FeaturePlaceholder';

export function SettingsPage() {
  return (
    <FeaturePlaceholder
      icon={Settings}
      title="System Settings"
      description="Configure portal-wide settings, notification preferences, integrations, and security policies."
      badge="Coming Next"
    />
  );
}
