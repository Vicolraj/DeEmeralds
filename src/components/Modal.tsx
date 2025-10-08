import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import './Modal.css';

interface ModalProps {
    content: 'photos' | 'events';
    onClose: () => void;
}

const Modal = ({ content, onClose }: ModalProps) => {
    const photosContent = <PhotosContent />;
    const eventsContent = <EventsContent />;

    return (
        <AnimatePresence>
            <motion.div 
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            >
                <motion.div 
                  className="modal-content"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()} 
                >
                    <button onClick={onClose} className="close-button"><FaTimes /></button>
                    <h2>{content === 'photos' ? 'Our Photos' : 'Events'}</h2>
                    {content === 'photos' ? photosContent : eventsContent}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
export default Modal;

const PhotosContent = ()=> {
    return(<div className='gallery-list-container'>Not uploaded yet</div>)
}
const EventsContent = ()=> {
    return(
    <div className='gallery-list-container'>
        not Uploaded yet
    </div>)
}