import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdVerified, MdSupportAgent, MdBuild, MdVideocam, MdFlashOn, MdPhone, MdArrowForward, MdLocationOn } from 'react-icons/md';
import { FaWhatsapp, FaShieldAlt, FaCamera, FaTools, FaAward } from 'react-icons/fa';
import { IoShieldCheckmark } from 'react-icons/io5';
import logo from '../assets/logo.jpeg';
import './About.css';

const stats = [
  { v:'500+', l:'Installations', ico:<FaCamera/> },
  { v:'5+',   l:'Years Active',  ico:<FaAward/> },
  { v:'98%',  l:'Satisfaction',  ico:<IoShieldCheckmark/> },
  { v:'24/7', l:'Support',       ico:<MdSupportAgent/> },
];
const values = [
  { ico:<FaShieldAlt size={28}/>, t:'Our Mission', d:'To provide cutting-edge security solutions that protect lives and assets with reliability and innovation.', cls:'vc-a' },
  { ico:<MdVideocam size={28}/>,  t:'Our Vision',  d:'To be the most trusted security partner across Hyderabad, setting new standards in surveillance technology.', cls:'vc-b' },
  { ico:<MdVerified size={28}/>,  t:'Our Values',  d:'Integrity, professionalism, and a customer-first approach in every installation and service we deliver.', cls:'vc-a' },
];
const milestones = [
  { year:'2013', t:'NetKing Founded',       d:'Started with a vision to make professional security accessible to everyone in Hyderabad.', ico:<FaShieldAlt/> },
  { year:'2018', t:'100+ Installations',    d:'Reached our first major milestone serving homes and small businesses across the city.', ico:<FaCamera/> },
  { year:'2022', t:'Commercial Expansion',  d:'Expanded services to large commercial clients, offices, and industrial facilities.', ico:<MdBuild/> },
  { year:'2025', t:'500+ Happy Clients',    d:'Trusted by over 500 clients with a 98% satisfaction rate across Hyderabad region.', ico:<FaAward/> },
];
const highlights = [
  { ico:<MdVerified/>, t:'Professional & Certified Technicians' },
  { ico:<MdVideocam/>, t:'High-Quality HD & IP Cameras' },
  { ico:<MdFlashOn/>,  t:'Same-Day Installation Available' },
  { ico:<MdSupportAgent/>, t:'24/7 Customer Support' },
  { ico:<FaTools/>,    t:'Annual Maintenance Contracts' },
  { ico:<IoShieldCheckmark/>, t:'Comprehensive Warranty Coverage' },
];
const team = [
  { n:'Technical Team', r:'Certified CCTV Technicians', ico:<FaTools size={28}/>,       tag:'10+ Experts',        img:'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80' },
  { n:'Support Team',   r:'24/7 Customer Support',      ico:<MdSupportAgent size={28}/>, tag:'Always Available',   img:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80' },
  { n:'Sales Team',     r:'Security Consultants',        ico:<MdVerified size={28}/>,     tag:'Free Consultation',  img:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
];

export default function About() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('on'); const d=e.target.dataset.delay; if(d) e.target.style.transitionDelay=d+'ms'; } }), { threshold:0.08 });
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="about-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow reveal">Who We Are</span>
          <h1 className="sec-title reveal">About <span>NetKing</span></h1>
          <p className="sec-sub reveal">Hyderabad's trusted CCTV installation and security service provider since 2013. We protect what matters most.</p>
          <div className="about-hero-btns reveal">
            <a href="tel:9248353592" className="btn-red"><MdPhone/>Call Us</a>
            <Link to="/contact" className="btn-outline">Get Free Quote<MdArrowForward/></Link>
          </div>
        </div>
      </section>

      <div className="stats-strip">
        <div className="container">
          <div className="stats-strip-row">
            {stats.map(({v,l,ico},i) => (
              <div key={l} className="ss-item reveal" data-delay={i*100}>
                <span className="ss-ico">{ico}</span>
                <span className="ss-val">{v}</span>
                <span className="ss-lbl">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section story-sec">
        <div className="container story-grid">
          <div className="story-vis reveal-l">
            <div className="story-img-wrap">
              <img src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=700&q=85" alt="CCTV Installation"/>
              <div className="story-img-overlay"/>
              <div className="story-logo-badge">
                <img src={logo} alt="NetKing"/>
                <div>
                  <span className="slb-name">NetKing</span>
                  <span className="slb-sub">Security Systems</span>
                </div>
              </div>
              <div className="story-float"><span className="sf-num">5+</span><span className="sf-lbl">Years of Excellence</span></div>
            </div>
            <div className="story-mini">
              {[['500+','Installations'],['98%','Satisfaction'],['24/7','Support']].map(([v,l]) => (
                <div key={l} className="sm-item"><span className="sm-val">{v}</span><span className="sm-lbl">{l}</span></div>
              ))}
            </div>
            <div className="story-loc"><MdLocationOn/><span>Serving Hyderabad &amp; Telangana</span></div>
          </div>
          <div className="story-text reveal-r">
            <span className="eyebrow" style={{textAlign:'left'}}>Our Story</span>
            <h2 className="sec-title" style={{textAlign:'left',fontSize:'clamp(22px,3vw,36px)'}}>Protecting What <span>Matters Most</span></h2>
            <p>"NetKing Security Systems" is a leading organization providing solutions related to CCTV sales & services. "NetKing Security Systems" is based in Hyderabad, Telangana, India founded by Mr. Syed Kaleem in 2013. We aim to help people better connect with the world around them with a wealth of intelligent products, we strive to identify and satisfy diverse demands by delivering intelligence at your fingertips. We are dedicated to empowering every individual to enjoy a better future by building an intelligent world that is more convenient, efficient and secure.</p>
            <p>At NetKing Security Systems, we understand there is no One-size-fits-all solutions. As such we customize our solutions as per specific needs of the clients and go beyond the client's expectations. Many of the solutions have been developed from scratch in response to specific needs of its customers.</p>
            <p>We specialize in the installation, maintenance, and support of CCTV systems for homes, businesses, and industrial properties. Our certified technicians bring expertise and dedication to every project.</p>
            <div className="story-pts">{highlights.map(({ico,t}) => <div key={t} className="story-pt">{ico}{t}</div>)}</div>
            <div className="story-acts">
              <a href="tel:9248353592" className="btn-red"><MdPhone/>Call Now</a>
              <a href="https://wa.me/919248353592" className="btn-wa-a" target="_blank" rel="noreferrer"><FaWhatsapp/>WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section vals-sec">
        <div className="container">
          <span className="eyebrow reveal">What Drives Us</span>
          <h2 className="sec-title reveal">Our <span>Core Values</span></h2>
          <div className="vals-grid">
            {values.map(({ico,t,d,cls},i) => (
              <div key={t} className={`val-card reveal ${cls}`} data-delay={i*100}>
                <div className="val-ico">{ico}</div>
                <h3>{t}</h3><p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section tl-sec">
        <div className="container">
          <span className="eyebrow reveal">Our Journey</span>
          <h2 className="sec-title reveal">Company <span>Milestones</span></h2>
          <div className="timeline">
            <div className="tl-line"/>
            {milestones.map(({year,t,d,ico},i) => (
              <div key={year} className={`tl-item ${i%2===0?'tl-l':'tl-r'} reveal`} data-delay={i*120}>
                <div className="tl-card">
                  <div className="tl-ico">{ico}</div>
                  <span className="tl-year">{year}</span>
                  <h3>{t}</h3><p>{d}</p>
                </div>
                <div className="tl-dot"><div className="tl-dot-inner"/></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section team-sec">
        <div className="container">
          <span className="eyebrow reveal">The People</span>
          <h2 className="sec-title reveal">Our <span>Team</span></h2>
          <p className="sec-sub reveal">Dedicated professionals committed to your security</p>
          <div className="team-grid">
            {team.map(({n,r,ico,tag,img},i) => (
              <div key={n} className="team-card reveal" data-delay={i*100}>
                <div className="team-card-img">
                  <img src={img} alt={n} loading="lazy"/>
                  <div className="team-card-img-overlay"/>
                </div>
                <div className="team-card-body">
                  <div className="team-ico">{ico}</div>
                  <h3>{n}</h3><p>{r}</p>
                  <span className="team-tag">{tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta-sec">
        <div className="container about-cta-inner reveal">
          <h2>Ready to Work With Us?</h2>
          <p>Get a free security assessment for your home or business today.</p>
          <div className="about-cta-btns">
            <a href="tel:9248353592" className="btn-cta-w"><MdPhone/>Call: 9248353592</a>
            <a href="https://wa.me/919248353592" className="btn-cta-o" target="_blank" rel="noreferrer"><FaWhatsapp/>WhatsApp Us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
