import Hero from '../components/Hero';
import About from '../components/About';
import MembersSection from '../components/MembersSection';
import Divisions from '../components/Divisions';
import Gallery from '../components/Gallery';
import Videos from '../components/Videos';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor';
import Preloader from '../components/Preloader';

export default function Home() {
  return (
    <div className="bg-emerald-950 min-h-screen text-white">
      <Preloader />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <MembersSection />
        <Divisions />
        <Gallery />
        <Videos />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
