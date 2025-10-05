import './Rehearsal.css';
import { motion } from 'framer-motion';

const Rehearsal = () => (
    <motion.section id="rehearsal"
    initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1,  }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5 }}>
        <div className="container">
            <h2>Choir Rehearsal Schedule</h2>
            <table className="rehearsal-schedule" aria-label="Choir rehearsal schedule">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td data-label="Day">Tuesday</td>
                        <td data-label="Time">5:00 PM — 7:00 PM</td>
                        <td data-label="Location">De Emeralds Secretariat, Yafrato Shopping complex Alagbaka.</td>
                    </tr>
                    <tr>
                        <td data-label="Day">Thursday</td>
                        <td data-label="Time">5:00 PM — 7:00 PM</td>
                        <td data-label="Location">De Emeralds Secretariat, Yafrato Shopping complex Alagbaka.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br />
        <div className="map-wrapper">
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d16137181.002963053!2d-1.6903959093750043!3d9.087301242816606!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10478fe9320fe6b3%3A0x1c0e0c62492a1837!2sYafrato%20Shopping%20Complex!5e0!3m2!1sen!2sng!4v1759610879201!5m2!1sen!2sng"
            width="100%"
            height="450"
            style={{border: '0'}} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
    </motion.section>
);

export default Rehearsal;