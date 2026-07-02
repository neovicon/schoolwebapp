import apiClient from './client';
import type { AuthUser } from '../types/user.types';

// ─── Users API ────────────────────────────────────────────────────────────────
// Strapi replacement: GET /api/users/me  (with Authorization: Bearer <jwt>)

export const usersApi = {
  /**
   * Fetches the authenticated user's profile.
   * Strapi: GET /api/users/me?populate=role
   */
  async getMe(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>('/users/me');
    return data;
  },

  /**
   * Fetches a user by their ID.
   * Strapi: GET /api/users/:id
   */
  async getById(id: string): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>(`/users/${id}`);
    return data;
  },

  /**
   * Lists all users (admin only).
   * Strapi: GET /api/users
   */
  async list(): Promise<AuthUser[]> {
    const { data } = await apiClient.get<AuthUser[]>('/users');
    return data;
  },
};
