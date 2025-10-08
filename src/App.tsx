import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Choir from './components/Choir';
import Gallery from './components/Gallery';
import Videos from './components/Videos';
import Rehearsal from './components/Rehearsal';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';

import './App.css';

function App() {
  return (
    <div className="App">
      <AudioPlayer />
      <Header />
      <main>
        <Hero />
        <About />
        <Choir />
        <Gallery />
  <Videos />
        <Rehearsal />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;