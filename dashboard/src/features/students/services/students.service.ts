import { studentsApi, academicYearsApi, classesApi, sectionsApi } from '../../../api/students.api';
import type {
  StudentListItem,
  StudentProfile,
  StudentListParams,
  CreateStudentPayload,
  UpdateStudentPayload,
  AcademicYear,
  SchoolClass,
  Section,
} from '../../../types/student.types';

export const studentsService = {
  /**
   * Retrieves a paginated and filtered list of student list items.
   */
  async getStudents(params: StudentListParams) {
    return studentsApi.list(params);
  },

  /**
   * Retrieves a single student profile by its document ID.
   */
  async getStudentById(documentId: string): Promise<StudentProfile> {
    return studentsApi.getById(documentId);
  },

  /**
   * Creates a new student profile and maps its initial enrollment.
   */
  async createStudent(payload: CreateStudentPayload): Promise<StudentProfile> {
    return studentsApi.create(payload);
  },

  /**
   * Updates an existing student profile.
   */
  async updateStudent(documentId: string, payload: UpdateStudentPayload): Promise<StudentProfile> {
    return studentsApi.update(documentId, payload);
  },

  /**
   * Soft-archives a student profile by setting its status to 'archived'.
   */
  async archiveStudent(documentId: string): Promise<StudentProfile> {
    return studentsApi.update(documentId, { status: 'archived' });
  },

  /**
   * Soft-archives a student profile as suspended.
   */
  async suspendStudent(documentId: string): Promise<StudentProfile> {
    return studentsApi.update(documentId, { status: 'suspended' });
  },

  /**
   * Restores a student profile to 'active'.
   */
  async restoreStudent(documentId: string): Promise<StudentProfile> {
    return studentsApi.update(documentId, { status: 'active' });
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

  /**
   * Performs global search across Name, Admission Number, Roll Number, and Phone.
   */
  async globalSearch(searchTerm: string): Promise<StudentListItem[]> {
    if (!searchTerm.trim()) return [];
    
    // Request a list using the search query with a higher pageSize for global quick search
    const results = await studentsApi.list({
      search: searchTerm,
      pageSize: 20,
    });
    return results.data;
  },
};
