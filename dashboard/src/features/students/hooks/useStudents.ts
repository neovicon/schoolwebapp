import { useQuery } from '@tanstack/react-query';
import { studentsService } from '../services/students.service';
import type { StudentListParams } from '../../../types/student.types';

export function useStudentsList(params: StudentListParams) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentsService.getStudents(params),
    placeholderData: (prev) => prev, // Keeps list visible during fetching next page/filters
  });
}

export function useStudent(documentId: string | undefined) {
  return useQuery({
    queryKey: ['student', documentId],
    queryFn: () => studentsService.getStudentById(documentId!),
    enabled: !!documentId,
  });
}

export function useAcademicYears(schoolDocumentId?: string) {
  return useQuery({
    queryKey: ['academic-years', schoolDocumentId],
    queryFn: () => studentsService.getAcademicYears(schoolDocumentId),
  });
}

export function useClasses(schoolDocumentId?: string) {
  return useQuery({
    queryKey: ['classes', schoolDocumentId],
    queryFn: () => studentsService.getClasses(schoolDocumentId),
  });
}

export function useSections(classDocumentId?: string, academicYearDocumentId?: string) {
  return useQuery({
    queryKey: ['sections', classDocumentId, academicYearDocumentId],
    queryFn: () => studentsService.getSections(classDocumentId, academicYearDocumentId),
    enabled: !!classDocumentId, // Optional: only load if class is selected, or we can load all. Let's make it load always if class is not restricted, but usually we filter sections by class.
  });
}

export function useGlobalStudentSearch(searchTerm: string) {
  return useQuery({
    queryKey: ['students-global-search', searchTerm],
    queryFn: () => studentsService.globalSearch(searchTerm),
    enabled: searchTerm.trim().length >= 2,
    staleTime: 1000 * 30, // 30s cache
  });
}
