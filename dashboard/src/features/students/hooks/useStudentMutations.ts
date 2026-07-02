import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { studentsService } from '../services/students.service';
import type { CreateStudentPayload, UpdateStudentPayload, StudentStatus } from '../../../types/student.types';

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateStudentPayload) => studentsService.createStudent(payload),
    onSuccess: (data) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // Redirect to newly created student's details page
      navigate(`/admin/students/${data.documentId}`);
    },
  });
}

export function useUpdateStudent(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStudentPayload) => studentsService.updateStudent(documentId, payload),
    onSuccess: () => {
      // Invalidate both details and list queries
      queryClient.invalidateQueries({ queryKey: ['student', documentId] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useUpdateStudentStatus(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: StudentStatus) => studentsService.updateStudent(documentId, { status }),
    onSuccess: () => {
      // Invalidate queries to reflect updated status
      queryClient.invalidateQueries({ queryKey: ['student', documentId] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}
