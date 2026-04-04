import logo from '../assets/img/logo_nobg.webp';
import { CONTACT, SOCIAL_LINKS, DIVISIONS } from '../lib/constants';

export default function Footer() {
  return (
    <footer className="relative bg-black pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="De Emeralds" className="w-12 h-12" />
              <span className="font-display text-2xl text-white tracking-wide">De Emeralds</span>
            </div>
            <p className="font-body text-white/40 text-sm leading-relaxed">
              Perfect Expression is an umbrella for artistic excellence, spiritual growth, and community transformation.
            </p>
            {/* Social Icons row */}
            <div className="flex gap-4">
                 {/* Preserved from original Footer, but styled */}
                 {SOCIAL_LINKS.slice(0, 4).map(s => (
                    <a key={s.name} href={s.url} className="text-white/20 hover:text-gold-500 transition-colors" target="_blank" rel="noopener noreferrer">
                        {/* Short name for now */}
                        <span className="text-xs uppercase">{s.name[0]}</span>
                    </a>
                 ))}
            </div>
          </div>

          {/* Divisions Column */}
          <div className="space-y-6">
            <h4 className="font-display text-white text-lg font-medium tracking-widest uppercase">Our Divisions</h4>
            <ul className="space-y-4">
              {DIVISIONS.map(d => (
                <li key={d.name}>
                  <a href="#divisions" className="font-body text-white/40 text-sm hover:text-gold-400 transition-colors">
                    {d.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

         {/* Contact Column */}
         <div className="space-y-6">
            <h4 className="font-display text-white text-lg font-medium tracking-widest uppercase">Contact</h4>
            <ul className="space-y-4">
              <li className="font-body text-white/40 text-sm">
                <span className="block text-gold-500/60 uppercase text-[10px] tracking-widest mb-1">Email Address</span>
                {CONTACT.email}
              </li>
              <li className="font-body text-white/40 text-sm">
                 <span className="block text-gold-500/60 uppercase text-[10px] tracking-widest mb-1">Phone Number</span>
                {CONTACT.phone}
              </li>
              <li className="font-body text-white/40 text-sm">
                <span className="block text-gold-500/60 uppercase text-[10px] tracking-widest mb-1">Office</span>
                Yafrato Complex, Alagbaka, Akure.
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-6">
            <h4 className="font-display text-white text-lg font-medium tracking-widest uppercase">Newsletter</h4>
            <p className="font-body text-white/40 text-sm">Stay updated with our latest performances and impact.</p>
            <div className="flex mt-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="bg-white/5 border border-white/10 px-4 py-2 w-full text-white text-sm outline-none focus:border-gold-500/50 transition-colors rounded-l-sm"
                />
                <button className="bg-gold-500 text-emerald-950 px-4 py-2 font-body text-xs font-semibold uppercase tracking-widest rounded-r-sm hover:bg-gold-400 transition-colors">
                    Join
                </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-body text-white/20 text-xs uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} De Emeralds. All Rights Reserved.
          </p>
          <p className="font-body text-white/20 text-xs uppercase tracking-[0.2em]">
            Built with luxury by <a href="https://vicolraj.vercel.app" target="_blank" rel="noreferrer" className="text-gold-500/60 hover:text-gold-400 transition-colors">Vicolraj</a>
          </p>
        </div>
      </div>
    </footer>
  );
}