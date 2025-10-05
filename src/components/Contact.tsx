import { FaFacebookF, FaTiktok, FaTwitter, FaYoutube, FaInstagram, FaMusic, FaSpotify } from 'react-icons/fa';
import './Contact.css';
import { motion } from 'framer-motion';

const Contact = () => (
    <motion.section id="contact" 
    initial={{ opacity: 0}}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1 }}>
        <div className="container">
            <h2>Get In Touch</h2>
            {/* <div className="contact-info">
                <p>
                    <FaEnvelope aria-hidden />
                    <a href="mailto:info@de-emerald.org"> info@de-emerald.org</a>
                </p>
                <p>
                    <FaPhone aria-hidden />
                    <a href="tel:+23490678473"> +23490678473</a>
                </p>
            </div> */}

            <div className="social-links" aria-label="Social media links">
                <a href="https://m.facebook.com/deemeraldschoir?mibextid=ZbWKwL" target="_blank" rel="noreferrer" aria-label="Facebook">
                    <FaFacebookF />
                </a>
                <a href="https://www.tiktok.com/@deemeraldschoir" target="_blank" rel="noreferrer" aria-label="TikTok">
                    <FaTiktok />
                </a>
                <a href="https://twitter.com/Deemeralds1" target="_blank" rel="noreferrer" aria-label="X">
                    <FaTwitter />
                </a>
                <a href="https://www.instagram.com/deemeraldschoir/" target="_blank" rel="noreferrer" aria-label="X">
                    <FaInstagram />
                </a>
                <a href="https://youtube.com/@DeEmeraldsPerfectExpression" target="_blank" rel="noreferrer" aria-label="YouTube">
                    <FaYoutube />
                </a>
                <a href="https://music.apple.com/us/artist/de-emeralds-choir/1545378022" target="_blank" rel="noreferrer" aria-label="YouTube">
                    <FaMusic />
                </a>
                <a href="https://open.spotify.com/artist/3W5jySHVhhljJQgVseVcMn" target="_blank" rel="noreferrer" aria-label="Spotify">
                    <FaSpotify />
                </a>
            </div>
        </div>
    </motion.section>
);

export default Contact;