import { motion } from 'framer-motion';
import logo from '../assets/img/logo_nobg.png';
import './Hero.css';

const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-overlay"></div>
      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
  <img src={logo} alt="De Emeralds Logo" className="hero-logo" />
  <h1>De Emeralds</h1>
        <p>Welcome</p>
      </motion.div>
    </section>
  );
};

export default Hero;