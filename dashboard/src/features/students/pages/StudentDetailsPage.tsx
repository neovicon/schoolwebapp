import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GraduationCap, Clock } from 'lucide-react';
import { Tabs } from '../../../components/ui/Tabs';
import { Card, CardBody } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/dashboard/EmptyState';
import { StudentHeader } from '../components/StudentHeader';
import { StudentOverview } from '../components/StudentOverview';
import { StudentAcademic } from '../components/StudentAcademic';
import { StudentGuardian } from '../components/StudentGuardian';
import { StudentDocuments } from '../components/StudentDocuments';
import { useStudent } from '../hooks/useStudents';
import type { StudentProfile } from '../../../types/student.types';

const TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Academic Placement', value: 'academic' },
  { label: 'Guardian Info', value: 'guardian' },
  { label: 'Documents', value: 'documents' },
  { label: 'Activity History', value: 'activity' },
];

export function StudentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: student, isLoading, error } = useStudent(id);
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="space-y-6 text-left select-none">
        <div className="h-28 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-12 w-96 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="py-12">
        <EmptyState
          title="Student profile not found"
          description="The student profile you are looking for does not exist or you do not have permission to view it."
          icon={<GraduationCap className="w-8 h-8 text-slate-400" />}
          actionText="Back to Directory"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  // Render tab contents
  const renderTabContent = () => {
    switch (activeTab) {
      case 'academic':
        return <StudentAcademic student={student} />;
      case 'guardian':
        return <StudentGuardian student={student} />;
      case 'documents':
        return <StudentDocuments />;
      case 'activity':
        return <ActivityTimeline student={student} />;
      case 'overview':
      default:
        return <StudentOverview student={student} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Details Header */}
      <StudentHeader student={student} />

      {/* Tabs navigation */}
      <div className="max-w-3xl">
        <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />
      </div>

      {/* Dynamic Tab Body */}
      <div className="mt-8">
        {renderTabContent()}
      </div>
    </div>
  );
}

// ─── Activity Timeline ────────────────────────────────────────────────────────

interface ActivityTimelineProps {
  student: StudentProfile;
}

function ActivityTimeline({ student }: ActivityTimelineProps) {
  const activeEnrollment = student.enrollments?.find((e) => e.status === 'active') ?? student.enrollments?.[0];

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

  const activities = [
    {
      id: 'act-3',
      title: `Student status updated to '${student.status}'`,
      description: `Student management status updated manually by administrator.`,
      timestamp: student.updatedAt,
    },
    ...(activeEnrollment
      ? [
          {
            id: 'act-2',
            title: `Enrolled in ${activeEnrollment.section?.class?.name ?? 'Class'} - Section ${activeEnrollment.section?.name ?? 'A'}`,
            description: `Assigned roll number ${activeEnrollment.rollNumber} for the ${activeEnrollment.academicYear?.name ?? 'current'} academic year.`,
            timestamp: activeEnrollment.enrollmentDate,
          },
        ]
      : []),
    {
      id: 'act-1',
      title: 'Student profile created',
      description: `Admission profile recorded under admission number ${student.admissionNumber}.`,
      timestamp: student.createdAt,
    },
  ];

  return (
    <Card className="text-left select-none">
      <CardBody className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Activity History
            </h3>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
              Logs of system updates and administrative actions
            </span>
          </div>
        </div>

        <div className="relative border-l border-slate-200 dark:border-white/5 pl-6 ml-4 space-y-6">
          {activities.map((act) => (
            <div key={act.id} className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-slate-900 shadow-sm" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {act.title}
                </h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {act.description}
                </p>
                <span className="text-2xs font-bold text-slate-400 dark:text-slate-500 mt-2 block">
                  {formatDate(act.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
