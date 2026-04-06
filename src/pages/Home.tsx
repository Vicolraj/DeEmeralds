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
import Sparkles from '../components/Sparkles';

export default function Home() {
  return (
    <div className="min-h-screen bg-emerald-950 overflow-x-hidden">
      <Sparkles />
      <CustomCursor />
      <Navbar />
      <main className="relative">
        <Hero />

        <div className="section-divider" />
        <About />

        <div className="section-divider" />
        <Divisions />

        <div className="section-divider" />
        <MembersSection />

        <div className="section-divider" />
        <Videos />

        <div className="section-divider" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
