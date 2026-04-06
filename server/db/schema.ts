import { pgTable, serial, varchar, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

// ... existing tables ...

// ... existing tables ...

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 100 }).notNull(),
  photoUrl: text('photo_url'),
  photoPublicId: text('photo_public_id'),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const youtubeVideos = pgTable('youtube_videos', {
  id: serial('id').primaryKey(),
  videoId: varchar('video_id', { length: 20 }).notNull(),
  title: varchar('title', { length: 255 }),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const rehearsals = pgTable('rehearsals', {
  id: serial('id').primaryKey(),
  day: varchar('day', { length: 20 }).notNull(),
  time: varchar('time', { length: 50 }).notNull(),
  location: text('location').notNull(),
  displayOrder: integer('display_order').default(0),
});

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const siteStats = pgTable('site_stats', {
  id: serial('id').primaryKey(),
  songsCount: integer('songs_count').default(25),
  eventsCount: integer('events_count').default(100),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const socialLinks = pgTable('social_links', {
  id: serial('id').primaryKey(),
  platform: varchar('platform', { length: 50 }).notNull(),
  url: text('url'),
  iconKey: varchar('icon_key', { length: 50 }), // e.g. 'facebook', 'instagram'
  displayOrder: integer('display_order').default(0),
});
