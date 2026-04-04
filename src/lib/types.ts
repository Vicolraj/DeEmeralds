import { VOICE_ROLES } from './constants';

// ============================================
// Shared Types
// ============================================

export type VoiceRole = typeof VOICE_ROLES[number];

export interface Member {
  id: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  role: string;
  photoUrl: string | null;
  photoPublicId?: string | null;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface YouTubeVideo {
  id: number;
  videoId: string;
  title: string | null;
  displayOrder: number;
  createdAt?: string;
}

export interface Rehearsal {
  id: number;
  day: string;
  time: string;
  location: string;
  displayOrder: number;
}

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}
