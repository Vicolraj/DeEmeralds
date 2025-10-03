import { useState } from 'react';
import { FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import Modal from './Modal';
import './Gallery.css';

type ModalContent = 'awards' | 'events' | null;

const Gallery = () => {
    const [modalContent, setModalContent] = useState<ModalContent>(null);

    return (
        <section id="gallery" className="gallery">
            <div className="container">
                <h2>Gallery</h2>
                <div className="folder-container">
                    <div className="folder" onClick={() => setModalContent('awards')}>
                        <FaTrophy className="folder-icon" />
                        <h3>Awards</h3>
                    </div>
                    <div className="folder" onClick={() => setModalContent('events')}>
                        <FaCalendarAlt className="folder-icon" />
                        <h3>Past Events</h3>
                    </div>
                </div>
            </div>
            {modalContent && <Modal content={modalContent} onClose={() => setModalContent(null)} />}
        </section>
    );
};
export default Gallery;