import { useContext } from 'react';
import './Choir.css';
import { MembersCtx, type memberType } from '../App';

// Swiper imports (better mobile touch behavior)
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules from the package entry (preferred, matches package exports)
// Import Swiper modules from the package's exported modules entry
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import picture from '../assets/img/founder.jpg'
import { FaArrowLeft } from 'react-icons/fa6';
import { FaArrowRight } from 'react-icons/fa';



const fallbackMembers: memberType = [
    { Name: 'Adelana Mathew', Picture: picture },
    { Name: 'Ibidun Ojo', Picture: picture },
    { Name: 'Peter Irewole', Picture: picture },
];

export default function Choir()  {
    const members = useContext(MembersCtx) as memberType;
    const list = (members && members.length) ? members : fallbackMembers;

    return (
        <section id="choir" className="choir-section">
            <div className="container">
                <h2>Meet Our Choir</h2>

                <Swiper
                    modules={[Autoplay, Navigation]}
                    navigation={{
                        prevEl: ".prev",
                        nextEl: ".next",
                    }}
                    spaceBetween={16}
                    loop={true}
                    autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        520: { slidesPerView: 2 },
                        900: { slidesPerView: 3 },
                    }}
                    // allow page scrolling when user swipes vertically
                    touchStartPreventDefault={false}
                >
                    {list.map((member, index) => (
                        <SwiperSlide key={index}>
                            <div className="choir-member">
                                <div className='img'
                                    style={{
                                        // backgroundImage: `url(${member.Picture})`,
                                        backgroundImage: `url(${member.Picture.startsWith('http') ? member.Picture : `https://vicolraj.github.io/DeEmeraldsPictures/${member.Picture}`})`,
                                        backgroundPosition: (member as any).Position ? (member as any).Position : 'center'
                                    }}
                                />
                                <p className="legend">{member.Name}</p>

                                
                            </div>
                            
                        </SwiperSlide>
                    ))}
                    <button className='prev'><FaArrowLeft /></button>
                    <button className='next'><FaArrowRight /></button>                    
                </Swiper>
            </div>
        </section>
    );
}
