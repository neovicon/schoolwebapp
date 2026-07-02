import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Calendar, BookOpenCheck } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  useSubjects,
  useClasses,
  useAcademicYears,
  useSections,
} from '../hooks/useTeachers';
import {
  useAddTeachingAssignment,
  useRemoveTeachingAssignment,
} from '../hooks/useTeacherMutations';
import type { TeacherProfile } from '../../../types/teacher.types';

interface TeacherAssignmentsProps {
  teacher: TeacherProfile;
}

export function TeacherAssignments({ teacher }: TeacherAssignmentsProps) {
  const addMutation = useAddTeachingAssignment(teacher.documentId);
  const removeMutation = useRemoveTeachingAssignment(teacher.documentId);

  // Metadata loaders
  const { data: subjects = [] } = useSubjects();
  const { data: classes = [] } = useClasses();
  const { data: academicYears = [] } = useAcademicYears();

  // Form State
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');

  // Dynamically load sections
  const { data: sections = [] } = useSections(
    selectedClass || undefined,
    selectedAcademicYear || undefined
  );

  // Pre-fill active academic year
  useEffect(() => {
    if (academicYears.length > 0) {
      const currentYear = academicYears.find((y) => y.isCurrent);
      if (currentYear) {
        setSelectedAcademicYear(currentYear.documentId);
      }
    }
  }, [academicYears]);

  // Handle section reset on class change
  useEffect(() => {
    setSelectedSection('');
  }, [selectedClass]);

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !selectedSection || !selectedAcademicYear) return;

    try {
      await addMutation.mutateAsync({
        subjectDocumentId: selectedSubject,
        sectionDocumentId: selectedSection,
        academicYearDocumentId: selectedAcademicYear,
      });
      // Clear fields on success
      setSelectedSubject('');
      setSelectedClass('');
      setSelectedSection('');
    } catch (err) {
      console.error('Failed to add assignment', err);
    }
  };

  const handleRemoveAssignment = async (docId: string) => {
    if (window.confirm('Are you sure you want to remove this teaching assignment?')) {
      try {
        await removeMutation.mutateAsync(docId);
      } catch (err) {
        console.error('Failed to remove assignment', err);
      }
    }
  };

  const assignments = teacher.teachingAssignments || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none text-left">
      {/* List of current assignments */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="h-full">
          <CardHeader className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
                Active Placements
              </h3>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
                Classroom and subjects mapping assignments
              </span>
            </div>
            <Badge variant="primary" className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
              {assignments.length} total
            </Badge>
          </CardHeader>

          <CardBody className="p-0 overflow-hidden">
            {assignments.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/10">
                <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-700 dark:text-slate-350">
                  No Placements Assigned
                </p>
                <p className="text-xs text-slate-450 dark:text-slate-550 max-w-sm mx-auto mt-1.5 leading-relaxed">
                  This teacher currently doesn't have any subjects or sections assigned. Use the panel on the right to assign them.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
                      <th className="py-4.5 px-6 text-xs font-extrabold uppercase text-slate-450 dark:text-slate-500 tracking-wider">Subject</th>
                      <th className="py-4.5 px-6 text-xs font-extrabold uppercase text-slate-450 dark:text-slate-500 tracking-wider">Class / Section</th>
                      <th className="py-4.5 px-6 text-xs font-extrabold uppercase text-slate-450 dark:text-slate-500 tracking-wider">Academic Year</th>
                      <th className="py-4.5 px-6 text-xs font-extrabold uppercase text-slate-450 dark:text-slate-500 tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {assignments.map((item) => (
                      <tr key={item.documentId} className="hover:bg-slate-50/55 dark:hover:bg-white/2 transition-colors">
                        <td className="py-4.5 px-6">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {item.subject?.name}
                          </p>
                          <p className="text-xs font-semibold text-slate-450 dark:text-slate-500 mt-0.5">
                            Code: {item.subject?.code}
                          </p>
                        </td>
                        <td className="py-4.5 px-6">
                          <p className="text-sm font-bold text-slate-850 dark:text-slate-200">
                            {item.section?.class?.name || '—'}
                          </p>
                          <p className="text-xs font-bold text-primary-500 dark:text-primary-400 mt-0.5">
                            Section: {item.section?.name || '—'}
                          </p>
                        </td>
                        <td className="py-4.5 px-6">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-650 dark:text-slate-350">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {item.academicYear?.name}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleRemoveAssignment(item.documentId)}
                            isLoading={removeMutation.isPending && removeMutation.variables === item.documentId}
                            className="p-2 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Add New Assignment Form */}
      <div>
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-650 dark:text-primary-400 rounded-xl">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
                Assign Placement
              </h3>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
                Map a new subject, class, and section
              </span>
            </div>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <Select
                label="Subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((sub) => (
                  <option key={sub.documentId} value={sub.documentId}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </Select>

              <Select
                label="Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.documentId} value={cls.documentId}>
                    {cls.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass}
                required
              >
                <option value="">Select Section</option>
                {sections.map((sec) => (
                  <option key={sec.documentId} value={sec.documentId}>
                    {sec.name} {sec.room ? `(${sec.room})` : ''}
                  </option>
                ))}
              </Select>

              <Select
                label="Academic Year"
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                required
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((ay) => (
                  <option key={ay.documentId} value={ay.documentId}>
                    {ay.name} {ay.isCurrent ? '(Current)' : ''}
                  </option>
                ))}
              </Select>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4"
                isLoading={addMutation.isPending}
                leftIcon={<Plus className="w-4 h-4" />}
                disabled={!selectedSubject || !selectedSection || !selectedAcademicYear}
              >
                Assign Teacher
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
