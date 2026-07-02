import { Award, Calendar, Layers, Hash } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import type { StudentProfile } from '../../../types/student.types';

interface StudentAcademicProps {
  student: StudentProfile;
}

export function StudentAcademic({ student }: StudentAcademicProps) {
  const enrollments = student.enrollments ?? [];

  // Find the active enrollment for highlight
  const currentEnrollment = enrollments.find((e) => e.status === 'active') ?? enrollments[0];

  const formatDate = (dateStr: string) => {
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
    <div className="space-y-6 select-none text-left">
      
      {/* Active Academic Placement Summary */}
      {currentEnrollment ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary-500">
            <CardBody className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-950/20 text-primary-650 dark:text-primary-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Current Class</span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {currentEnrollment.section?.class?.name ?? '—'}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card className="border-l-4 border-l-secondary-500">
            <CardBody className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-secondary-50 dark:bg-secondary-950/20 text-secondary-650 dark:text-secondary-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Section / Room</span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {currentEnrollment.section?.name ?? '—'} {currentEnrollment.section?.room ? `(${currentEnrollment.section.room})` : ''}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardBody className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400">
                <Hash className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Roll Number</span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {currentEnrollment.rollNumber}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardBody className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Academic Year</span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {currentEnrollment.academicYear?.name ?? '—'}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <Card className="border border-dashed border-slate-200 dark:border-white/10">
          <CardBody className="py-8 text-center text-slate-500 dark:text-slate-400 font-semibold">
            No active academic placement found for this student.
          </CardBody>
        </Card>
      )}

      {/* Enrollment History Timeline/Table */}
      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Enrollment Placement History
            </h3>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
              Historical class allocations and academic statuses
            </span>
          </div>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4.5 text-left text-xs font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Academic Year</th>
                <th className="px-6 py-4.5 text-left text-xs font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4.5 text-left text-xs font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-4.5 text-left text-xs font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Roll No.</th>
                <th className="px-6 py-4.5 text-left text-xs font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Enrollment Date</th>
                <th className="px-6 py-4.5 text-left text-xs font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-semibold">
                    No enrollment logs recorded.
                  </td>
                </tr>
              ) : (
                enrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50/20 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4.5 font-bold text-slate-850 dark:text-slate-150">{enr.academicYear?.name ?? '—'}</td>
                    <td className="px-6 py-4.5 font-bold text-slate-850 dark:text-slate-150">{enr.section?.class?.name ?? '—'}</td>
                    <td className="px-6 py-4.5 font-bold text-slate-700 dark:text-slate-300">{enr.section?.name ?? '—'}</td>
                    <td className="px-6 py-4.5 font-bold text-slate-700 dark:text-slate-300">{enr.rollNumber}</td>
                    <td className="px-6 py-4.5 font-bold text-slate-500 dark:text-slate-400">{formatDate(enr.enrollmentDate)}</td>
                    <td className="px-6 py-4.5 font-bold">
                      <Badge variant={enr.status === 'active' ? 'success' : 'danger'} className="text-2xs font-extrabold uppercase">
                        {enr.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

    </div>
  );
}
