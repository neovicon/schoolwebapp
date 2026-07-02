import { Link } from 'react-router-dom';
import { Edit, ChevronDown, GraduationCap, ArrowRightLeft, EyeOff, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { StudentProfile, StudentStatus } from '../../../types/student.types';
import { useUpdateStudentStatus } from '../hooks/useStudentMutations';

interface StudentHeaderProps {
  student: StudentProfile;
}

const STATUS_VARIANTS: Record<StudentStatus, 'success' | 'danger' | 'info' | 'warning' | 'secondary'> = {
  active: 'success',
  suspended: 'danger',
  graduated: 'info',
  transferred: 'warning',
  archived: 'secondary',
};

const STATUS_LABELS: Record<StudentStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  graduated: 'Graduated',
  transferred: 'Transferred',
  archived: 'Archived',
};

export function StudentHeader({ student }: StudentHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const statusMutation = useUpdateStudentStatus(student.documentId);

  const fullName = `${student.firstName} ${student.lastName}`;

  const handleStatusChange = async (newStatus: StudentStatus) => {
    setIsDropdownOpen(false);
    try {
      await statusMutation.mutateAsync(newStatus);
    } catch (err) {
      console.error('Failed to update student status', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/5 select-none text-left">
      
      {/* Left: Breadcrumbs & Student Info */}
      <div className="flex flex-col gap-1.5">
        {/* Simple inline breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
          <Link to="/admin/students" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Students
          </Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-350">Profile</span>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 mt-1">
          <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-slate-900 dark:text-white leading-tight">
            {fullName}
          </h2>
          <Badge variant={STATUS_VARIANTS[student.status]} className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide">
            {STATUS_LABELS[student.status]}
          </Badge>
        </div>

        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
          Admission No: <span className="text-slate-800 dark:text-slate-200 font-bold">{student.admissionNumber}</span>
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Edit Button */}
        <Link to={`/admin/students/${student.documentId}/edit`}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit className="w-4 h-4" />}
            className="shadow-sm border-slate-200 hover:border-primary-500 dark:border-white/10 dark:hover:border-primary-500"
          >
            Edit Profile
          </Button>
        </Link>

        {/* Change Status Dropdown */}
        <div className="relative">
          <Button
            variant="glass"
            size="sm"
            isLoading={statusMutation.isPending}
            rightIcon={!statusMutation.isPending && <ChevronDown className="w-4 h-4" />}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="border border-slate-200 dark:border-white/10 shadow-sm"
          >
            Change Status
          </Button>

          {isDropdownOpen && (
            <>
              {/* Overlay back to close */}
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              
              <div className="absolute right-0 mt-2.5 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 shadow-2xl p-2 z-20 flex flex-col gap-1">
                {student.status !== 'active' && (
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-bold text-green-600 dark:text-green-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Set Active
                  </button>
                )}
                {student.status !== 'suspended' && (
                  <button
                    onClick={() => handleStatusChange('suspended')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-bold text-red-650 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <EyeOff className="w-4 h-4" />
                    Suspend Student
                  </button>
                )}
                {student.status !== 'graduated' && (
                  <button
                    onClick={() => handleStatusChange('graduated')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Mark Graduated
                  </button>
                )}
                {student.status !== 'transferred' && (
                  <button
                    onClick={() => handleStatusChange('transferred')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-bold text-yellow-600 dark:text-yellow-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    Mark Transferred
                  </button>
                )}
                {student.status !== 'archived' && (
                  <button
                    onClick={() => handleStatusChange('archived')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <EyeOff className="w-4 h-4" />
                    Archive Profile
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
