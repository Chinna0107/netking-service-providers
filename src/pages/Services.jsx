import { useEffect, useRef, useState } from 'react';
import {
  MdSecurity, MdBuild, MdWifi, MdPhoneAndroid, MdBusiness, MdHome,
  MdLock, MdNotificationsActive, MdPhone, MdCheckCircle, MdArrowForward,
  MdStar, MdVerified, MdFlashOn, MdSupportAgent, MdVideocam, MdSpeed,
  MdShield, MdLocationOn,
} from 'react-icons/md';
import { FaWhatsapp, FaCamera, FaTools, FaAward, FaShieldAlt } from 'react-icons/fa';
import { IoShieldCheckmark } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import './Services.css';

const cats = ['All', 'Installation', 'Monitoring', 'Maintenance', 'Security'];

const services = [
  {
    slug: 'cctv-installation',
    ico: <MdSecurity />, t: 'CCTV Camera Installation', cat: 'Installation',
    // price: 'From ₹3,999', rating: 4.9, reviews: 128,
    desc: 'Professional installation of indoor and outdoor HD & IP cameras with optimal placement for maximum coverage.',
    feats: ['HD & 4K Cameras', 'Night Vision', 'Weatherproof Housing', 'Professional Cabling'],
    badge: 'bs', color: '#e01020',
  },
  {
    slug: 'system-maintenance',
    ico: <MdBuild />, t: 'System Maintenance & Repair', cat: 'Maintenance',
    // price: 'From ₹999', rating: 4.8, reviews: 94,
    desc: 'Regular preventive maintenance and fast repair services to keep your security system at peak performance.',
    feats: ['Annual Contracts', 'Emergency Repairs', 'Firmware Updates', 'Health Checkups'],
    badge: null, color: '#e01020',
  },
  {
    slug: 'remote-monitoring',
    ico: <MdWifi />, t: 'Remote Monitoring Setup', cat: 'Monitoring',
    // price: 'From ₹1,499', rating: 4.9, reviews: 76,
    desc: 'Access your cameras from anywhere in the world with advanced remote monitoring configuration.',
    feats: ['Cloud Storage', 'Real-time Alerts', 'Multi-device Access', 'Encrypted Connection'],
    badge: 'new', color: '#e01020',
  },
  {
    slug: 'mobile-app-integration',
    ico: <MdPhoneAndroid />, t: 'Mobile App Integration', cat: 'Monitoring',
    // price: 'From ₹799', rating: 4.7, reviews: 112,
    desc: 'View live footage and receive instant notifications directly on your smartphone or tablet.',
    feats: ['iOS & Android', 'Push Notifications', 'Live Streaming', 'Playback & Download'],
    badge: null, color: '#e01020',
  },
  {
    slug: 'commercial-surveillance',
    ico: <MdBusiness />, t: 'Commercial Surveillance', cat: 'Installation',
    // price: 'Custom Quote', rating: 5.0, reviews: 43,
    desc: 'Comprehensive surveillance for offices, retail stores, warehouses, and industrial facilities.',
    feats: ['Multi-camera Systems', 'NVR/DVR Setup', 'Network Config', 'Staff Training'],
    badge: 'prem', color: '#e01020',
  },
  {
    slug: 'home-security',
    ico: <MdHome />, t: 'Home Security Systems', cat: 'Installation',
    // price: 'From ₹5,999', rating: 4.8, reviews: 87,
    desc: 'Complete home security packages designed to protect your family and property around the clock.',
    feats: ['Doorbell Cameras', 'Indoor Cameras', 'Motion Detection', 'Smart Home Integration'],
    badge: null, color: '#e01020',
  },
  {
    slug: 'access-control',
    ico: <MdLock />, t: 'Access Control Systems', cat: 'Security',
    price: '', rating: 4.9, reviews: 55,
    desc: 'Smart access control solutions including biometric, card-based, and keypad entry systems.',
    feats: ['Biometric Readers', 'Card Access', 'Door Controllers', 'Visitor Management'],
    badge: null, color: '#e01020',
  },
  {
    slug: 'alarm-systems',
    ico: <MdNotificationsActive />, t: 'Alarm Systems', cat: 'Security',
    price: '', rating: 4.7, reviews: 68,
    desc: 'Advanced intrusion detection and alarm systems with instant notification and response.',
    feats: ['Motion Sensors', 'Door/Window Sensors', 'Siren Alerts', 'Central Monitoring'],
    badge: null, color: '#e01020',
  },
];

const packages = [
  {
    name: 'Starter', price: 'get quote', period: 'one-time', tag: null,
    feats: ['2 HD Cameras', 'DVR Setup', 'Mobile App', '30m Cable', '1 Year Warranty', 'Basic Support'],
    gradient: 'linear-gradient(135deg,#1a1a1a,#2a0a0a)',
  },
  {
    name: 'Professional', price: 'get quote', period: 'one-time', tag: 'Most Popular',
    feats: ['4 HD Cameras', 'NVR Setup', 'Remote Monitoring', 'Mobile App', '50m Cable', '2 Year Warranty', '24/7 Support'],
    gradient: 'linear-gradient(135deg,#1a0505,#2d0000)',
  },
  {
    name: 'Enterprise', price: 'Custom', period: 'quote', tag: 'Best Value',
    feats: ['8+ IP Cameras', 'Advanced NVR', 'Cloud Storage', 'Access Control', 'Alarm System', 'Dedicated Manager', 'Priority Support'],
    gradient: 'linear-gradient(135deg,#0a0a1a,#1a0a00)',
  },
];

const steps = [
  { n: '01', ico: <MdPhone />, t: 'Contact Us', d: 'Call or WhatsApp us for a free consultation and site assessment.' },
  { n: '02', ico: <MdLocationOn />, t: 'Site Survey', d: 'Our expert visits your property to plan optimal camera placement.' },
  { n: '03', ico: <MdVideocam />, t: 'Installation', d: 'Professional installation with clean cabling and full configuration.' },
  { n: '04', ico: <MdShield />, t: 'Handover', d: 'App setup, demo, and warranty documentation handed to you.' },
];

const statsData = [
  { v: 500, suffix: '+', l: 'Installations', ico: <FaCamera /> },
  { v: 5,   suffix: '+', l: 'Years Active',  ico: <FaAward /> },
  { v: 98,  suffix: '%', l: 'Satisfaction',  ico: <MdStar /> },
  { v: 24,  suffix: '/7', l: 'Support',      ico: <MdSupportAgent /> },
];

const badgeMap = { bs: ['pb-bs', 'Best Seller'], new: ['pb-new', 'New'], prem: ['pb-prem', 'Premium'] };

const serviceImages = {
  'cctv-installation': 'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860537/WhatsApp_Image_2026-05-10_at_13.55.48_1_yd4uda.jpg',
  'system-maintenance': 'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860539/WhatsApp_Image_2026-05-12_at_12.30.53_n8oxpm.jpg',
  'remote-monitoring': 'https://cdn.iplocation.net/assets/images/blog/2024/featured/remote-camera.png',
  'mobile-app-integration': 'https://www.cctvcamerapros.com/v/4K/View-Security-Cameras-Android-App.jpg',
  'commercial-surveillance': 'https://www.techaptiva.com/wp-content/uploads/2022/08/cctv-security-technology-with-lock-icon-digital-remix-scaled.jpg',
  'home-security': 'https://content.jdmagicbox.com/v2/comp/bangalore/s8/080pxx80.xx80.240816202547.r7s8/catalogue/future-security-systems-marathahalli-bangalore-security-system-installation-services-nmzayr38cp.jpg',
  'access-control': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQft8a1F-hN3oKjOG07scinQdBYEyt_iSV2Gw&s',
  'alarm-systems': 'https://content.jdmagicbox.com/v2/comp/bangalore/s9/080pxx80.xx80.170208152937.s6s9/catalogue/quantum-techno-solutions-kammanahalli-bangalore-security-system-dealers-0vf6imnqlz.jpg',
};

function CountUp({ target, suffix }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let start = 0;
      const step = Math.ceil(target / 50);
      const t = setInterval(() => {
        start = Math.min(start + step, target);
        setVal(start);
        if (start >= target) clearInterval(t);
      }, 30);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function Services() {
  const [cat, setCat] = useState('All');

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('on');
          const d = e.target.dataset.delay;
          if (d) e.target.style.transitionDelay = d + 'ms';
        }
      }),
      { threshold: 0.06 }
    );
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const filtered = cat === 'All' ? services : services.filter(s => s.cat === cat);


  return (
    <main className="services-page">

      {/* ── Hero ── */}
      <section className="svc-hero">
        <div className="svc-hero-bg">
          <div className="svc-hero-orb svc-orb1" />
          <div className="svc-hero-orb svc-orb2" />
          <div className="svc-hero-grid" />
        </div>
        <div className="container svc-hero-inner">
          <div className="svc-hero-text">
            <div className="svc-hero-tag reveal"><span className="svc-tag-dot" />Professional Security Services</div>
            <h1 className="svc-hero-h1 reveal">
              <span>Complete</span><br />
              <span className="svc-h1-red">Security Solutions</span>
            </h1>
            <p className="svc-hero-p reveal">
              From single cameras to enterprise-grade surveillance — we design, install and maintain your entire security ecosystem across Hyderabad.
            </p>
            <div className="svc-hero-btns reveal">
              <a href="tel:9248353592" className="btn-red"><MdPhone />Call for Free Quote</a>
              <a href="https://wa.me/919248353592" className="btn-wa-s" target="_blank" rel="noreferrer"><FaWhatsapp />WhatsApp Us</a>
            </div>
            <div className="svc-hero-trust reveal">
              {['500+ Installs', 'Certified Team', '1 Yr Warranty', '24/7 Support'].map(t => (
                <span key={t} className="svc-trust-pill"><IoShieldCheckmark />{t}</span>
              ))}
            </div>
          </div>
          <div className="svc-hero-visual reveal-r">
            <div className="shv-ring shv-r1" /><div className="shv-ring shv-r2" /><div className="shv-ring shv-r3" />
            <div className="shv-core">
              <FaShieldAlt className="shv-icon" />
              <div className="shv-scan" />
              <div className="shv-live"><span className="shv-dot" />LIVE</div>
            </div>
            <div className="shv-pulse" /><div className="shv-pulse shv-p2" />
            <div className="shv-chip shv-c1"><MdVideocam /><span>HD Cameras</span></div>
            <div className="shv-chip shv-c2"><MdFlashOn /><span>Fast Install</span></div>
            <div className="shv-chip shv-c3"><MdVerified /><span>Certified</span></div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="svc-stats-bar">
          <div className="container">
            <div className="svc-stats-row">
              {statsData.map(({ v, suffix, l, ico }) => (
                <div key={l} className="svc-stat">
                  <span className="svc-stat-ico">{ico}</span>
                  <span className="svc-stat-val"><CountUp target={v} suffix={suffix} /></span>
                  <span className="svc-stat-lbl">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter + Cards ── */}
      <section className="svc-cards-sec">
        <div className="container" style={{ paddingBottom: '32px' }}>
          <span className="eyebrow reveal">What We Offer</span>
          <h2 className="sec-title reveal">Our <span>Services</span></h2>
          <p className="sec-sub reveal">Professional security solutions for every need and budget</p>
        </div>

        <div className="svc-filter-bar">
          <div className="container svc-filter-inner">
            {cats.map(c => (
              <button key={c} className={`svc-filter-btn ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="container" style={{ paddingTop: '52px', paddingBottom: '88px' }}>
          <div className="svc-grid">
            {filtered.map(({ slug, ico, t, cat: c, price, rating, reviews, desc, feats, badge }, i) => (
              <Link key={t} to={`/service/${slug}`} className="svc-card reveal" data-delay={i * 60}>
                <div className="svc-card-glow" />
                {badge && (
                  <span className={`svc-badge ${badgeMap[badge][0]}`}>{badgeMap[badge][1]}</span>
                )}
                {/* Service Image */}
                <img src={serviceImages[slug]} alt={t} className="svc-card-img" loading="lazy" />
                <div className="svc-card-top">
                  <div className="svc-card-ico">{ico}</div>
                  <div className="svc-card-rating">
                    <MdStar /><span>{rating}</span>
                    <span className="svc-reviews">({reviews})</span>
                  </div>
                </div>
                <h3 className="svc-card-title">{t}</h3>
                <span className="svc-card-cat">{c}</span>
                <p className="svc-card-desc">{desc}</p>
                <ul className="svc-card-feats">
                  {feats.map(f => <li key={f}><MdCheckCircle />{f}</li>)}
                </ul>
                <div className="svc-card-footer">
                  <span className="svc-card-price">{price}</span>
                  <div className="svc-card-btns">
                    <a href="tel:9248353592" className="svc-btn svc-btn-call" onClick={e=>e.preventDefault()}><MdPhone />Call</a>
                    <a href="https://wa.me/919248353592" className="svc-btn svc-btn-wa" target="_blank" rel="noreferrer" onClick={e=>e.preventDefault()}><FaWhatsapp />WhatsApp</a>
                  </div>
                </div>
                <div className="svc-card-bar" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section svc-process-sec">
        <div className="container">
          <span className="eyebrow reveal">Simple Process</span>
          <h2 className="sec-title reveal">How It <span>Works</span></h2>
          <p className="sec-sub reveal">From first call to full installation — we make it effortless</p>
          <div className="svc-steps">
            {steps.map(({ n, ico, t, d }, i) => (
              <div key={t} className="svc-step reveal" data-delay={i * 100}>
                <div className="svc-step-num">{n}</div>
                <div className="svc-step-ico">{ico}</div>
                <h3>{t}</h3>
                <p>{d}</p>
                {i < steps.length - 1 && <div className="svc-step-arrow"><MdArrowForward /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="section svc-pkg-sec">
        <div className="container">
          <span className="eyebrow reveal">Pricing Plans</span>
          <h2 className="sec-title reveal">Security <span>Packages</span></h2>
          <p className="sec-sub reveal">Transparent pricing — no hidden costs, no surprises</p>
          <div className="svc-pkg-grid">
            {packages.map(({ name, price, period, tag, feats, gradient }, i) => (
              <div
                key={name}
                className={`svc-pkg-card reveal ${tag === 'Most Popular' ? 'pkg-featured' : ''}`}
                data-delay={i * 100}
                style={{ '--pkg-grad': gradient }}
              >
                {tag && <div className="pkg-ribbon">{tag}</div>}
                <div className="pkg-glow" />
                <div className="pkg-header">
                  <div className="pkg-icon-wrap"><FaShieldAlt /></div>
                  <h3 className="pkg-name">{name}</h3>
                  <div className="pkg-price-wrap">
                    <span className="pkg-amount">{price}</span>
                    <span className="pkg-period">{period}</span>
                  </div>
                </div>
                <ul className="pkg-feat-list">
                  {feats.map(f => (
                    <li key={f}><MdCheckCircle />{f}</li>
                  ))}
                </ul>
                <div className="pkg-actions">
                  <a href="tel:9248353592" className="btn-red" style={{ justifyContent: 'center' }}><MdPhone />Call Now</a>
                  <a href="https://wa.me/919248353592" className="btn-wa-s" style={{ justifyContent: 'center' }} target="_blank" rel="noreferrer"><FaWhatsapp />WhatsApp</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us strip ── */}
      <section className="svc-why-strip">
        <div className="container svc-why-inner">
          <div className="svc-why-text reveal-l">
            <span className="eyebrow" style={{ textAlign: 'left' }}>Why NetKing</span>
            <h2 className="sec-title" style={{ textAlign: 'left', color: '#fff' }}>
              Hyderabad's <span>Most Trusted</span> CCTV Partner
            </h2>
            <p style={{ color: '#888', lineHeight: 1.8, fontSize: '15px' }}>
              With 5+ years of experience and 500+ successful installations, we deliver security solutions that actually work — backed by real support.
            </p>
            <Link to="/contact" className="btn-red" style={{ width: 'fit-content', marginTop: '8px' }}>
              Get Free Consultation <MdArrowForward />
            </Link>
          </div>
          <div className="svc-why-grid reveal-r">
            {[
              { ico: <MdVerified />, t: 'Certified Technicians', d: 'Professionally trained & certified team.' },
              { ico: <MdSpeed />, t: 'Same-Day Service', d: 'Fast response across all of Hyderabad.' },
              { ico: <IoShieldCheckmark />, t: '1 Year Warranty', d: 'All installations fully covered.' },
              { ico: <MdSupportAgent />, t: '24/7 Support', d: 'Round-the-clock emergency response.' },
            ].map(({ ico, t, d }) => (
              <div key={t} className="svc-why-card">
                <div className="svc-why-ico">{ico}</div>
                <div><strong>{t}</strong><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="svc-cta">
        <div className="svc-cta-orb" />
        <div className="container svc-cta-inner reveal">
          <h2>Ready to Secure Your Property?</h2>
          <p>Get a free site survey and custom quote — no obligation, no pressure.</p>
          <div className="svc-cta-btns">
            <a href="tel:9248353592" className="btn-cta-w"><MdPhone />Call: 9248353592</a>
            <a href="https://wa.me/919248353592" className="btn-cta-o" target="_blank" rel="noreferrer"><FaWhatsapp />WhatsApp Us</a>
          </div>
        </div>
      </section>

    </main>
  );
}
