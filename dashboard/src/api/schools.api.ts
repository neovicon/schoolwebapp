import apiClient from './client';

export interface School {
  id: string;
  name: string;
  address?: string;
  principalName?: string;
  studentCount?: number;
  teacherCount?: number;
  establishedYear?: number;
  logoUrl?: string;
}

// ─── Schools API ──────────────────────────────────────────────────────────────
// Strapi replacement: /api/schools

export const schoolsApi = {
  /**
   * Lists all schools (Super Admin only).
   * Strapi: GET /api/schools
   */
  async list(): Promise<School[]> {
    const { data } = await apiClient.get<School[]>('/schools');
    return data;
  },

  /**
   * Fetches a school by ID.
   * Strapi: GET /api/schools/:id
   */
  async getById(id: string): Promise<School> {
    const { data } = await apiClient.get<School>(`/schools/${id}`);
    return data;
  },

  /**
   * Creates a new school.
   * Strapi: POST /api/schools
   */
  async create(payload: Omit<School, 'id'>): Promise<School> {
    const { data } = await apiClient.post<School>('/schools', { data: payload });
    return data;
  },

  /**
   * Updates a school.
   * Strapi: PUT /api/schools/:id
   */
  async update(id: string, payload: Partial<School>): Promise<School> {
    const { data } = await apiClient.put<School>(`/schools/${id}`, { data: payload });
    return data;
  },
};
