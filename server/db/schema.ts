import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

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
