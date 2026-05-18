import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdSecurity, MdBuild, MdWifi, MdPhoneAndroid,
  MdBusiness, MdLock, MdVerified, MdVideocam,
  MdSupportAgent, MdFlashOn, MdArrowForward,
  MdPhone, MdStar, MdNotificationsActive, MdCheckCircle,
} from 'react-icons/md';
import { FaWhatsapp, FaShieldAlt, FaCamera, FaTools, FaAward, FaCode, FaMobileAlt } from 'react-icons/fa';
import { IoShieldCheckmark } from 'react-icons/io5';
import logoImg from '../assets/logo2.jpeg';
import heroImg from '../assets/hero.png';
import './Home.css';

const banners = [
  {
    id:1, bg:'banner-bg-1',
    tag:'🔐 Trusted Security Partner',
    h1:'Advanced CCTV &', h1r:'Security Solutions',
    p:'Professional installation, 24/7 support and custom surveillance packages for homes & businesses across Hyderabad.',
    b1:{ label:'Get Free Quote', to:'/contact' },
    b2:{ label:'Call Now', href:'tel:9248353592', wa:false },
  },
  {
    id:2, bg:'banner-bg-2',
    tag:'📷 HD & 4K Cameras',
    h1:'Crystal Clear', h1r:'HD Surveillance',
    p:'Day & night vision cameras with remote mobile access. See everything, miss nothing — from anywhere in the world.',
    b1:{ label:'View Services', to:'/services' },
    b2:{ label:'WhatsApp Us', href:'https://wa.me/919248353592', wa:true },
  },
  {
    id:3, bg:'banner-bg-3',
    tag:'🏢 Commercial & Home',
    h1:'Complete Security', h1r:'For Every Property',
    p:'From single-room homes to large industrial facilities — we design, install and maintain your entire security system.',
    b1:{ label:'Our Packages', to:'/services' },
    b2:{ label:'Contact Us', to:'/contact', wa:false },
  },
];

const stats = [
  { v:'500+', l:'Installations', ico:<FaCamera /> },
  { v:'10+',   l:'Years Active',  ico:<FaAward /> },
  { v:'98%',  l:'Satisfaction',  ico:<MdStar /> },
  { v:'24/7', l:'Support',       ico:<MdSupportAgent /> },
];

const services = [
  { ico:<MdSecurity />,     t:'CCTV Installation',   d:'Indoor & outdoor HD/IP camera installation with professional setup and optimal placement.', badge:'hot',  feats:['HD & 4K','Night Vision','Weatherproof'], img:'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80' },
  { ico:<FaTools />,        t:'Maintenance & Repair', d:'Regular preventive maintenance and fast emergency repair services to keep you protected.', badge:null, feats:['Annual AMC','Emergency','Firmware Update'], img:'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80' },
  { ico:<MdWifi />,         t:'Remote Monitoring',    d:'Monitor your property from anywhere in the world, 24/7 with live alerts.', badge:'new',  feats:['Cloud Storage','Live Alerts','Encrypted'], img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { ico:<MdPhoneAndroid />, t:'Mobile App Setup',     d:'Live feed and instant push notifications directly on your smartphone or tablet.', badge:null, feats:['iOS & Android','Push Alerts','Playback'], img:'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80' },
  { ico:<MdBusiness />,     t:'Commercial CCTV',      d:'Complete office, retail and industrial surveillance solutions.', badge:null, feats:['Multi-Camera','NVR/DVR','Staff Training'], img:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
  { ico:<MdLock />,         t:'Access Control',       d:'Smart biometric and card-based access control systems for any property.', badge:null, feats:['Biometric','Card Access','Visitor Log'], img:'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80' },
  { ico:<FaCode />,         t:'Web Development',      d:'Custom websites and web applications designed for security businesses and enterprises.', badge:null, feats:['Responsive Design','SEO Optimized','Fast Loading'], img:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80' },
  { ico:<FaMobileAlt />,    t:'App Development',      d:'Native and cross-platform mobile apps for iOS and Android with seamless integration.', badge:null, feats:['iOS & Android','Cloud Integration','Real-time Sync'], img:'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80' },
];

const clients = [
  { name:'CMR Hospitals', logo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0V_zB85fTziFT1gepjgrDo7N8nJbVxOX0qQ&s' },
  { name:'Suzuki', logo:'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://suzuki.com&size=256' },
  { name:'Indian Oil', logo:'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://iocl.com&size=256' },
  { name:'Aparna', logo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAhXgR-ndsqK3W9QPnGs2r6VcvzNDN__X-1A&s' },
  { name:'Amul', logo:'https://i.pinimg.com/736x/95/51/1d/95511d28150d3bb1d241e996c45dbde9.jpg' },
  { name:'Sreenidhi', logo:'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://sis.edu.in&size=256' },
  { name:'Thyrocare', logo:'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://thyrocare.com&size=256' },
  { name:'Kendriya Vidyalay', logo:'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://kvsangathan.nic.in&size=256' },
];

const partners = [
  { name:'CP Plus', logo:'https://fgtechstore.com/wp-content/uploads/2026/02/3.jpg' },
  { name:'Dahua Technologies', logo:'https://media.licdn.com/dms/image/v2/D4D1BAQHQcnHPdljlBw/company-background_10000/company-background_10000/0/1655781293667/dahua_technology_hk_limited_cover?e=2147483647&v=beta&t=UHAgN-loV41Xw1BV6BcIL50J0xXX-BI-say4bvqda4Q' },
  { name:'Hikvision', logo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTemzTCORElRVRVgQ_esxnfyQgj3akp_cVMRA&s' },
  { name:'XPIA-I', logo:'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://xpia-i.com&size=256' },
  { name:'D-Link', logo:'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://dlink.com&size=256' },
  { name:'Honeywell', logo:'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://honeywell.com&size=256' },
  { name:'Unicam Systems', logo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_A3kVylHjCja6Gs9FTQAyhAJO5meDgbnNZQ&s' },
  { name:'Prama', logo:'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.pramaindia.in&size=256' },
];

const whyUs = [
  { ico:<MdVerified size={24}/>,        t:'Certified Technicians', d:'All our technicians are professionally certified and trained.' },
  { ico:<MdVideocam size={24}/>,        t:'HD & IP Cameras',       d:'High-quality cameras for crystal-clear day and night footage.' },
  { ico:<MdFlashOn size={24}/>,         t:'Fast Installation',     d:'Same-day and next-day installation available across Hyderabad.' },
  { ico:<MdSupportAgent size={24}/>,    t:'24/7 Support',          d:'Round-the-clock customer support and emergency response.' },
  { ico:<IoShieldCheckmark size={24}/>, t:'Warranty Included',     d:'All installations come with comprehensive warranty coverage.' },
  { ico:<MdBuild size={24}/>,           t:'Custom Solutions',      d:'Tailored security packages for every budget and requirement.' },
];

const testimonials = [
  { name: 'Lakshmi Rishika', role: 'Office CCTV Installation', text: 'I had an excellent experience with the CCTV installation at my office. The staff was very professional and completed the job without causing any disruption to our work. The camera quality is fantastic, and the remote access feature is a game changer.', r: 5 },
  { name: 'Punyavathi', role: 'Home Security Upgrade', text: 'I recently upgraded my home security system, and I chose to go with their service. The installation was quick, and the technicians were very helpful. I love being able to monitor my home from my phone. Great job!', r: 5 },
  { name: 'chandra kanth', role: 'Home CCTV Setup', text: 'Just had my home CCTV system set up, and I am really pleased with the outcome. The installation was smooth, and the technicians were very respectful of my home. I appreciate how they took the time to answer all my questions.', r: 5 },
  { name: 'Sadullah Syed', role: 'Satisfied Client', text: 'Netking CCTV delivered outstanding service from start to finish. The installation team was punctual, knowledgeable, and efficient. System configuration was well explained, and after-sales support has been very responsive.', r: 5 },
  { name: 'venkatesh Madiwal', role: 'Client', text: 'Good Work and clean work in time. Good Service Excellent Clearty.', r: 5 },
  { name: 'Satyanarayana Satyanarayana', role: 'Client', text: 'Very excellent service', r: 5 },
  { name: 'naresh gupta', role: 'Local Guide', text: 'Excellent device, good service', r: 5 },
  { name: 'Shivaneela19 Sony', role: 'Customer', text: 'Wonderful service very good', r: 5 },
  { name: 'Mohammed Aleem uddin', role: 'Customer', text: 'Giving Best service', r: 5 }
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [testi, setTesti] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p+1) % banners.length), 5500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTesti(p => (p+1) % testimonials.length), 4200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('on');
          const d = e.target.dataset.delay;
          if (d) e.target.style.transitionDelay = d + 'ms';
        }
      }),
      { threshold:0.08 }
    );
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main>

      {/* Hero */}
      <section className="hero-slider">
        {banners.map((b,i) => (
          <div key={b.id} className={`hero-slide ${b.bg} ${i===slide?'active':''}`}>
            <div className="slide-overlay"/><div className="slide-grid"/>
          </div>
        ))}

        {/* Hero Image Slider */}
        <div className="hero-img-slider">
          <div className={`hero-img-slide ${slide===0?'active':''}`}>
            <img src="https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860538/WhatsApp_Image_2026-05-12_at_12.30.51_1_c3mehj.jpg" alt="CCTV Installation"/>
            <div className="his-overlay"/>
            <div className="his-badge"><MdVideocam/><span>HD Camera</span></div>
            <div className="his-live"><span className="hcv-live-dot"/>LIVE</div>
          </div>
          <div className={`hero-img-slide his-2 ${slide===1?'active':''}`}>
            <img src="https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860537/WhatsApp_Image_2026-05-12_at_12.30.50_1_mewzt0.jpg" alt="NetKing"/>
            <div className="his-overlay"/>
            <div className="his-badge"><MdWifi/><span>Remote View</span></div>
            <div className="his-live"><span className="hcv-live-dot"/>LIVE</div>
          </div>
          <div className={`hero-img-slide his-3 ${slide===2?'active':''}`}>
            <img src="https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860537/WhatsApp_Image_2026-05-10_at_13.55.48_1_yd4uda.jpg" alt="Security System"/>
            <div className="his-overlay"/>
            <div className="his-badge"><MdNotificationsActive/><span>Live Alerts</span></div>
            <div className="his-live"><span className="hcv-live-dot"/>LIVE</div>
          </div>
          <div className="his-chips">
            <div className="hcv-chip hcv-c1"><MdVideocam/><span>HD Camera</span></div>
            <div className="hcv-chip hcv-c2"><MdWifi/><span>Remote View</span></div>
            <div className="hcv-chip hcv-c3"><MdNotificationsActive/><span>Live Alerts</span></div>
          </div>
        </div>

        {/* Content */}
        <div className="container hero-content">
          {banners.map((b,i) => (
            <div key={b.id} className={`slide-content ${i===slide?'active':''}`}>
              <div className="slide-tag"><span className="slide-dot"/>{b.tag}</div>
              <h1 className="slide-h1">
                <span className="slide-h1-white">{b.h1}</span>
                <span className="slide-h1-red">{b.h1r}</span>
              </h1>
              <p className="slide-p">{b.p}</p>
              <div className="slide-btns">
                {b.b1.to
                  ? <Link to={b.b1.to} className="btn-red"><FaShieldAlt/>{b.b1.label}</Link>
                  : <a href={b.b1.href} className="btn-red"><MdPhone/>{b.b1.label}</a>
                }
                {b.b2.wa
                  ? <a href={b.b2.href} className="btn-wa" target="_blank" rel="noreferrer"><FaWhatsapp/>{b.b2.label}</a>
                  : b.b2.to
                    ? <Link to={b.b2.to} className="btn-outline">{b.b2.label}<MdArrowForward/></Link>
                    : <a href={b.b2.href} className="btn-outline"><MdPhone/>{b.b2.label}</a>
                }
              </div>
              <div className="slide-trust">
                {['Certified Technicians','1 Year Warranty','Free Consultation'].map(t=>(
                  <span key={t} className="trust-pill"><MdVerified/>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="slider-dots">
          {banners.map((_,i)=>(
            <button key={i} className={`sdot ${i===slide?'on':''}`} onClick={()=>setSlide(i)}/>
          ))}
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="container">
            <div className="stats-row">
              {stats.map(({v,l,ico},i)=>(
                <div key={l} className="stat-item" style={{animationDelay:`${i*.1}s`}}>
                  <span className="stat-ico">{ico}</span>
                  <span className="stat-val">{v}</span>
                  <span className="stat-lbl">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section services-sec">
        <div className="container">
          <span className="eyebrow reveal">What We Offer</span>
          <h2 className="sec-title reveal">Our <span>Services</span></h2>
          <p className="sec-sub reveal">Professional security solutions for every need and budget</p>
          <div className="svc-grid">
            {services.map(({ico,t,d,badge,feats,img},i)=>(
              <div key={t} className="svc-card reveal" data-delay={i*80}>
                <div className="svc-card-img">
                  <img src={img} alt={t} loading="lazy"/>
                  <div className="svc-card-img-overlay"/>
                  {badge && <span className={`svc-badge ${badge==='new'?'badge-new':'badge-hot'}`}>{badge==='new'?'New':'Popular'}</span>}
                </div>
                <div className="svc-card-body">
                  <div className="svc-card-glow" />
                  <div className="svc-card-top">
                    <div className="svc-icon">{ico}</div>
                    <span className="svc-card-num">0{i+1}</span>
                  </div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                  <ul className="svc-feats">
                    {feats.map(f=><li key={f}><MdCheckCircle/>{f}</li>)}
                  </ul>
                  <div className="svc-btns">
                    <a href="tel:9248353592" className="svc-btn svc-call"><MdPhone/>Call</a>
                    <a href="https://wa.me/919248353592" className="svc-btn svc-wa" target="_blank" rel="noreferrer"><FaWhatsapp/>WhatsApp</a>
                  </div>
                </div>
                <div className="svc-card-bar" />
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'44px'}} className="reveal">
            <Link to="/services" className="btn-red">View All Services<MdArrowForward/></Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section why-sec">
        <div className="container">
          <span className="eyebrow reveal">Why NetKing</span>
          <h2 className="sec-title reveal">Why <span>Choose Us?</span></h2>
          <p className="sec-sub reveal">We deliver more than cameras — we deliver peace of mind</p>
          <div className="why-grid">
            {whyUs.map(({ico,t,d},i)=>(
              <div key={t} className="why-card reveal" data-delay={i*70}>
                <div className="why-ico">{ico}</div>
                <div><h3>{t}</h3><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Strip */}
      <section className="about-strip">
        <div className="container about-inner">
          <div className="about-visual reveal-l">
            <div className="about-logo-wrap">
              <img src={logoImg} alt="NetKing"/>
              <div className="about-logo-ring"/>
            </div>
            <div className="about-badge">
              <span className="about-badge-num">10+</span>
              <span className="about-badge-lbl">Years of Excellence</span>
            </div>
          </div>
          <div className="about-text reveal-r">
            <span className="eyebrow" style={{textAlign:'left'}}>About Us</span>
            <h2 className="sec-title" style={{textAlign:'left',fontSize:'clamp(22px,3vw,36px)'}}>
              Hyderabad's <span>Trusted CCTV</span> Partner
            </h2>
            <p>NetKing CCTV Service has been protecting homes and businesses since 2019. Our certified technicians deliver professional installation, maintenance, and 24/7 support for all your security needs.</p>
            <div className="about-points">
              {['500+ Successful Installations','Certified & Trained Technicians','Custom Packages for Every Budget','Same-Day Service Available'].map(pt=>(
                <div key={pt} className="about-pt"><IoShieldCheckmark/>{pt}</div>
              ))}
            </div>
            <Link to="/about" className="btn-red" style={{width:'fit-content'}}>Learn More<MdArrowForward/></Link>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="section clients-sec">
        <div className="container">
          <span className="eyebrow reveal">Our Clients</span>
          <h2 className="sec-title reveal">Trusted By <span>Leading Brands</span></h2>
          <p className="sec-sub reveal">We serve India's most recognized companies and organizations</p>
          <div className="clients-grid">
            {clients.map(({name,logo},i)=>(
              <div key={name} className="client-card reveal" data-delay={i*50}>
                <img src={logo} alt={name} loading="lazy" onError={(e)=>e.target.style.display='none'}/>
                <span className="client-name">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authorized Partners */}
<section className="section partners-sec">
  <div className="container">
    <span className="eyebrow reveal">Our Partners</span>
    <h2 className="sec-title reveal">
      Authorized <span>Partners</span>
    </h2>
    <p className="sec-sub reveal">
      We partner with industry-leading technology providers
    </p>

    <div className="partners-grid">
      {partners.map(({ name, logo }, i) => (
        <div
          key={name}
          className="partner-card reveal"
          data-delay={i * 50}
          style={{ backgroundColor: "#ffffff" }}
        >
          <img
            src={logo}
            alt={name}
            loading="lazy"
            onError={(e) => (e.target.style.display = "none")}
          />

          <span
            className="partner-name"
            style={{ color: "#000000" }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* Testimonials */}
      <section className="section testi-sec">
        <div className="container">
          <span className="eyebrow reveal">Client Reviews</span>
          <h2 className="sec-title reveal">What Our <span>Clients Say</span></h2>
          <div className="testi-wrap reveal">
            <div className="testi-cards">
              {testimonials.map((t,i)=>(
                <div key={i} className={`testi-card ${i===testi?'on':''}`}>
                  <div className="testi-stars">{Array(t.r).fill(0).map((_,j)=><MdStar key={j}/>)}</div>
                  <p className="testi-text">"{t.text}"</p>
                  <div className="testi-author">
                    <div className="testi-av">{t.name[0]}</div>
                    <div><strong>{t.name}</strong><span>{t.role}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="testi-dots">
              {testimonials.map((_,i)=>(
                <button key={i} className={`tdot ${i===testi?'on':''}`} onClick={()=>setTesti(i)}/>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <a 
                href="https://share.google/g6LhSXfz1LeSd6Zv8" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#fff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '999px',
                  color: '#1f2937',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
              >
                ⭐ Share your feedback with us on Google Reviews ✍️
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="container cta-inner reveal">
          <div className="cta-text">
            <h2>Ready to Secure Your Property?</h2>
            <p>Get a free consultation and custom quote from our certified technicians today.</p>
          </div>
          <div className="cta-btns">
            <a href="tel:9248353592" className="btn-cta-white"><MdPhone/>Call: 9248353592</a>
            <a href="https://wa.me/919248353592" className="btn-cta-outline" target="_blank" rel="noreferrer"><FaWhatsapp/>WhatsApp Us</a>
          </div>
        </div>
      </section>

    </main>
  );
}
