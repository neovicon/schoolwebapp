import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Users, X } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Pagination } from '../../../components/ui/Pagination';
import { DataTable } from '../../../components/dashboard/DataTable';
import type { Column } from '../../../components/dashboard/DataTable';
import {
  useTeachersList,
  useClasses,
  useAcademicYears,
  useSections,
  useSubjects,
} from '../hooks/useTeachers';
import type { TeacherListItem, TeacherStatus } from '../../../types/teacher.types';

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

export function TeachersPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TeacherStatus | ''>('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // 1. Fetch Filter Metadata
  const { data: classes = [] } = useClasses();
  const { data: academicYears = [] } = useAcademicYears();
  const { data: subjects = [] } = useSubjects();
  const { data: sections = [] } = useSections(
    selectedClass || undefined,
    selectedAcademicYear || undefined
  );

  // 2. Fetch Teachers List
  const { data, isLoading } = useTeachersList({
    page,
    pageSize,
    search,
    status,
    sectionDocumentId: selectedSection || undefined,
    academicYearDocumentId: selectedAcademicYear || undefined,
    subjectDocumentId: selectedSubject || undefined,
  });

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setSelectedSection(''); // Reset section when class changes
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setSelectedClass('');
    setSelectedSection('');
    setSelectedAcademicYear('');
    setSelectedSubject('');
    setPage(1);
  };

  // 3. Define Table Columns
  const columns: Column<TeacherListItem>[] = [
    {
      header: 'Teacher Info',
      accessorKey: 'fullName',
      render: (row) => (
        <div className="flex flex-col text-left select-none">
          <span className="font-extrabold text-slate-900 dark:text-white leading-snug">
            {row.fullName}
          </span>
          <span className="text-2xs font-semibold text-slate-450 dark:text-slate-500 mt-0.5">
            ID: {row.employeeId}
          </span>
        </div>
      ),
    },
    {
      header: 'Qualifications',
      accessorKey: 'qualification',
      render: (row) => (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-350">
          {row.qualification || '—'}
        </span>
      ),
    },
    {
      header: 'Email / Phone',
      accessorKey: 'email',
      render: (row) => (
        <div className="flex flex-col text-left select-none">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {row.email || '—'}
          </span>
          <span className="text-2xs text-slate-400 dark:text-slate-500 mt-0.5">
            {row.phoneNumber || '—'}
          </span>
        </div>
      ),
    },
    {
      header: 'Employment Status',
      accessorKey: 'status',
      align: 'center',
      render: (row) => (
        <Badge variant={STATUS_VARIANTS[row.status]} className="text-3xs font-extrabold uppercase px-2.5 py-0.5 tracking-wider">
          {STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'documentId',
      align: 'right',
      render: (row) => (
        <Link to={`/admin/teachers/${row.documentId}`}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="w-4 h-4" />}
            className="hover:text-primary-600 dark:hover:text-primary-400"
          >
            View Profile
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Teacher Directory
          </h2>
          <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-0.5 block">
            Search, filter and manage professional records for all faculty staff
          </span>
        </div>

        <Link to="/admin/teachers/create">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4.5 h-4.5" />}
          >
            Add Teacher
          </Button>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm select-none">
        
        {/* Search */}
        <div className="lg:col-span-1">
          <Input
            placeholder="Search by name, ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Academic Year Filter */}
        <Select
          value={selectedAcademicYear}
          onChange={(e) => {
            setSelectedAcademicYear(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Academic Years</option>
          {academicYears.map((ay) => (
            <option key={ay.documentId} value={ay.documentId}>
              {ay.name} {ay.isCurrent ? '(Current)' : ''}
            </option>
          ))}
        </Select>

        {/* Class Filter */}
        <Select
          value={selectedClass}
          onChange={handleClassChange}
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c.documentId} value={c.documentId}>
              {c.name}
            </option>
          ))}
        </Select>

        {/* Section Filter */}
        <Select
          value={selectedSection}
          disabled={!selectedClass}
          onChange={(e) => {
            setSelectedSection(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Sections</option>
          {sections.map((s) => (
            <option key={s.documentId} value={s.documentId}>
              {s.name} {s.room ? `(${s.room})` : ''}
            </option>
          ))}
        </Select>

        {/* Subject Filter */}
        <Select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub.documentId} value={sub.documentId}>
              {sub.name} ({sub.code})
            </option>
          ))}
        </Select>

        {/* Status Filter */}
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as TeacherStatus | '');
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {/* Clear Filters Indicator */}
      {(search || status || selectedClass || selectedSection || selectedAcademicYear || selectedSubject) && (
        <div className="flex justify-end select-none">
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-650 dark:text-red-400 hover:underline cursor-pointer border-none bg-transparent"
          >
            <X className="w-3.5 h-3.5" />
            Clear Active Filters
          </button>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyState={{
          title: 'No teachers found',
          description: 'Try adjusting your search criteria or filter options.',
          icon: <Users className="w-8 h-8 text-slate-450" />,
        }}
      />

      {/* Pagination */}
      {data && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={data.total}
          onChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
}
