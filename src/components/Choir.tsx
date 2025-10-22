import { Carousel } from 'react-responsive-carousel';
import { useContext, useEffect, useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import './Choir.css';
import { membersCtx } from '../contexts/membersCtx';

export default function Choir()  {
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

    const {members} = useContext(membersCtx)!;

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
                    { members && members.map((member, index) => (
                        <div key={index} className="choir-member">
                            <img src={`https://vicolraj.github.io/DeEmeraldsPictures/${member.Picture}`} alt={member.Name} />
                            <p className="legend">{member.Name}</p>
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    );
};
