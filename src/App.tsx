import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Choir from './components/Choir';
import Gallery from './components/Gallery';
import Videos from './components/Videos';
import Rehearsal from './components/Rehearsal';
import Contact from './components/Contact';
import Footer from './components/Footer';
// import AudioPlayer from './components/AudioPlayer';

import './App.css';
import { useContext, useEffect} from 'react';
import { membersCtx, MembersProvider } from './contexts/membersCtx';
  



function App() {
    const {setMembers} = useContext(membersCtx)!;
    useEffect(
      () => {
        fetch(import.meta.env.VITE_API)
          .then((res) => {
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }
            return res.json();
          })
          .then((data) => {
            setMembers(data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      },
      []
  );

  return (
    <MembersProvider>
    <div className="App">
      {/*<AudioPlayer />*/}
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

    </MembersProvider>
  );
}

export default App;