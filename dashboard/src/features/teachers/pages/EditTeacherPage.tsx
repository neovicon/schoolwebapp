import { ArrowLeft, Users } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/dashboard/EmptyState';
import { TeacherFormWizard } from '../components/TeacherFormWizard';
import { useTeacher } from '../hooks/useTeachers';
import { useUpdateTeacher } from '../hooks/useTeacherMutations';

export function EditTeacherPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: teacher, isLoading, error } = useTeacher(id);
  const updateMutation = useUpdateTeacher(id!);

  const handleFormSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth || undefined,
        gender: data.gender || undefined,
        bloodGroup: data.bloodGroup || undefined,
        address: data.address || undefined,
        qualification: data.qualification || undefined,
        joiningDate: data.joiningDate || undefined,
        status: data.status || 'active',
      });
      // Redirect back to profile page on success
      navigate(`/admin/teachers/${id}`);
    } catch (err) {
      console.error('Failed to update teacher profile', err);
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

  if (error || !teacher) {
    return (
      <div className="py-12">
        <EmptyState
          title="Teacher profile not found"
          description="The teacher profile you are attempting to edit does not exist or you do not have permission."
          icon={<Users className="w-8 h-8 text-slate-400" />}
          actionText="Back to Directory"
          onAction={() => navigate('/admin/teachers')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Header */}
      <div className="flex items-center gap-4 text-left">
        <Link to={`/admin/teachers/${id}`}>
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
            Edit Teacher Profile
          </h2>
          <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-0.5 block">
            Modify personal records and qualifications for {teacher.firstName} {teacher.lastName}
          </span>
        </div>
      </div>

      {/* Form Wizard in Edit mode */}
      <div className="mt-8">
        <TeacherFormWizard
          initialTeacher={teacher}
          isEdit={true}
          onSubmit={handleFormSubmit}
          isSubmitting={updateMutation.isPending}
        />
      </div>

    </div>
  );
}
