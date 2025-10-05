import './Videos.css';
import { motion } from 'framer-motion';

type Video = {
  id: string; // YouTube video ID
  title: string;
};

const videos: Video[] = [
  { id: 'pvmU1eEo140', title: 'Ji Masun (Solo Version)' },
  { id: 'jgBVXILz-Vs', title: 'Electrifying Hallelujah Chorus rendered at All Nation Concert', },
  { id: 'GQW0MHVKJpM', title: 'De Emeralds at Baba Authority`s Akure 2025 Crusade' },
  { id: 'gSq8i7vkZSg', title: 'De Emeralds Choir graces the burial service of Ch. Agboola Bayode.' },
  { id: 'TYL406FwzVA', title: `Aigbagbo bila! Temi l'oluwa || Hanover` },
  { id: 'bdMgJGUON7g', title: 'Mo yege' },
];

const Videos = () => {
  return (
    <section id="videos" className="videos-section">
      <div className="container">
        <h2>Watch Our Videos</h2>
        <div className="videos-grid">
          {videos.map((v, index) => (
            <motion.div key={v.id} className={"video-item" + (index > 2 ? ' desktop' : '')}
              initial={{ opacity: 0, scale: 0.2 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="video-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="video-title">{v.title}</p>
            </motion.div>
          ))}
          
        </div>
        <a id='watchmorelink' href="https://www.youtube.com/@DeEmeraldsPerfectExpression/videos" target='_blank'></a>
        <button onClick={() => document.getElementById('watchmorelink')?.click()} className='watchmore'>Watch More</button>
      </div>
    </section>
  );
};

export default Videos;
