import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import './Modal.css';

interface ModalProps {
    content: 'awards' | 'events';
    onClose: () => void;
}

const Modal = ({ content, onClose }: ModalProps) => {
    const awardsContent = <div>Content for awards...</div>;
    const eventsContent = <div>Content for past events...</div>;

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
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    <button onClick={onClose} className="close-button"><FaTimes /></button>
                    <h2>{content === 'awards' ? 'Our Awards' : 'Past Events'}</h2>
                    {content === 'awards' ? awardsContent : eventsContent}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
export default Modal;