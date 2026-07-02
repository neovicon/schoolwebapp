import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { teachersService } from '../services/teachers.service';
import type { CreateTeacherPayload, UpdateTeacherPayload, TeacherStatus } from '../../../types/teacher.types';

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateTeacherPayload) => teachersService.createTeacher(payload),
    onSuccess: (data) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      // Redirect to newly created teacher's details page
      navigate(`/admin/teachers/${data.documentId}`);
    },
  });
}

export function useUpdateTeacher(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTeacherPayload) => teachersService.updateTeacher(documentId, payload),
    onSuccess: () => {
      // Invalidate both details and list queries
      queryClient.invalidateQueries({ queryKey: ['teacher', documentId] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
}

export function useUpdateTeacherStatus(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: TeacherStatus) => teachersService.updateTeacher(documentId, { status }),
    onSuccess: () => {
      // Invalidate queries to reflect updated status
      queryClient.invalidateQueries({ queryKey: ['teacher', documentId] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
}

export function useAddTeachingAssignment(teacherProfileDocumentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignment: {
      subjectDocumentId: string;
      sectionDocumentId: string;
      academicYearDocumentId: string;
    }) =>
      teachersService.addAssignment({
        teacherProfileDocumentId,
        ...assignment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', teacherProfileDocumentId] });
    },
  });
}

export function useRemoveTeachingAssignment(teacherProfileDocumentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentDocumentId: string) => teachersService.removeAssignment(assignmentDocumentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', teacherProfileDocumentId] });
    },
  });
}
