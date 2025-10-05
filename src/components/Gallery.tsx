import { useState } from 'react';
import { FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import Modal from './Modal';
import './Gallery.css';
import { motion } from 'framer-motion';

type ModalContent = 'photos' | 'events' | null;

const Gallery = () => {
    const [modalContent, setModalContent] = useState<ModalContent>(null);

    return (
        <section id="gallery" className="gallery">
            <div className="container">
                <h2>Gallery</h2>
                <div className="folder-container">
                    <motion.div className="folder" onClick={() => setModalContent('photos')}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0,  }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ duration: 0.5, ease: 'circOut'}}>
                        <FaTrophy className="folder-icon" />
                        <h3>Photos</h3>
                    </motion.div>
                    <motion.div className="folder" onClick={() => setModalContent('events')}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0,  }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ duration: 0.5, ease: 'circOut' }}>
                        <FaCalendarAlt className="folder-icon" />
                        <h3>Events</h3>
                    </motion.div>
                </div>
            </div>
            {modalContent && <Modal content={modalContent} onClose={() => setModalContent(null)} />}
        </section>
    );
};
export default Gallery;