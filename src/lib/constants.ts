// ============================================
// De Emeralds — Constants & Configuration
// ============================================

export const VOICE_ROLES = [
  'Soprano', 'Mezzo-Soprano', 'Alto', 'Contralto',
  'Tenor', 'Baritone', 'Bass',
  'CEO', 'Director', 'Music Director', 'Accompanist',
  'Keyboardist', 'Drummer', 'Guitarist', 'Bassist',
  'Choreographer', 'Administrator', 'Other'
] as const;

export const CONTACT = {
  email: 'deemeraldperfectexpression@gmail.com',
  phone: '08103707775',
} as const;

export const DIVISIONS = [
  {
    name: 'De Emeralds Chorale',
    description: 'A multi-award winning choral ensemble delivering powerful, soul-stirring performances that blend classical choral traditions with rich African musical heritage.',
    icon: '🎵',
  },
  {
    name: 'De Emeralds Entertainment',
    subtitle: 'Live Band',
    description: 'A dynamic live band bringing electrifying energy to events, concerts, and celebrations with versatile musical performances across genres.',
    icon: '🎸',
  },
  {
    name: 'De Emeralds Charity',
    description: 'Dedicated to community impact through music — empowering lives, supporting education, and fostering unity through the transformative power of art.',
    icon: '💚',
  },
  {
    name: 'De Emeralds Academy',
    description: 'A premier music training institution nurturing the next generation of vocal and instrumental talent with world-class instruction and mentorship.',
    icon: '🎓',
  },
] as const;

export const SOCIAL_LINKS = [
  { name: 'Facebook', url: 'https://m.facebook.com/deemeraldschoir?mibextid=ZbWKwL', icon: 'facebook' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@deemeraldschoir', icon: 'tiktok' },
  { name: 'Twitter', url: 'https://twitter.com/Deemeralds1', icon: 'twitter' },
  { name: 'Instagram', url: 'https://www.instagram.com/deemeraldschoir/', icon: 'instagram' },
  { name: 'YouTube', url: 'https://youtube.com/@DeEmeraldsPerfectExpression', icon: 'youtube' },
  { name: 'Apple Music', url: 'https://music.apple.com/us/artist/de-emeralds-choir/1545378022', icon: 'apple-music' },
  { name: 'Spotify', url: 'https://open.spotify.com/artist/3W5jySHVhhljJQgVseVcMn', icon: 'spotify' },
] as const;

export const NAV_LINKS = [
  { title: 'Home', href: '#hero' },
  { title: 'About', href: '#about' },
  { title: 'Members', href: '#members' },
  { title: 'Divisions', href: '#divisions' },
  { title: 'Gallery', href: '#gallery' },
  { title: 'Videos', href: '#videos' },
  { title: 'Contact', href: '#contact' },
] as const;

export const GOOGLE_MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1618.5783930869172!2d5.212051811390725!3d7.2522679575744595!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10478fe9320fe6b3%3A0x1c0e0c62492a1837!2sYafrato%20Shopping%20Complex!5e0!3m2!1sen!2sng!4v1759688446085!5m2!1sen!2sng';
