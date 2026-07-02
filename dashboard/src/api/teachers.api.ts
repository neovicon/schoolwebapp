import apiClient from './client';
import type {
  TeacherProfile,
  TeacherListItem,
  TeacherListParams,
  CreateTeacherPayload,
  UpdateTeacherPayload,
  Subject,
  TeachingAssignment,
} from '../types/teacher.types';
import type {
  StrapiListResponse,
  StrapiSingleResponse,
} from '../types/student.types';

// ─── Query Helpers ─────────────────────────────────────────────────────────────

function toListItem(profile: TeacherProfile): TeacherListItem {
  return {
    id: profile.id,
    documentId: profile.documentId,
    employeeId: profile.employeeId,
    firstName: profile.firstName,
    lastName: profile.lastName,
    fullName: `${profile.firstName} ${profile.lastName}`,
    status: profile.status,
    gender: profile.gender,
    phoneNumber: profile.phoneNumber,
    email: profile.email,
    qualification: profile.qualification,
    mainSubject: profile.teacher?.subject || '—',
  };
}

// ─── Teachers API ─────────────────────────────────────────────────────────────

export const teachersApi = {
  /**
   * Lists teachers with filtering and pagination.
   * Strapi: GET /api/teacher-profiles
   */
  async list(params: TeacherListParams = {}): Promise<{ data: TeacherListItem[]; total: number; page: number; pageCount: number }> {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      status,
      sectionDocumentId,
      academicYearDocumentId,
      subjectDocumentId,
    } = params;

    // Build Strapi query params
    const query: Record<string, unknown> = {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'populate[teacher]': 'true',
      'populate[teachingAssignments][populate][subject]': 'true',
      'populate[school]': 'true',
      'sort[0]': 'createdAt:desc',
    };

    if (search.trim()) {
      query['filters[$or][0][firstName][$containsi]'] = search;
      query['filters[$or][1][lastName][$containsi]'] = search;
      query['filters[$or][2][employeeId][$containsi]'] = search;
    }

    if (status) {
      query['filters[status][$eq]'] = status;
    }

    if (sectionDocumentId) {
      query['filters[teachingAssignments][section][documentId][$eq]'] = sectionDocumentId;
    }

    if (academicYearDocumentId) {
      query['filters[teachingAssignments][academicYear][documentId][$eq]'] = academicYearDocumentId;
    }

    if (subjectDocumentId) {
      query['filters[teachingAssignments][subject][documentId][$eq]'] = subjectDocumentId;
    }

    const { data } = await apiClient.get<StrapiListResponse<TeacherProfile>>('/teacher-profiles', { params: query });
    const pagination = data.meta.pagination!;

    return {
      data: data.data.map(toListItem),
      total: pagination.total,
      page: pagination.page,
      pageCount: pagination.pageCount,
    };
  },

  /**
   * Fetches a single teacher with full population.
   * Strapi: GET /api/teacher-profiles/:documentId
   */
  async getById(documentId: string): Promise<TeacherProfile> {
    const { data } = await apiClient.get<StrapiSingleResponse<TeacherProfile>>(
      `/teacher-profiles/${documentId}`,
      {
        params: {
          'populate[teacher]': 'true',
          'populate[school]': 'true',
          'populate[user]': 'true',
          'populate[teachingAssignments][populate][subject]': 'true',
          'populate[teachingAssignments][populate][section][populate][class]': 'true',
          'populate[teachingAssignments][populate][academicYear]': 'true',
        },
      }
    );
    return data.data;
  },

  /**
   * Creates a teacher, teacher profile, and teaching assignments.
   * Strapi: POST /api/teachers → POST /api/teacher-profiles → POST /api/teaching-assignments
   */
  async create(payload: CreateTeacherPayload): Promise<TeacherProfile> {
    // Step 1: Create Public Teacher Entity
    const teacherPayload = {
      name: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      subject: payload.qualification || 'Teacher',
      bio: `${payload.qualification || 'Teacher'} at Westfield Academy.`,
      publishedAt: new Date().toISOString(),
    };

    const { data: teacherResponse } = await apiClient.post<StrapiSingleResponse<{ id: number; documentId: string; name: string }>>(
      '/teachers',
      { data: teacherPayload }
    );

    const createdTeacher = teacherResponse.data;

    // Step 2: Create Teacher Profile
    const profilePayload = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      dateOfBirth: payload.dateOfBirth,
      gender: payload.gender,
      bloodGroup: payload.bloodGroup,
      address: payload.address,
      employeeId: payload.employeeId,
      qualification: payload.qualification,
      joiningDate: payload.joiningDate,
      status: payload.status || 'active',
      teacher: createdTeacher.documentId,
      school: payload.schoolDocumentId,
      publishedAt: new Date().toISOString(),
    };

    const { data: profileResponse } = await apiClient.post<StrapiSingleResponse<TeacherProfile>>(
      '/teacher-profiles',
      { data: profilePayload }
    );

    const createdProfile = profileResponse.data;

    // Step 3: Create teaching assignments
    if (payload.assignments && payload.assignments.length > 0) {
      for (const assign of payload.assignments) {
        await apiClient.post('/teaching-assignments', {
          data: {
            status: 'active',
            teacherProfile: createdProfile.documentId,
            subject: assign.subjectDocumentId,
            section: assign.sectionDocumentId,
            academicYear: assign.academicYearDocumentId,
            publishedAt: new Date().toISOString(),
          },
        });
      }
    }

    return createdProfile;
  },

  /**
   * Updates an existing teacher profile and syncs public teacher.
   * Strapi: PUT /api/teacher-profiles/:documentId
   */
  async update(documentId: string, payload: UpdateTeacherPayload): Promise<TeacherProfile> {
    // 1. Get existing profile first to locate the related teacher document ID
    const current = await this.getById(documentId);

    // 2. Update Teacher Profile
    const { data: profileResponse } = await apiClient.put<StrapiSingleResponse<TeacherProfile>>(
      `/teacher-profiles/${documentId}`,
      { data: payload }
    );

    // 3. Sync Public Teacher
    if (current.teacher?.documentId) {
      const teacherPayload: Record<string, unknown> = {};
      if (payload.firstName || payload.lastName) {
        const fName = payload.firstName ?? current.firstName;
        const lName = payload.lastName ?? current.lastName;
        teacherPayload.name = `${fName} ${lName}`;
      }
      if (payload.email) {
        teacherPayload.email = payload.email;
      }
      if (payload.qualification) {
        teacherPayload.subject = payload.qualification;
      }

      if (Object.keys(teacherPayload).length > 0) {
        await apiClient.put(`/teachers/${current.teacher.documentId}`, {
          data: teacherPayload,
        });
      }
    }

    return profileResponse.data;
  },

  /**
   * Appends a new teaching assignment.
   */
  async addAssignment(assignment: {
    teacherProfileDocumentId: string;
    subjectDocumentId: string;
    sectionDocumentId: string;
    academicYearDocumentId: string;
  }): Promise<TeachingAssignment> {
    const { data } = await apiClient.post<StrapiSingleResponse<TeachingAssignment>>('/teaching-assignments', {
      data: {
        status: 'active',
        teacherProfile: assignment.teacherProfileDocumentId,
        subject: assignment.subjectDocumentId,
        section: assignment.sectionDocumentId,
        academicYear: assignment.academicYearDocumentId,
        publishedAt: new Date().toISOString(),
      },
    });
    return data.data;
  },

  /**
   * Deletes a teaching assignment.
   */
  async removeAssignment(assignmentDocumentId: string): Promise<void> {
    await apiClient.delete(`/teaching-assignments/${assignmentDocumentId}`);
  },
};

// ─── Subjects API ─────────────────────────────────────────────────────────────

export const subjectsApi = {
  /**
   * Lists all subjects.
   * Strapi: GET /api/subjects
   */
  async list(): Promise<Subject[]> {
    const params = {
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 100,
      'populate[class]': 'true',
    };
    const { data } = await apiClient.get<StrapiListResponse<Subject>>('/subjects', { params });
    return data.data;
  },
};
