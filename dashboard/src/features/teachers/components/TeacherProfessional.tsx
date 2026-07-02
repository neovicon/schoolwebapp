import { Briefcase, GraduationCap, Calendar, Award, Building, Book } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import type { TeacherProfile } from '../../../types/teacher.types';

interface TeacherProfessionalProps {
  teacher: TeacherProfile;
}

export function TeacherProfessional({ teacher }: TeacherProfessionalProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none text-left">
      
      {/* Professional Information */}
      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-650 dark:text-primary-400 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Employment Details
            </h3>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
              Work experience and current position status
            </span>
          </div>
        </CardHeader>
        
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-400" /> Employee ID
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{teacher.employeeId}</p>
            </div>
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date Joined
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{formatDate(teacher.joiningDate)}</p>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-white/5" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Qualifications
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{teacher.qualification || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" /> Institution Branch
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{teacher.school?.name || 'Main Campus'}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Biography & Professional Narrative */}
      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="p-2 bg-secondary-50 dark:bg-secondary-950/20 text-secondary-650 dark:text-secondary-400 rounded-xl">
            <Book className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Professional Biography
            </h3>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
              Public biography and introductory notes
            </span>
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          <div>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Short Description / Bio
            </span>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-350 mt-2 leading-relaxed italic bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
              {teacher.teacher?.bio || 'No public bio set for this teacher profile. You can populate this by editing the public profile listing.'}
            </p>
          </div>
        </CardBody>
      </Card>

    </div>
  );
}
