import { useQuery } from '@tanstack/react-query';
import { teachersService } from '../services/teachers.service';
import type { TeacherListParams } from '../../../types/teacher.types';

export function useTeachersList(params: TeacherListParams) {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => teachersService.getTeachers(params),
    placeholderData: (prev) => prev, // Keeps list visible during fetching next page/filters
  });
}

export function useTeacher(documentId: string | undefined) {
  return useQuery({
    queryKey: ['teacher', documentId],
    queryFn: () => teachersService.getTeacherById(documentId!),
    enabled: !!documentId,
  });
}

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: () => teachersService.getSubjects(),
  });
}

export function useAcademicYears(schoolDocumentId?: string) {
  return useQuery({
    queryKey: ['academic-years', schoolDocumentId],
    queryFn: () => teachersService.getAcademicYears(schoolDocumentId),
  });
}

export function useClasses(schoolDocumentId?: string) {
  return useQuery({
    queryKey: ['classes', schoolDocumentId],
    queryFn: () => teachersService.getClasses(schoolDocumentId),
  });
}

export function useSections(classDocumentId?: string, academicYearDocumentId?: string) {
  return useQuery({
    queryKey: ['sections', classDocumentId, academicYearDocumentId],
    queryFn: () => teachersService.getSections(classDocumentId, academicYearDocumentId),
    enabled: !!classDocumentId,
  });
}
