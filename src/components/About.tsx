import { motion } from 'framer-motion';
import founderImg from '../assets/img/founder.jpg';
import Counter from './Counter';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
  <h2>About De Emeralds</h2>
        <div className="about-content">
          <motion.div 
            className="about-image"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0,  }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <img src={founderImg} alt="Founder" />
            <small className='name'>ICON (DR) ENG. Oluwagbenga Akinfolarin Obagbemi</small>
          </motion.div>
          <motion.div 
            className="about-text"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3>Our Story</h3>
            <p>
              De Emeralds is more than just a choir; we are a family united by a passion for music and a mission to inspire the world through harmony. Founded in 2022, we have grown from a small group of singers into a renowned ensemble, celebrated for our vibrant performances and dedication to musical excellence.
            </p>
            <p>
              Our journey is one of faith, friendship, and the relentless pursuit of creating beautiful music that touches hearts and uplifts spirits.
            </p>
            <div className="stats-container">
              <Counter target={25} label="Songs" />
              <Counter target={50} label="Choir Members" />
              <Counter target={100} label="Events Held" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;