import { teachersApi, subjectsApi } from '../../../api/teachers.api';
import { academicYearsApi, classesApi, sectionsApi } from '../../../api/students.api';
import type {
  TeacherProfile,
  TeacherListParams,
  CreateTeacherPayload,
  UpdateTeacherPayload,
  Subject,
  TeachingAssignment,
} from '../../../types/teacher.types';
import type {
  AcademicYear,
  SchoolClass,
  Section,
} from '../../../types/student.types';

export const teachersService = {
  /**
   * Retrieves a paginated and filtered list of teacher list items.
   */
  async getTeachers(params: TeacherListParams) {
    return teachersApi.list(params);
  },

  /**
   * Retrieves a single teacher profile by its document ID.
   */
  async getTeacherById(documentId: string): Promise<TeacherProfile> {
    return teachersApi.getById(documentId);
  },

  /**
   * Creates a new teacher profile and sets up initial assignments.
   */
  async createTeacher(payload: CreateTeacherPayload): Promise<TeacherProfile> {
    return teachersApi.create(payload);
  },

  /**
   * Updates an existing teacher profile.
   */
  async updateTeacher(documentId: string, payload: UpdateTeacherPayload): Promise<TeacherProfile> {
    return teachersApi.update(documentId, payload);
  },

  /**
   * Soft-archives a teacher profile by setting its status to 'archived'.
   */
  async archiveTeacher(documentId: string): Promise<TeacherProfile> {
    return teachersApi.update(documentId, { status: 'archived' });
  },

  /**
   * Restores a teacher profile to 'active'.
   */
  async restoreTeacher(documentId: string): Promise<TeacherProfile> {
    return teachersApi.update(documentId, { status: 'active' });
  },

  /**
   * Adds a teaching assignment to a teacher.
   */
  async addAssignment(assignment: {
    teacherProfileDocumentId: string;
    subjectDocumentId: string;
    sectionDocumentId: string;
    academicYearDocumentId: string;
  }): Promise<TeachingAssignment> {
    return teachersApi.addAssignment(assignment);
  },

  /**
   * Removes a teaching assignment.
   */
  async removeAssignment(assignmentDocumentId: string): Promise<void> {
    return teachersApi.removeAssignment(assignmentDocumentId);
  },

  /**
   * Fetches subjects collection.
   */
  async getSubjects(): Promise<Subject[]> {
    return subjectsApi.list();
  },

  /**
   * Fetches metadata collections.
   */
  async getAcademicYears(schoolDocumentId?: string): Promise<AcademicYear[]> {
    return academicYearsApi.list(schoolDocumentId);
  },

  async getClasses(schoolDocumentId?: string): Promise<SchoolClass[]> {
    return classesApi.list(schoolDocumentId);
  },

  async getSections(classDocumentId?: string, academicYearDocumentId?: string): Promise<Section[]> {
    return sectionsApi.list(classDocumentId, academicYearDocumentId);
  },
};
