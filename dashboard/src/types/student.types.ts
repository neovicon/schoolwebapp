// ─── Strapi v5 Generic Types ─────────────────────────────────────────────────

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

// ─── Academic Year ────────────────────────────────────────────────────────────

export interface AcademicYear {
  id: number;
  documentId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

// ─── Class ───────────────────────────────────────────────────────────────────

export interface SchoolClass {
  id: number;
  documentId: string;
  name: string;
  code: string;
  level: number;
  sections?: Section[];
}

// ─── Section ─────────────────────────────────────────────────────────────────

export interface Section {
  id: number;
  documentId: string;
  name: string;
  room?: string;
  capacity?: number;
  class?: SchoolClass;
  academicYear?: AcademicYear;
}

// ─── Enrollment ───────────────────────────────────────────────────────────────

export type EnrollmentStatus = 'active' | 'withdrawn';

export interface Enrollment {
  id: number;
  documentId: string;
  rollNumber: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
  section?: Section & { class?: SchoolClass };
  academicYear?: AcademicYear;
}

// ─── Student Profile ──────────────────────────────────────────────────────────

export type StudentStatus = 'active' | 'suspended' | 'graduated' | 'transferred' | 'archived';
export type StudentGender = 'male' | 'female' | 'other';

export interface StudentProfile {
  id: number;
  documentId: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: StudentGender;
  bloodGroup?: string;
  address?: string;
  phone?: string;
  emergencyContact?: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  school?: {
    id: number;
    documentId: string;
    name: string;
    code: string;
  };
  enrollments?: Enrollment[];
  user?: {
    id: number;
    email: string;
  };
}

// ─── Derived / View Types ────────────────────────────────────────────────────

/** Convenience type for the student list, with current enrollment pre-resolved */
export interface StudentListItem {
  id: number;
  documentId: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  status: StudentStatus;
  gender?: StudentGender;
  phone?: string;
  currentEnrollment?: {
    rollNumber: string;
    enrollmentDate: string;
    className: string;
    sectionName: string;
    academicYear: string;
  };
}

// ─── API Request Types ────────────────────────────────────────────────────────

export interface StudentListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: StudentStatus | '';
  classDocumentId?: string;
  sectionDocumentId?: string;
  academicYearDocumentId?: string;
}

export interface CreateStudentPayload {
  // Personal info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: StudentGender;
  bloodGroup?: string;

  // Contact info
  phone?: string;
  address?: string;
  emergencyContact: string;

  // Admission
  admissionNumber: string;

  // Enrollment
  rollNumber: string;
  enrollmentDate: string;
  sectionDocumentId: string;
  academicYearDocumentId: string;

  // Relations
  schoolDocumentId?: string;
}

export interface UpdateStudentPayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: StudentGender;
  bloodGroup?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  status?: StudentStatus;
}
