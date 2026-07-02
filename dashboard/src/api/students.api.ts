import apiClient from './client';
import type {
  AcademicYear,
  SchoolClass,
  Section,
  StudentProfile,
  StudentListItem,
  StrapiListResponse,
  StrapiSingleResponse,
  StudentListParams,
  CreateStudentPayload,
  UpdateStudentPayload,
} from '../types/student.types';

// ─── Strapi query helpers ─────────────────────────────────────────────────────

/**
 * Converts a StudentProfile from Strapi (with nested enrollments)
 * into a flat StudentListItem for table rendering.
 */
function toListItem(profile: StudentProfile): StudentListItem {
  const activeEnrollment = profile.enrollments?.find((e) => e.status === 'active') ?? profile.enrollments?.[0];

  return {
    id: profile.id,
    documentId: profile.documentId,
    admissionNumber: profile.admissionNumber,
    firstName: profile.firstName,
    lastName: profile.lastName,
    fullName: `${profile.firstName} ${profile.lastName}`,
    status: profile.status,
    gender: profile.gender,
    phone: profile.phone,
    currentEnrollment: activeEnrollment
      ? {
          rollNumber: activeEnrollment.rollNumber,
          enrollmentDate: activeEnrollment.enrollmentDate,
          className: activeEnrollment.section?.class?.name ?? '—',
          sectionName: activeEnrollment.section?.name ?? '—',
          academicYear: activeEnrollment.academicYear?.name ?? '—',
        }
      : undefined,
  };
}

// ─── Students API ─────────────────────────────────────────────────────────────

export const studentsApi = {
  /**
   * Lists students with filtering and pagination.
   * Strapi: GET /api/student-profiles
   */
  async list(params: StudentListParams = {}): Promise<{ data: StudentListItem[]; total: number; page: number; pageCount: number }> {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      status,
      sectionDocumentId,
      academicYearDocumentId,
    } = params;

    // Build Strapi query params
    const query: Record<string, unknown> = {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'populate[enrollments][populate][section][populate][class]': 'true',
      'populate[enrollments][populate][academicYear]': 'true',
      'populate[school]': 'true',
      'sort[0]': 'createdAt:desc',
    };

    if (search.trim()) {
      query['filters[$or][0][firstName][$containsi]'] = search;
      query['filters[$or][1][lastName][$containsi]'] = search;
      query['filters[$or][2][admissionNumber][$containsi]'] = search;
    }

    if (status) {
      query['filters[status][$eq]'] = status;
    }

    if (sectionDocumentId) {
      query['filters[enrollments][section][documentId][$eq]'] = sectionDocumentId;
    }

    if (academicYearDocumentId) {
      query['filters[enrollments][academicYear][documentId][$eq]'] = academicYearDocumentId;
    }

    const { data } = await apiClient.get<StrapiListResponse<StudentProfile>>('/student-profiles', { params: query });
    const pagination = data.meta.pagination!;

    return {
      data: data.data.map(toListItem),
      total: pagination.total,
      page: pagination.page,
      pageCount: pagination.pageCount,
    };
  },

  /**
   * Fetches a single student with full population.
   * Strapi: GET /api/student-profiles/:documentId
   */
  async getById(documentId: string): Promise<StudentProfile> {
    const { data } = await apiClient.get<StrapiSingleResponse<StudentProfile>>(
      `/student-profiles/${documentId}`,
      {
        params: {
          'populate[enrollments][populate][section][populate][class]': 'true',
          'populate[enrollments][populate][academicYear]': 'true',
          'populate[school]': 'true',
          'populate[user]': 'true',
        },
      }
    );
    return data.data;
  },

  /**
   * Creates a student profile, then creates an enrollment.
   * Strapi: POST /api/student-profiles  →  POST /api/enrollments
   */
  async create(payload: CreateStudentPayload): Promise<StudentProfile> {
    // Step 1: Create Student Profile
    const profilePayload = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      dateOfBirth: payload.dateOfBirth,
      gender: payload.gender,
      bloodGroup: payload.bloodGroup,
      phone: payload.phone,
      address: payload.address,
      emergencyContact: payload.emergencyContact,
      admissionNumber: payload.admissionNumber,
      status: 'active',
      school: payload.schoolDocumentId,
      publishedAt: new Date().toISOString(),
    };

    const { data: profileResponse } = await apiClient.post<StrapiSingleResponse<StudentProfile>>(
      '/student-profiles',
      { data: profilePayload }
    );

    const createdProfile = profileResponse.data;

    // Step 2: Create Enrollment
    await apiClient.post('/enrollments', {
      data: {
        rollNumber: payload.rollNumber,
        enrollmentDate: payload.enrollmentDate,
        status: 'active',
        studentProfile: createdProfile.documentId,
        section: payload.sectionDocumentId,
        academicYear: payload.academicYearDocumentId,
      },
    });

    return createdProfile;
  },

  /**
   * Updates student profile fields.
   * Strapi: PUT /api/student-profiles/:documentId
   */
  async update(documentId: string, payload: UpdateStudentPayload): Promise<StudentProfile> {
    const { data } = await apiClient.put<StrapiSingleResponse<StudentProfile>>(
      `/student-profiles/${documentId}`,
      { data: payload }
    );
    return data.data;
  },

  /**
   * Archives a student (sets status to 'suspended' — soft archive).
   */
  async archive(documentId: string): Promise<StudentProfile> {
    return studentsApi.update(documentId, { status: 'suspended' });
  },

  /**
   * Restores an archived/suspended student to 'active'.
   */
  async restore(documentId: string): Promise<StudentProfile> {
    return studentsApi.update(documentId, { status: 'active' });
  },
};

// ─── Academic Year API ────────────────────────────────────────────────────────

export const academicYearsApi = {
  /**
   * Lists all academic years.
   * Strapi: GET /api/academic-years
   */
  async list(schoolDocumentId?: string): Promise<AcademicYear[]> {
    const params: Record<string, unknown> = {
      'sort[0]': 'startDate:desc',
      'pagination[pageSize]': 50,
    };
    if (schoolDocumentId) {
      params['filters[school][documentId][$eq]'] = schoolDocumentId;
    }
    const { data } = await apiClient.get<StrapiListResponse<AcademicYear>>('/academic-years', { params });
    return data.data;
  },
};

// ─── Classes API ──────────────────────────────────────────────────────────────

export const classesApi = {
  /**
   * Lists all classes.
   * Strapi: GET /api/classes
   */
  async list(schoolDocumentId?: string): Promise<SchoolClass[]> {
    const params: Record<string, unknown> = {
      'sort[0]': 'level:asc',
      'pagination[pageSize]': 100,
    };
    if (schoolDocumentId) {
      params['filters[school][documentId][$eq]'] = schoolDocumentId;
    }
    const { data } = await apiClient.get<StrapiListResponse<SchoolClass>>('/classes', { params });
    return data.data;
  },
};

// ─── Sections API ─────────────────────────────────────────────────────────────

export const sectionsApi = {
  /**
   * Lists sections, optionally filtered by class documentId.
   * Strapi: GET /api/sections
   */
  async list(classDocumentId?: string, academicYearDocumentId?: string): Promise<Section[]> {
    const params: Record<string, unknown> = {
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 100,
      'populate[class]': 'true',
      'populate[academicYear]': 'true',
    };
    if (classDocumentId) {
      params['filters[class][documentId][$eq]'] = classDocumentId;
    }
    if (academicYearDocumentId) {
      params['filters[academicYear][documentId][$eq]'] = academicYearDocumentId;
    }
    const { data } = await apiClient.get<StrapiListResponse<Section>>('/sections', { params });
    return data.data;
  },
};
