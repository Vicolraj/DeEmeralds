import { motion } from 'framer-motion';
import logo from '../assets/img/logo_nobg.png';
import heroBg from '../assets/img/hero-bg.jpg';
import './Hero.css';

const Hero = () => {
  return (
    <section id="hero" className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay"></div>
      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
  <img src={logo} alt="De Emerald Logo" className="hero-logo" />
  <h1>De Emerald</h1>
        <p>Welcome</p>
      </motion.div>
    </section>
  );
};

export default Hero;