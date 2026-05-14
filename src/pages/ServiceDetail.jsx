import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MdSecurity, MdBuild, MdWifi, MdPhoneAndroid, MdBusiness, MdHome,
  MdLock, MdNotificationsActive, MdCheckCircle, MdArrowBack, MdPhone,
  MdArrowForward, MdStar, MdVerified, MdSpeed, MdSupportAgent,
} from 'react-icons/md';
import { FaWhatsapp, FaCamera, FaTools, FaShieldAlt } from 'react-icons/fa';
import { IoShieldCheckmark } from 'react-icons/io5';
import './ServiceDetail.css';

const serviceData = {
  'cctv-installation': {
    slug: 'cctv-installation',
    icon: <MdSecurity />, emoji: '📷',
    title: 'CCTV Camera Installation',
    tagline: 'Professional HD & 4K surveillance for homes and businesses',
    price: 'From ₹3,999',
    rating: 4.9, reviews: 128,
    color: '#e01020',
    about: `Our CCTV Camera Installation service provides end-to-end surveillance setup using the latest HD, Full HD, and 4K cameras. Our certified technicians assess your property, plan optimal camera placement for maximum coverage, and install with clean professional cabling — indoors and outdoors.`,
    howItWorks: [
      { step:'01', t:'Site Survey', d:'Our expert visits your property to assess entry points, blind spots, and optimal camera positions.' },
      { step:'02', t:'Camera Selection', d:'We recommend the right camera type — dome, bullet, PTZ, or fisheye — based on your specific needs.' },
      { step:'03', t:'Professional Install', d:'Clean cabling, weatherproof mounting, and DVR/NVR configuration done by certified technicians.' },
      { step:'04', t:'App & Handover', d:'Mobile app setup, live view testing, and full warranty documentation handed to you.' },
    ],
    features: ['HD, Full HD & 4K Cameras','Night Vision (up to 30m)','Weatherproof IP66 Housing','Professional Cabling & Conduit','DVR/NVR Configuration','Remote Viewing Setup','Motion Detection Alerts','1 Year Installation Warranty'],
    types: [
      { t:'Dome Cameras', d:'Discreet indoor/outdoor cameras ideal for offices and retail.' },
      { t:'Bullet Cameras', d:'Long-range outdoor cameras for perimeter and parking areas.' },
      { t:'PTZ Cameras', d:'Pan-Tilt-Zoom cameras for large areas with remote control.' },
      { t:'Fisheye Cameras', d:'360° coverage for warehouses and open spaces.' },
    ],
    faqs: [
      { q:'How many cameras do I need?', a:'Depends on property size. A typical home needs 4–6 cameras; offices may need 8–16+. We assess and recommend.' },
      { q:'Can I view cameras on my phone?', a:'Yes! We configure remote viewing on iOS and Android apps as part of every installation.' },
      { q:'What is the warranty?', a:'All installations come with a 1-year warranty on labour and we assist with manufacturer warranty on hardware.' },
    ],
  },
  'system-maintenance': {
    slug: 'system-maintenance',
    icon: <MdBuild />, emoji: '🔧',
    title: 'System Maintenance & Repair',
    tagline: 'Keep your security system running smoothly with expert maintenance',
    price: 'From ₹999',
    rating: 4.8, reviews: 94,
    color: '#e01020',
    about: `Regular preventive maintenance and fast repair services to keep your security system at peak performance. We offer annual maintenance contracts, emergency repairs, firmware updates, and complete system health checkups.`,
    howItWorks: [
      { step:'01', t:'System Inspection', d:'Comprehensive inspection of all cameras, DVR/NVR, and cabling.' },
      { step:'02', t:'Preventive Maintenance', d:'Cleaning, firmware updates, and performance optimization.' },
      { step:'03', t:'Issue Resolution', d:'Fast diagnosis and repair of any problems found.' },
      { step:'04', t:'Documentation', d:'Detailed maintenance report and recommendations provided.' },
    ],
    features: ['Annual Maintenance Contracts','Emergency Repairs','Firmware Updates','Health Checkups','Cable Testing','Performance Optimization','Spare Parts Replacement','24/7 Support'],
    types: [
      { t:'Annual AMC', d:'Yearly maintenance contract with quarterly visits.' },
      { t:'Emergency Repair', d:'Same-day emergency repair service for critical issues.' },
      { t:'Preventive Maintenance', d:'Regular checkups to prevent problems before they occur.' },
      { t:'Upgrade Service', d:'Upgrade existing systems with new features and components.' },
    ],
    faqs: [
      { q:'How often should I maintain my system?', a:'We recommend quarterly maintenance for commercial systems and bi-annual for residential systems.' },
      { q:'What is included in AMC?', a:'AMC includes regular inspections, cleaning, firmware updates, and priority emergency support.' },
      { q:'Do you provide spare parts?', a:'Yes, we stock common spare parts and can source any component quickly.' },
    ],
  },
  'remote-monitoring': {
    slug: 'remote-monitoring',
    icon: <MdWifi />, emoji: '📡',
    title: 'Remote Monitoring Setup',
    tagline: 'Access your cameras from anywhere in the world',
    price: 'From ₹1,499',
    rating: 4.9, reviews: 76,
    color: '#0078ff',
    about: `Advanced remote monitoring configuration allows you to access your cameras from anywhere in the world. We set up cloud storage, real-time alerts, multi-device access, and encrypted connections for maximum security.`,
    howItWorks: [
      { step:'01', t:'Network Setup', d:'Configure your network for secure remote access.' },
      { step:'02', t:'Cloud Integration', d:'Set up cloud storage and backup for your footage.' },
      { step:'03', t:'App Configuration', d:'Configure mobile app access with proper authentication.' },
      { step:'04', t:'Alert Setup', d:'Configure real-time alerts for motion and events.' },
    ],
    features: ['Cloud Storage','Real-time Alerts','Multi-device Access','Encrypted Connection','Mobile App','Web Dashboard','Event Recording','Backup Storage'],
    types: [
      { t:'Cloud Storage', d:'Secure cloud backup for all your footage.' },
      { t:'Mobile App Access', d:'View cameras on iOS and Android devices.' },
      { t:'Web Dashboard', d:'Access from any browser with secure login.' },
      { t:'Alert System', d:'Get instant notifications for motion and events.' },
    ],
    faqs: [
      { q:'Is remote access secure?', a:'Yes, we use AES encryption and secure authentication protocols.' },
      { q:'What is the cloud storage cost?', a:'Cloud storage is optional and charged separately based on retention period.' },
      { q:'Can I access from multiple devices?', a:'Yes, you can access from unlimited devices with your login credentials.' },
    ],
  },
  'mobile-app-integration': {
    slug: 'mobile-app-integration',
    icon: <MdPhoneAndroid />, emoji: '📱',
    title: 'Mobile App Integration',
    tagline: 'View live footage and get instant notifications on your phone',
    price: 'From ₹799',
    rating: 4.7, reviews: 112,
    color: '#8b5cf6',
    about: `View live footage and receive instant notifications directly on your smartphone or tablet. Our mobile app integration supports both iOS and Android with push notifications, live streaming, and playback features.`,
    howItWorks: [
      { step:'01', t:'App Installation', d:'Download and install the NetKing app on your device.' },
      { step:'02', t:'Account Setup', d:'Create account and add your cameras to the app.' },
      { step:'03', t:'Configuration', d:'Configure notifications and preferences.' },
      { step:'04', t:'Live Viewing', d:'Start viewing live footage and receiving alerts.' },
    ],
    features: ['iOS & Android','Push Notifications','Live Streaming','Playback & Download','Multi-Camera View','Event Alerts','Cloud Integration','Offline Viewing'],
    types: [
      { t:'iOS App', d:'Native iOS app for iPhone and iPad.' },
      { t:'Android App', d:'Native Android app for all Android devices.' },
      { t:'Web App', d:'Browser-based access from any device.' },
      { t:'Smart TV', d:'View on smart TVs and streaming devices.' },
    ],
    faqs: [
      { q:'Is the app free?', a:'Yes, the app is free to download. You only pay for cloud storage if you use it.' },
      { q:'Can I view multiple cameras?', a:'Yes, you can view all your cameras in one app with multi-view option.' },
      { q:'What if I lose my phone?', a:'Your account remains secure. Just log in on another device to regain access.' },
    ],
  },
  'commercial-surveillance': {
    slug: 'commercial-surveillance',
    icon: <MdBusiness />, emoji: '🏢',
    title: 'Commercial Surveillance',
    tagline: 'Comprehensive surveillance for offices, retail, and warehouses',
    price: 'Custom Quote',
    rating: 5.0, reviews: 43,
    color: '#f59e0b',
    about: `Comprehensive surveillance for offices, retail stores, warehouses, and industrial facilities. We design and install multi-camera systems with NVR/DVR setup, network configuration, and staff training.`,
    howItWorks: [
      { step:'01', t:'Site Assessment', d:'Detailed assessment of your facility and security needs.' },
      { step:'02', t:'System Design', d:'Custom design of surveillance system for your space.' },
      { step:'03', t:'Installation', d:'Professional installation with minimal disruption.' },
      { step:'04', t:'Training', d:'Complete training for your staff on system operation.' },
    ],
    features: ['Multi-camera Systems','NVR/DVR Setup','Network Configuration','Staff Training','Access Control','Alarm Integration','Remote Monitoring','Backup Power'],
    types: [
      { t:'Retail Surveillance', d:'Comprehensive coverage for retail stores and malls.' },
      { t:'Office Security', d:'Professional surveillance for corporate offices.' },
      { t:'Warehouse Monitoring', d:'Large-scale surveillance for warehouses and factories.' },
      { t:'Industrial Security', d:'Specialized systems for industrial facilities.' },
    ],
    faqs: [
      { q:'How many cameras do I need?', a:'Depends on facility size and layout. We assess and recommend.' },
      { q:'Can I integrate with existing systems?', a:'Yes, we can integrate with most existing security systems.' },
      { q:'What about data retention?', a:'We recommend 30-90 days retention based on your needs.' },
    ],
  },
  'home-security': {
    slug: 'home-security',
    icon: <MdHome />, emoji: '🏠',
    title: 'Home Security Systems',
    tagline: 'Complete home security packages for families',
    price: 'From ₹5,999',
    rating: 4.8, reviews: 87,
    color: '#10b981',
    about: `Complete home security packages designed to protect your family and property around the clock. We offer doorbell cameras, indoor cameras, motion detection, and smart home integration.`,
    howItWorks: [
      { step:'01', t:'Home Assessment', d:'Assess your home layout and security needs.' },
      { step:'02', t:'Package Selection', d:'Choose from starter, standard, or premium packages.' },
      { step:'03', t:'Installation', d:'Professional installation with minimal disruption.' },
      { step:'04', t:'Setup & Training', d:'Complete setup and training for your family.' },
    ],
    features: ['Doorbell Cameras','Indoor Cameras','Motion Detection','Smart Home Integration','Mobile Alerts','Night Vision','Two-Way Audio','Cloud Storage'],
    types: [
      { t:'Starter Package', d:'2 cameras with basic features for small homes.' },
      { t:'Standard Package', d:'4 cameras with advanced features for medium homes.' },
      { t:'Premium Package', d:'6+ cameras with all features for large homes.' },
      { t:'Smart Home', d:'Integration with smart home systems.' },
    ],
    faqs: [
      { q:'Is installation easy?', a:'Yes, our technicians handle all installation. No technical knowledge needed.' },
      { q:'Can I add more cameras later?', a:'Yes, the system is expandable. You can add cameras anytime.' },
      { q:'What about privacy?', a:'All footage is encrypted and stored securely. Only you have access.' },
    ],
  },
  'access-control': {
    slug: 'access-control',
    icon: <MdLock />, emoji: '🛡️',
    title: 'Smart Door Access Control',
    tagline: 'Control who enters your premises with intelligent access management',
    price: 'From ₹6,999',
    rating: 4.9, reviews: 55,
    color: '#e01020',
    about: `Access Control Systems restrict entry to authorized personnel only. We design and install complete access control solutions — from single-door card readers to multi-door enterprise systems with centralized management, visitor logs, and integration with CCTV.`,
    howItWorks: [
      { step:'01', t:'Security Audit', d:'We map all access points and define access levels for different user groups.' },
      { step:'02', t:'System Design', d:'Design the controller network, reader placement, and software architecture.' },
      { step:'03', t:'Installation', d:'Install controllers, card readers, electric locks, and connect to management software.' },
      { step:'04', t:'User Management', d:'Configure access levels, issue cards/fobs, and train administrators.' },
    ],
    features: ['RFID Card & Fob Access','Biometric Integration','Electric Strike & Magnetic Locks','Centralized Management Software','Access Level Configuration','Visitor Management','Real-Time Entry/Exit Logs','CCTV Integration'],
    types: [
      { t:'Single Door Controller', d:'Simple card reader and controller for one entry point.' },
      { t:'Multi-Door System', d:'Centralized control for multiple doors across a facility.' },
      { t:'Turnstile & Flap Barrier', d:'Physical barriers for high-security or high-traffic areas.' },
      { t:'Parking Access Control', d:'Boom barriers and RFID for vehicle access management.' },
    ],
    faqs: [
      { q:'Can I restrict access by time?', a:'Yes, time-based access schedules allow you to restrict entry to specific hours for specific users.' },
      { q:'What happens during a power cut?', a:'Systems have battery backup and fail-safe/fail-secure lock options based on your security requirements.' },
      { q:'Can it integrate with CCTV?', a:'Yes, we integrate access control with CCTV so every entry/exit is recorded with video evidence.' },
    ],
  },
  'alarm-systems': {
    slug: 'alarm-systems',
    icon: <MdNotificationsActive />, emoji: '🚨',
    title: 'Alarm Systems',
    tagline: 'Advanced intrusion detection with instant alerts',
    price: 'From ₹2,999',
    rating: 4.7, reviews: 68,
    color: '#e01020',
    about: `Advanced intrusion detection and alarm systems with instant notification and response. We install motion sensors, door/window sensors, siren alerts, and central monitoring.`,
    howItWorks: [
      { step:'01', t:'Site Survey', d:'Assess entry points and vulnerable areas.' },
      { step:'02', t:'Sensor Placement', d:'Strategic placement of motion and door sensors.' },
      { step:'03', t:'System Configuration', d:'Configure alarm zones and alert settings.' },
      { step:'04', t:'Monitoring Setup', d:'Set up central monitoring and emergency contacts.' },
    ],
    features: ['Motion Sensors','Door/Window Sensors','Siren Alerts','Central Monitoring','Mobile Alerts','24/7 Monitoring','Emergency Response','Backup Power'],
    types: [
      { t:'Wired System', d:'Reliable wired alarm system for permanent installation.' },
      { t:'Wireless System', d:'Easy-to-install wireless system with no wiring.' },
      { t:'Hybrid System', d:'Combination of wired and wireless sensors.' },
      { t:'Smart Alarm', d:'Integration with smart home and mobile alerts.' },
    ],
    faqs: [
      { q:'What triggers the alarm?', a:'Motion detection, door/window opening, or manual trigger.' },
      { q:'Can I disarm remotely?', a:'Yes, smart systems allow remote arming/disarming via app.' },
      { q:'Is monitoring service available?', a:'Yes, we offer 24/7 professional monitoring service.' },
    ],
  },
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const svc = serviceData[slug];

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.06 }
    );
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [slug]);

  if (!svc) return (
    <main className="sd-notfound">
      <h2>Service not found</h2>
      <Link to="/services" className="btn-red"><MdArrowBack/>Back to Services</Link>
    </main>
  );

  return (
    <main className="sd-page" style={{'--svc-color': svc.color}}>

      {/* Hero */}
      <section className="sd-hero">
        <div className="sd-hero-bg">
          <div className="sd-orb sd-o1"/><div className="sd-orb sd-o2"/>
          <div className="sd-grid"/>
        </div>
        <div className="container sd-hero-inner">
          <button className="sd-back reveal" onClick={()=>navigate('/services')}>
            <MdArrowBack/>All Services
          </button>
          <div className="sd-hero-content">
            <div className="sd-hero-text">
              <div className="sd-hero-ico reveal">{svc.icon}</div>
              <span className="eyebrow reveal" style={{textAlign:'left'}}>NetKing Services</span>
              <h1 className="sd-h1 reveal">{svc.title}</h1>
              <p className="sd-tagline reveal">{svc.tagline}</p>
              <div className="sd-meta reveal">
                <span className="sd-price">{svc.price}</span>
                <span className="sd-rating"><MdStar/>{svc.rating} <span>({svc.reviews} reviews)</span></span>
              </div>
              <div className="sd-hero-btns reveal">
                <a href="tel:9248353592" className="btn-red"><MdPhone/>Call for Quote</a>
                <a href="https://wa.me/919248353592" className="btn-wa" target="_blank" rel="noreferrer"><FaWhatsapp/>WhatsApp</a>
              </div>
            </div>
            <div className="sd-hero-visual reveal-r">
              <div className="sd-vis-ring sd-vr1"/><div className="sd-vis-ring sd-vr2"/>
              <div className="sd-vis-core">
                <span className="sd-vis-emoji">{svc.emoji}</span>
                <div className="sd-vis-scan"/>
              </div>
              <div className="sd-vis-pulse"/><div className="sd-vis-pulse sd-vp2"/>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section sd-about-sec">
        <div className="container">
          <div className="sd-about-grid">
            <div className="reveal-l">
              <span className="eyebrow" style={{textAlign:'left'}}>About This Service</span>
              <h2 className="sec-title" style={{textAlign:'left'}}>What We <span>Provide</span></h2>
              <p className="sd-about-text">{svc.about}</p>
              <div className="sd-trust-row">
                {[<><IoShieldCheckmark/>Certified Team</>,<><MdVerified/>Quality Assured</>,<><MdSpeed/>Fast Service</>].map((t,i)=>(
                  <span key={i} className="sd-trust-pill">{t}</span>
                ))}
              </div>
            </div>
            <div className="sd-feats-box reveal-r">
              <h3>Key Features</h3>
              <ul className="sd-feats-list">
                {svc.features.map(f=>(
                  <li key={f}><MdCheckCircle/>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section sd-how-sec">
        <div className="container">
          <span className="eyebrow reveal">Process</span>
          <h2 className="sec-title reveal">How It <span>Works</span></h2>
          <p className="sec-sub reveal">Simple, transparent process from first contact to completion</p>
          <div className="sd-steps">
            {svc.howItWorks.map(({step,t,d},i)=>(
              <div key={step} className="sd-step reveal" data-delay={i*80}>
                <div className="sd-step-num">{step}</div>
                <div className="sd-step-ico"><MdArrowForward/></div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="section sd-types-sec">
        <div className="container">
          <span className="eyebrow reveal">Variants</span>
          <h2 className="sec-title reveal">Types <span>Available</span></h2>
          <div className="sd-types-grid">
            {svc.types.map(({t,d},i)=>(
              <div key={t} className="sd-type-card reveal" data-delay={i*70}>
                <div className="sd-type-num">0{i+1}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section sd-faq-sec">
        <div className="container sd-faq-inner">
          <span className="eyebrow reveal">FAQ</span>
          <h2 className="sec-title reveal">Common <span>Questions</span></h2>
          <div className="sd-faqs">
            {svc.faqs.map(({q,a},i)=>(
              <div key={i} className="sd-faq reveal" data-delay={i*60}>
                <h4><span>Q</span>{q}</h4>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section sd-why-sec">
        <div className="container">
          <h2 className="sec-title reveal">Why Choose <span>NetKing?</span></h2>
          <div className="sd-why-grid">
            {[
              {ico:<MdVerified/>,t:'Certified Technicians',d:'Professionally trained team with years of field experience.'},
              {ico:<MdSpeed/>,t:'Same-Day Service',d:'Fast response and installation across all of Hyderabad.'},
              {ico:<IoShieldCheckmark/>,t:'1 Year Warranty',d:'All installations fully covered for peace of mind.'},
              {ico:<MdSupportAgent/>,t:'24/7 Support',d:'Round-the-clock emergency support and assistance.'},
            ].map(({ico,t,d})=>(
              <div key={t} className="sd-why-card reveal">
                <div className="sd-why-ico">{ico}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sd-cta">
        <div className="sd-cta-orb"/>
        <div className="container sd-cta-inner reveal">
          <FaShieldAlt className="sd-cta-ico"/>
          <h2>Ready to Get Started?</h2>
          <p>Contact us for a free consultation and site survey — no obligation.</p>
          <div className="sd-cta-btns">
            <a href="tel:9248353592" className="btn-red"><MdPhone/>Call: 9248353592</a>
            <a href="https://wa.me/919248353592" className="btn-wa" target="_blank" rel="noreferrer"><FaWhatsapp/>WhatsApp Us</a>
            <Link to="/enquiry" className="btn-outline">Send Enquiry<MdArrowForward/></Link>
          </div>
        </div>
      </section>

    </main>
  );
}
