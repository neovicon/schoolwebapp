import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { TeacherFormWizard } from '../components/TeacherFormWizard';
import { useCreateTeacher } from '../hooks/useTeacherMutations';

export function CreateTeacherPage() {
  const createMutation = useCreateTeacher();

  const handleFormSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth || undefined,
        gender: data.gender || undefined,
        bloodGroup: data.bloodGroup || undefined,
        address: data.address || undefined,
        employeeId: data.employeeId,
        qualification: data.qualification || undefined,
        joiningDate: data.joiningDate || undefined,
        status: data.status || 'active',
        assignments: data.assignments || [],
      });
    } catch (err) {
      console.error('Failed to create teacher', err);
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Header */}
      <div className="flex items-center gap-4 text-left">
        <Link to="/admin/teachers">
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
            Add New Teacher
          </h2>
          <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-0.5 block">
            Record teacher profile and allocate initial teaching assignments
          </span>
        </div>
      </div>

      {/* Form Wizard */}
      <div className="mt-8">
        <TeacherFormWizard
          onSubmit={handleFormSubmit}
          isSubmitting={createMutation.isPending}
        />
      </div>

    </div>
  );
}
