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
import { createContext, useEffect, useState} from 'react';


export type memberType = {Name: string, Picture: string, Position?: string}[];
export const MembersCtx = createContext<memberType>([]);


function App() {
        const [members, setMembers] = useState<memberType>([]);

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
    <MembersCtx.Provider value={members}>
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

    </MembersCtx.Provider>
  );
}

export default App;