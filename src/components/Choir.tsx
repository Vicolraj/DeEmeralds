import { Carousel } from 'react-responsive-carousel';
import { useEffect, useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import './Choir.css';

import member1 from '../assets/img/founder.jpg';
import member2 from '../assets/img/founder.jpg';
import member3 from '../assets/img/founder.jpg';

const choirMembers = [
    { name: 'Adelana Mathew', image: member1 },
    { name: 'Adelana Mathew', image: member1 },
    { name: 'Ibidun Ojo', image: member2 },
    { name: 'Ibidun Ojo', image: member2 },
    { name: 'Peter Irewole', image: member3 },
    { name: 'Peter Irewole', image: member3 },
];

const Choir = () => {
    const [slidePercent, setSlidePercent] = useState<number>(33);
    const [centerModeEnabled, setCenterModeEnabled] = useState<boolean>(true);

    useEffect(() => {
        const updateSettings = () => {
            const w = window.innerWidth;
            if (w < 520) {
                setSlidePercent(100);
                setCenterModeEnabled(false);
            } else if (w < 900) {
                setSlidePercent(50);
                setCenterModeEnabled(false);
            } else {
                setSlidePercent(33);
                setCenterModeEnabled(true);
            }
        };

        updateSettings();
        window.addEventListener('resize', updateSettings);
        return () => window.removeEventListener('resize', updateSettings);
    }, []);

    return (
        <section id="choir" className="choir-section">
            <div className="container">
                <h2>Meet Our Choir</h2>
                <Carousel
                    autoPlay
                    infiniteLoop
                    showThumbs={false}
                    showStatus={false}
                    centerMode={centerModeEnabled}
                    centerSlidePercentage={slidePercent}
                    swipeable
                    emulateTouch
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