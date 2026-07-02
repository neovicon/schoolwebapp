import { Link } from 'react-router-dom';
import { Edit, ChevronDown, CheckCircle, ShieldAlert, BookOpen, Coffee, Archive } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { TeacherProfile, TeacherStatus } from '../../../types/teacher.types';
import { useUpdateTeacherStatus } from '../hooks/useTeacherMutations';

interface TeacherHeaderProps {
  teacher: TeacherProfile;
}

const STATUS_VARIANTS: Record<TeacherStatus, 'success' | 'danger' | 'info' | 'warning' | 'secondary'> = {
  active: 'success',
  on_leave: 'warning',
  retired: 'info',
  resigned: 'danger',
  archived: 'secondary',
};

const STATUS_LABELS: Record<TeacherStatus, string> = {
  active: 'Active',
  on_leave: 'On Leave',
  retired: 'Retired',
  resigned: 'Resigned',
  archived: 'Archived',
};

export function TeacherHeader({ teacher }: TeacherHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const statusMutation = useUpdateTeacherStatus(teacher.documentId);

  const fullName = `${teacher.firstName} ${teacher.lastName}`;

  const handleStatusChange = async (newStatus: TeacherStatus) => {
    setIsDropdownOpen(false);
    try {
      await statusMutation.mutateAsync(newStatus);
    } catch (err) {
      console.error('Failed to update teacher status', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/5 select-none text-left">
      
      {/* Left: Breadcrumbs & Teacher Info */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
          <Link to="/admin/teachers" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Teachers
          </Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-350">Profile</span>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 mt-1">
          <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-slate-900 dark:text-white leading-tight">
            {fullName}
          </h2>
          <Badge variant={STATUS_VARIANTS[teacher.status]} className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide">
            {STATUS_LABELS[teacher.status]}
          </Badge>
        </div>

        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
          Employee ID: <span className="text-slate-800 dark:text-slate-200 font-bold">{teacher.employeeId}</span>
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Edit Button */}
        <Link to={`/admin/teachers/${teacher.documentId}/edit`}>
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
                {teacher.status !== 'active' && (
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-bold text-green-600 dark:text-green-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-left border-none bg-transparent"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Set Active
                  </button>
                )}
                {teacher.status !== 'on_leave' && (
                  <button
                    onClick={() => handleStatusChange('on_leave')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-bold text-yellow-600 dark:text-yellow-450 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-left border-none bg-transparent"
                  >
                    <Coffee className="w-4 h-4" />
                    Mark On Leave
                  </button>
                )}
                {teacher.status !== 'retired' && (
                  <button
                    onClick={() => handleStatusChange('retired')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-left border-none bg-transparent"
                  >
                    <BookOpen className="w-4 h-4" />
                    Mark Retired
                  </button>
                )}
                {teacher.status !== 'resigned' && (
                  <button
                    onClick={() => handleStatusChange('resigned')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-bold text-red-650 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-left border-none bg-transparent"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Mark Resigned
                  </button>
                )}
                {teacher.status !== 'archived' && (
                  <button
                    onClick={() => handleStatusChange('archived')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-bold text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-left border-none bg-transparent"
                  >
                    <Archive className="w-4 h-4" />
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
