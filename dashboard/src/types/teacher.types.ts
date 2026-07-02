import type { AcademicYear, Section, SchoolClass } from './student.types';

export type TeacherStatus = 'active' | 'on_leave' | 'retired' | 'resigned' | 'archived';
export type TeacherGender = 'male' | 'female' | 'other';

export interface Subject {
  id: number;
  documentId: string;
  name: string;
  code: string;
  description?: string;
  class?: SchoolClass;
}

export interface TeachingAssignment {
  id: number;
  documentId: string;
  status: 'active' | 'inactive';
  subject?: Subject;
  section?: Section & { class?: SchoolClass };
  academicYear?: AcademicYear;
}

export interface TeacherProfile {
  id: number;
  documentId: string;
  employeeId: string;
  phoneNumber: string;
  qualification?: string;
  joiningDate?: string;
  status: TeacherStatus;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: TeacherGender;
  bloodGroup?: string;
  address?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  school?: {
    id: number;
    documentId: string;
    name: string;
    code: string;
  };
  teacher?: {
    id: number;
    documentId: string;
    name: string;
    email?: string;
    bio?: string;
    photo?: {
      url: string;
    };
    subject?: string;
  };
  teachingAssignments?: TeachingAssignment[];
}

export interface TeacherListItem {
  id: number;
  documentId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  status: TeacherStatus;
  gender?: TeacherGender;
  phoneNumber: string;
  email?: string;
  qualification?: string;
  mainSubject?: string;
}

export interface TeacherListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: TeacherStatus | '';
  sectionDocumentId?: string;
  academicYearDocumentId?: string;
  subjectDocumentId?: string;
}

export interface CreateTeacherPayload {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  gender?: TeacherGender;
  bloodGroup?: string;
  address?: string;

  // Professional Info
  employeeId: string;
  qualification?: string;
  joiningDate?: string;
  status?: TeacherStatus;

  // Teaching Assignments
  assignments?: Array<{
    subjectDocumentId: string;
    sectionDocumentId: string;
    academicYearDocumentId: string;
  }>;

  // Relations
  schoolDocumentId?: string;
}

export interface UpdateTeacherPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: TeacherGender;
  bloodGroup?: string;
  address?: string;
  qualification?: string;
  joiningDate?: string;
  status?: TeacherStatus;
}
