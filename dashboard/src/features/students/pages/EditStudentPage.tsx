import { ArrowLeft, GraduationCap } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/dashboard/EmptyState';
import { StudentFormWizard } from '../components/StudentFormWizard';
import { useStudent } from '../hooks/useStudents';
import { useUpdateStudent } from '../hooks/useStudentMutations';

export function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading, error } = useStudent(id);
  const updateMutation = useUpdateStudent(id!);

  const handleFormSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender || undefined,
        bloodGroup: data.bloodGroup || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        emergencyContact: data.emergencyContact,
        // In edit mode we do not mutate academic placement fields to prevent breaking enrollment logs.
      });
      // Redirect back to profile page on success
      navigate(`/admin/students/${id}`);
    } catch (err) {
      console.error('Failed to update student profile', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-left select-none">
        <div className="h-16 w-96 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-96 max-w-4xl mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse mt-8" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="py-12">
        <EmptyState
          title="Student profile not found"
          description="The student profile you are attempting to edit does not exist or you do not have permission."
          icon={<GraduationCap className="w-8 h-8 text-slate-400" />}
          actionText="Back to Directory"
          onAction={() => navigate('/admin/students')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Header */}
      <div className="flex items-center gap-4 text-left">
        <Link to={`/admin/students/${id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 border border-slate-200 dark:border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Edit Student Profile
          </h2>
          <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-0.5 block">
            Modify personal records and emergency contacts for {student.firstName} {student.lastName}
          </span>
        </div>
      </div>

      {/* Form Wizard in Edit mode */}
      <div className="mt-8">
        <StudentFormWizard
          initialStudent={student}
          isEdit={true}
          onSubmit={handleFormSubmit}
          isSubmitting={updateMutation.isPending}
        />
      </div>

    </div>
  );
}
