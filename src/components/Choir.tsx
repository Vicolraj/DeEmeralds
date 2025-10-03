import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import './Choir.css';

// Assume you have images in src/assets/choir/
import member1 from '../assets/img/founder.jpg';
import member2 from '../assets/img/founder.jpg';
import member3 from '../assets/img/founder.jpg';

const choirMembers = [
    { name: 'Adelana Mathew', image: member1 },
    { name: 'Ibidun Ojo', image: member2 },
    { name: 'Peter Irewole', image: member3 },
];

const Choir = () => {
    return (
        <section id="choir" className="choir-section">
            <div className="container">
                <h2>Meet Our Choir</h2>
                <Carousel
                    autoPlay
                    infiniteLoop
                    showThumbs={false}
                    showStatus={false}
                    centerMode
                    centerSlidePercentage={33.3}
                >
                    {choirMembers.map((member, index) => (
                        <div key={index} className="choir-member">
                            <img src={member.image} alt={member.name} />
                            <p className="legend">{member.name}</p>
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    );
};

export default Choir;