import React from 'react';
import logo from '../assets/img/logo_nobg.webp';
import { CONTACT, DIVISIONS } from '../lib/constants';
import { useSocials } from '../hooks/useData';
import {
  FaFacebookF, FaTiktok, FaTwitter, FaInstagram,
  FaYoutube, FaSpotify, FaApple
} from 'react-icons/fa';

const ICON_MAP: Record<string, React.ReactElement> = {
  facebook:    <FaFacebookF />,
  tiktok:      <FaTiktok />,
  twitter:     <FaTwitter />,
  instagram:   <FaInstagram />,
  youtube:     <FaYoutube />,
  spotify:     <FaSpotify />,
  'apple-music': <FaApple />,
};

export default function Footer() {
  const { socials } = useSocials();

  return (
    <footer className="relative bg-black pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">

          {/* Brand Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <img src={logo} alt="De Emeralds" className="w-14 h-14" />
              <span className="font-display text-2xl text-white tracking-wide">De Emeralds</span>
            </div>
            <p className="font-body text-white/40 text-sm leading-loose">
              Perfect Expression is an umbrella for artistic excellence, spiritual growth, and community transformation.
            </p>

            {/* Dynamic Social Icons — only show if URL exists in db */}
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {socials.map(s => {
                  const icon = ICON_MAP[s.iconKey];
                  if (!icon) return null;
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-gold-500 hover:border-gold-500/40 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.platform}
                    >
                      {icon}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divisions Column */}
          <div className="space-y-8">
            <h4 className="font-display text-white text-lg font-medium tracking-[0.2em] uppercase">Our Divisions</h4>
            <ul className="space-y-5">
              {DIVISIONS.map(d => (
                <li key={d.name}>
                  <a href="#divisions" className="font-body text-white/40 text-sm hover:text-gold-400 transition-colors tracking-wide">
                    {d.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-8">
            <h4 className="font-display text-white text-lg font-medium tracking-[0.2em] uppercase">Contact</h4>
            <ul className="space-y-6">
              <li className="font-body text-white/40 text-sm leading-loose">
                <span className="block text-gold-500/60 uppercase text-[10px] tracking-widest mb-2">Email Address</span>
                {CONTACT.email}
              </li>
              <li className="font-body text-white/40 text-sm">
                <span className="block text-gold-500/60 uppercase text-[10px] tracking-widest mb-2">Phone Number</span>
                {CONTACT.phone}
              </li>
              <li className="font-body text-white/40 text-sm">
                <span className="block text-gold-500/60 uppercase text-[10px] tracking-widest mb-2">Office</span>
                Yafrato Complex, Alagbaka, Akure.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-body text-white/20 text-xs uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} De Emeralds. All Rights Reserved.
          </p>
          <p className="font-body text-white/20 text-xs uppercase tracking-[0.2em]">
            Built with luxury by{' '}
            <a href="https://vicolraj.vercel.app" target="_blank" rel="noreferrer" className="text-gold-500/60 hover:text-gold-400 transition-colors">
              Vicolraj
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}