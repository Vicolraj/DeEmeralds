import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { CONTACT, SOCIAL_LINKS, GOOGLE_MAP_EMBED_URL } from '../lib/constants';
import { useRehearsals } from '../hooks/useData';

export default function Contact() {
  const { rehearsals } = useRehearsals();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-gradient-dark overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-6xl text-white font-light mb-4">
            Get in <span className="text-gold-400">Touch</span>
          </h2>
          <div className="section-divider" />
          <p className="font-body text-white/50 mt-6 max-w-xl mx-auto uppercase tracking-widest text-sm">
            Reach out for bookings, inquiries, or more information
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Details */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h3 variants={itemVariants} className="font-display text-3xl text-white font-light mb-10">
              Contact Information
            </motion.h3>

            <div className="space-y-8">
              <motion.div variants={itemVariants} className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-gold-500 transition-colors duration-300">
                  <FaEnvelope className="text-gold-400 group-hover:text-emerald-950" />
                </div>
                <div>
                  <p className="font-body text-gold-500/60 text-xs uppercase tracking-widest mb-1">Email Us</p>
                  <a href={`mailto:${CONTACT.email}`} className="font-body text-lg text-white hover:text-gold-400 transition-colors">
                    {CONTACT.email}
                  </a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-gold-500 transition-colors duration-300">
                  <FaPhone className="text-gold-400 group-hover:text-emerald-950" />
                </div>
                <div>
                  <p className="font-body text-gold-500/60 text-xs uppercase tracking-widest mb-1">Call Us</p>
                  <a href={`tel:${CONTACT.phone}`} className="font-body text-lg text-white hover:text-gold-400 transition-colors">
                    {CONTACT.phone}
                  </a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-gold-500 transition-colors duration-300">
                  <FaMapMarkerAlt className="text-gold-400 group-hover:text-emerald-950" />
                </div>
                <div>
                    <p className="font-body text-gold-500/60 text-xs uppercase tracking-widest mb-1">Location</p>
                    <p className="font-body text-lg text-white leading-relaxed">
                        De Emeralds Secretariat, Yafrato Shopping Complex, Alagbaka, Akure, Ondo State.
                    </p>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
             <motion.div variants={itemVariants} className="mt-16">
                 <p className="font-body text-gold-500/40 text-xs uppercase tracking-widest mb-6">Follow Our Journey</p>
                 <div className="flex flex-wrap gap-4">
                    {SOCIAL_LINKS.map((social) => (
                        <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/60 hover:text-gold-400 hover:border-gold-500 transition-all duration-300"
                            aria-label={social.name}
                        >
                            {/* We could use real icons but for brevity we'll keep them generic unless specified */}
                             <span className="text-xs uppercase">{social.name[0]}</span>
                        </a>
                    ))}
                 </div>
             </motion.div>
          </motion.div>

          {/* Map & Rehearsal Schedule */}
          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="space-y-12"
          >
             {/* Map */}
            <div className="rounded-xl overflow-hidden shadow-2xl glass p-2">
                <iframe
                    src={GOOGLE_MAP_EMBED_URL}
                    className="w-full h-[300px]"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                />
            </div>

            {/* Rehearsal Schedule */}
            <div className="glass p-8 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <FaClock className="text-6xl" />
                </div>
                <h3 className="font-display text-2xl text-white font-light mb-6 flex items-center gap-3">
                    <FaClock className="text-gold-400 text-xl" />
                    Rehearsal Schedule
                </h3>

                {rehearsals.length > 0 ? (
                    <div className="space-y-6">
                        {rehearsals.map((r, i) => (
                            <div key={r.id} className={`flex justify-between items-center pb-4 ${i !== rehearsals.length -1 ? 'border-b border-white/5' : ''}`}>
                                <div>
                                    <p className="font-display text-xl text-white">{r.day}</p>
                                    <p className="font-body text-sm text-white/50">{r.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-body text-gold-400 font-medium tracking-wide">{r.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <div>
                                <p className="font-display text-xl text-white">Tuesday</p>
                                <p className="font-body text-sm text-white/50">Secretariat</p>
                            </div>
                            <div className="text-right">
                                <p className="font-body text-gold-400 font-medium tracking-wide">5:00 PM — 7:00 PM</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-display text-xl text-white">Thursday</p>
                                <p className="font-body text-sm text-white/50">Secretariat</p>
                            </div>
                            <div className="text-right">
                                <p className="font-body text-gold-400 font-medium tracking-wide">5:00 PM — 7:00 PM</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}