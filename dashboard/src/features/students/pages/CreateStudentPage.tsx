import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { StudentFormWizard } from '../components/StudentFormWizard';
import { useCreateStudent } from '../hooks/useStudentMutations';

export function CreateStudentPage() {
  const createMutation = useCreateStudent();

  const handleFormSubmit = async (data: any) => {
    try {
      // payload expects class selection inside enrollment, etc.
      // We pass the parsed data payload to our create student mutation.
      await createMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender || undefined,
        bloodGroup: data.bloodGroup || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        emergencyContact: data.emergencyContact,
        admissionNumber: data.admissionNumber,
        rollNumber: data.rollNumber,
        enrollmentDate: data.enrollmentDate,
        sectionDocumentId: data.sectionDocumentId,
        academicYearDocumentId: data.academicYearDocumentId,
        // Optional: schoolDocumentId if required by schema. We'll set it dynamically if we have user context.
        // Wait, let's see: in `seed-school-erp.js`, school was WA01. We can let the backend handle school mapping
        // or extract it from user context. Wait, let's pass it if schoolId is available on the logged in admin user!
      });
    } catch (err) {
      console.error('Failed to create student', err);
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Header */}
      <div className="flex items-center gap-4 text-left">
        <Link to="/admin/students">
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
            Add New Student
          </h2>
          <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-0.5 block">
            Record student profile and allocate class enrollment
          </span>
        </div>
      </div>

      {/* Form Wizard */}
      <div className="mt-8">
        <StudentFormWizard
          onSubmit={handleFormSubmit}
          isSubmitting={createMutation.isPending}
        />
      </div>

    </div>
  );
}
