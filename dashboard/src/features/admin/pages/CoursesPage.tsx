import { BookOpen } from 'lucide-react';
import { FeaturePlaceholder } from '../../../components/dashboard/FeaturePlaceholder';

export function CoursesPage() {
  return (
    <FeaturePlaceholder
      icon={BookOpen}
      title="Course Catalogue"
      description="Create and manage academic courses, assign teachers, set credit hours, and track curriculum requirements."
      badge="Coming Next"
    />
  );
}
