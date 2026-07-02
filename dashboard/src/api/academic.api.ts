// Academic API client for frontend
import apiClient from '../api/client';
import type {
  AcademicYear,
  Class,
  Section,
  Subject,
  TeachingAssignment,
} from '../types/academic.types';
import type { StrapiListResponse, StrapiSingleResponse } from '../types/student.types';

// ─── Academic Years ────────────────────────────────────────────────────────
export const academicYearsApi = {
  async list(): Promise<AcademicYear[]> {
    const { data } = await apiClient.get<StrapiListResponse<AcademicYear>>('/academic-years', {
      params: { 'pagination[pageSize]': 100, sort: 'startDate:desc' },
    });
    return data.data.map((item) => item.attributes as AcademicYear);
  },
  async getById(id: string): Promise<AcademicYear> {
    const { data } = await apiClient.get<StrapiSingleResponse<AcademicYear>>(
      `/academic-years/${id}`,
      { params: { populate: '*'} }
    );
    return data.data.attributes as AcademicYear;
  },
  async create(payload: Partial<AcademicYear>): Promise<AcademicYear> {
    const { data } = await apiClient.post<StrapiSingleResponse<AcademicYear>>(
      '/academic-years',
      { data: payload }
    );
    return data.data.attributes as AcademicYear;
  },
  async update(id: string, payload: Partial<AcademicYear>) {
    const { data } = await apiClient.put<StrapiSingleResponse<AcademicYear>>(
      `/academic-years/${id}`,
      { data: payload }
    );
    return data.data.attributes as AcademicYear;
  },
  async delete(id: string) {
    await apiClient.delete(`/academic-years/${id}`);
  },
};

// ─── Classes ────────────────────────────────────────────────────────────────
export const classesApi = {
  async list(): Promise<Class[]> {
    const { data } = await apiClient.get<StrapiListResponse<Class>>('/classes', {
      params: { 'pagination[pageSize]': 200, sort: 'name:asc' },
    });
    return data.data.map((item) => item.attributes as Class);
  },
  async getById(id: string) {
    const { data } = await apiClient.get<StrapiSingleResponse<Class>>(
      `/classes/${id}`,
      { params: { populate: '*'} }
    );
    return data.data.attributes as Class;
  },
  async create(payload: Partial<Class>) {
    const { data } = await apiClient.post<StrapiSingleResponse<Class>>('/classes', { data: payload });
    return data.data.attributes as Class;
  },
  async update(id: string, payload: Partial<Class>) {
    const { data } = await apiClient.put<StrapiSingleResponse<Class>>(`/classes/${id}`, { data: payload });
    return data.data.attributes as Class;
  },
  async delete(id: string) { await apiClient.delete(`/classes/${id}`); },
};

// ─── Sections ────────────────────────────────────────────────────────────────
export const sectionsApi = {
  async list(): Promise<Section[]> {
    const { data } = await apiClient.get<StrapiListResponse<Section>>('/sections', {
      params: { 'pagination[pageSize]': 200, sort: 'name:asc' },
    });
    return data.data.map((item) => item.attributes as Section);
  },
  async getById(id: string) {
    const { data } = await apiClient.get<StrapiSingleResponse<Section>>(
      `/sections/${id}`,
      { params: { populate: '*'} }
    );
    return data.data.attributes as Section;
  },
  async create(payload: Partial<Section>) {
    const { data } = await apiClient.post<StrapiSingleResponse<Section>>('/sections', { data: payload });
    return data.data.attributes as Section;
  },
  async update(id: string, payload: Partial<Section>) {
    const { data } = await apiClient.put<StrapiSingleResponse<Section>>(`/sections/${id}`, { data: payload });
    return data.data.attributes as Section;
  },
  async delete(id: string) { await apiClient.delete(`/sections/${id}`); },
};

// ─── Subjects ────────────────────────────────────────────────────────────────
export const subjectsApi = {
  async list(): Promise<Subject[]> {
    const { data } = await apiClient.get<StrapiListResponse<Subject>>('/subjects', {
      params: { 'pagination[pageSize]': 200, sort: 'name:asc' },
    });
    return data.data.map((item) => item.attributes as Subject);
  },
  async getById(id: string) {
    const { data } = await apiClient.get<StrapiSingleResponse<Subject>>(
      `/subjects/${id}`,
      { params: { populate: '*'} }
    );
    return data.data.attributes as Subject;
  },
  async create(payload: Partial<Subject>) {
    const { data } = await apiClient.post<StrapiSingleResponse<Subject>>('/subjects', { data: payload });
    return data.data.attributes as Subject;
  },
  async update(id: string, payload: Partial<Subject>) {
    const { data } = await apiClient.put<StrapiSingleResponse<Subject>>(`/subjects/${id}`, { data: payload });
    return data.data.attributes as Subject;
  },
  async delete(id: string) { await apiClient.delete(`/subjects/${id}`); },
};

// ─── Teaching Assignments ────────────────────────────────────────────────────
export const teachingAssignmentsApi = {
  async list(): Promise<TeachingAssignment[]> {
    const { data } = await apiClient.get<StrapiListResponse<TeachingAssignment>>('/teaching-assignments', {
      params: { 'pagination[pageSize]': 500, populate: '*'} },
    );
    return data.data.map((item) => item.attributes as TeachingAssignment);
  },
  async create(payload: Partial<TeachingAssignment>) {
    const { data } = await apiClient.post<StrapiSingleResponse<TeachingAssignment>>('/teaching-assignments', { data: payload });
    return data.data.attributes as TeachingAssignment;
  },
  async update(id: string, payload: Partial<TeachingAssignment>) {
    const { data } = await apiClient.put<StrapiSingleResponse<TeachingAssignment>>(`/teaching-assignments/${id}`, { data: payload });
    return data.data.attributes as TeachingAssignment;
  },
  async delete(id: string) { await apiClient.delete(`/teaching-assignments/${id}`); },
};
