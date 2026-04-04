import { useState, useEffect } from 'react';
import { getMembers, getVideos, getRehearsals, getStats, getSocialLinks } from '../lib/api';
import type { Member, YouTubeVideo, Rehearsal } from '../lib/types';

// ── useMembers ─────────────────────────────────
export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMembers()
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { members, loading, error, setMembers };
}

// ── useVideos ──────────────────────────────────
export function useVideos() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { videos, loading, error, setVideos };
}

// ── useRehearsals ──────────────────────────────
export function useRehearsals() {
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRehearsals()
      .then(setRehearsals)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { rehearsals, loading, error, setRehearsals };
}

// ── useStats ───────────────────────────────────
export function useStats() {
  const [stats, setStats] = useState<{ songsCount: number; eventsCount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

// ── useSocials ─────────────────────────────────
export function useSocials() {
  const [socials, setSocials] = useState<{ id: number; platform: string; url: string; iconKey: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSocialLinks().then(setSocials).finally(() => setLoading(false));
  }, []);

  return { socials, loading };
}
