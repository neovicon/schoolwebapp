import { TrendingUp } from 'lucide-react';
import { FeaturePlaceholder } from '../../../components/dashboard/FeaturePlaceholder';

export function AnalyticsPage() {
  return (
    <FeaturePlaceholder
      icon={TrendingUp}
      title="Analytics & Insights"
      description="Interactive dashboards with trend analysis, predictive insights, and comparative benchmarking across institutions."
      badge="Coming Next"
    />
  );
}
