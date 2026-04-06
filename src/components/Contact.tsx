import React from 'react';
import { motion } from 'framer-motion';
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock,
  FaFacebookF, FaTiktok, FaTwitter, FaInstagram, FaYoutube, FaSpotify, FaApple
} from 'react-icons/fa';
import { CONTACT, GOOGLE_MAP_EMBED_URL } from '../lib/constants';
import { useRehearsals, useSocials } from '../hooks/useData';
import SubtleNotes from './SubtleNotes';

const ICON_MAP: Record<string, React.ReactElement> = {
  facebook:      <FaFacebookF />,
  tiktok:        <FaTiktok />,
  twitter:       <FaTwitter />,
  instagram:     <FaInstagram />,
  youtube:       <FaYoutube />,
  spotify:       <FaSpotify />,
  'apple-music': <FaApple />,
};

export default function Contact() {
  const { rehearsals } = useRehearsals();
  const { socials } = useSocials();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="contact" className="relative py-20 md:py-32 bg-gradient-dark overflow-hidden">
      <SubtleNotes />
      <div className="relative z-10 max-w-7xl mx-auto px-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-7xl text-white font-light mb-6">
            Get in <span className="text-gold-400">Touch</span>
          </h2>
          <motion.div
            className="section-divider mt-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.5, ease: 'circOut' }}
          />
          <p className="font-body text-white/50 mt-10 max-w-xl mx-auto uppercase tracking-[0.3em] text-sm">
            Reach out for bookings, inquiries, or more information
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28">
          {/* Left: Contact Details */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.h3 variants={itemVariants} className="font-display text-3xl text-white font-light mb-12">
              Contact Information
            </motion.h3>

            <div className="space-y-10">
              <motion.div variants={itemVariants} className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full glass flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                  <FaEnvelope className="text-gold-400 group-hover:text-emerald-950 text-lg" />
                </div>
                <div>
                  <p className="font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Email Us</p>
                  <a href={`mailto:${CONTACT.email}`} className="font-body text-lg text-white hover:text-gold-400 transition-colors break-all">
                    {CONTACT.email}
                  </a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full glass flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                  <FaPhone className="text-gold-400 group-hover:text-emerald-950 text-lg" />
                </div>
                <div>
                  <p className="font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Call Us</p>
                  <a href={`tel:${CONTACT.phone}`} className="font-body text-lg text-white hover:text-gold-400 transition-colors">
                    {CONTACT.phone}
                  </a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full glass flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                  <FaMapMarkerAlt className="text-gold-400 group-hover:text-emerald-950 text-lg" />
                </div>
                <div>
                  <p className="font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Location</p>
                  <p className="font-body text-lg text-white leading-relaxed">
                    De Emeralds Secretariat,<br />Yafrato Shopping Complex,<br />Alagbaka, Akure, Ondo State.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Dynamic Social Links — icon only shown if URL set in admin */}
            {socials.length > 0 && (
              <motion.div variants={itemVariants} className="mt-16">
                <p className="font-body text-gold-500/40 text-xs uppercase tracking-[0.3em] mb-8">Follow Our Journey</p>
                <div className="flex flex-wrap gap-4">
                  {socials.map((social) => {
                    const icon = ICON_MAP[social.iconKey];
                    if (!icon) return null;
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 glass rounded-full flex items-center justify-center text-white/40 hover:text-gold-400 hover:border-gold-500/40 transition-all duration-300 text-lg"
                        aria-label={social.platform}
                      >
                        {icon}
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Map & Rehearsal Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            {/* Map */}
            <div 
              className="rounded-xl overflow-hidden shadow-2xl glass p-2"
              data-lenis-prevent
            >
              <iframe
                src={GOOGLE_MAP_EMBED_URL}
                className="w-full h-[300px] rounded-lg"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              />
            </div>

            {/* Rehearsal Schedule */}
            <div className="glass p-10 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <FaClock className="text-8xl" />
              </div>
              <h3 className="font-display text-2xl text-white font-light mb-8 flex items-center gap-4">
                <FaClock className="text-gold-400 text-xl" />
                Rehearsal Schedule
              </h3>

              {rehearsals.length > 0 ? (
                <div className="space-y-2">
                  {rehearsals.map((r, i) => (
                    <div key={r.id} className={`flex justify-between items-center py-5 ${i !== rehearsals.length - 1 ? 'border-b border-white/5' : ''}`}>
                      <div>
                        <p className="font-display text-xl text-white mb-1">{r.day}</p>
                        <p className="font-body text-sm text-white/50 leading-relaxed">{r.location}</p>
                      </div>
                      <p className="font-body text-gold-400 font-medium tracking-wide">{r.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[{ day: 'Tuesday', time: '5:00 PM — 7:00 PM' }, { day: 'Thursday', time: '5:00 PM — 7:00 PM' }].map((r, i) => (
                    <div key={r.day} className={`flex justify-between items-center py-5 ${i === 0 ? 'border-b border-white/5' : ''}`}>
                      <div>
                        <p className="font-display text-xl text-white mb-1">{r.day}</p>
                        <p className="font-body text-sm text-white/50">Secretariat</p>
                      </div>
                      <p className="font-body text-gold-400 font-medium tracking-wide">{r.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}