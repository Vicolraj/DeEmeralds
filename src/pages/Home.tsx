import Hero from '../components/Hero';
import About from '../components/About';
import MembersSection from '../components/MembersSection';
import Divisions from '../components/Divisions';
// import Gallery from '../components/Gallery';
import Videos from '../components/Videos';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor';
import Preloader from '../components/Preloader';
import Sparkles from '../components/Sparkles';
import { motion } from 'framer-motion';

export default function Home() {
  const Divider = () => (
    <div className="max-w-7xl mx-auto px-10">
        <motion.div 
            className="section-divider"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.5, ease: "circOut" }}
        />
    </div>
  );

  return (
    <div className="bg-emerald-950 min-h-screen text-white">
      <Preloader />
      <Sparkles />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Divider />
        <MembersSection />
        <Divider />
        <Divisions />
        <Divider />
        {/* <Gallery /> */}
        <Videos />
        <Divider />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
