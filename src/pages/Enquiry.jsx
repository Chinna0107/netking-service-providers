import { useEffect, useState } from 'react';
import { MdPhone, MdCheckCircle, MdArrowForward } from 'react-icons/md';
import { FaWhatsapp, FaShieldAlt } from 'react-icons/fa';
import { IoShieldCheckmark } from 'react-icons/io5';
import './Enquiry.css';

const services = [
  'CCTV Camera Installation',
  'Wireless / WiFi Camera',
  'Solar / 4G / 5G Camera',
  'Networking & Cabling',
  'Video Door Phone',
  'Smart Door Lock',
  'Biometric Attendance Device',
  'Smart Door Access Control',
  'Optical Fiber Laying & Splicing',
  'System Maintenance & AMC',
  'Other / General Enquiry',
];

export default function Enquiry() {
  const [form, setForm] = useState({ name:'', phone:'', service:'', message:'' });

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.06 }
    );
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const buildWAMsg = () => {
    const lines = [
      `*New Enquiry — NetKing Security Systems*`,
      ``,
      `👤 *Name:* ${form.name || 'Not provided'}`,
      `📞 *Phone:* ${form.phone || 'Not provided'}`,
      `🔧 *Service Required:* ${form.service || 'Not specified'}`,
      `💬 *Message:* ${form.message || 'No message'}`,
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  const handleWA = e => {
    e.preventDefault();
    window.open(`https://wa.me/919248353592?text=${buildWAMsg()}`, '_blank');
  };

  return (
    <main className="enq-page">

      {/* Hero */}
      <section className="enq-hero">
        <div className="enq-bg"><div className="enq-orb enq-o1"/><div className="enq-orb enq-o2"/><div className="enq-bg-grid"/></div>
        <div className="container enq-hero-inner">
          <span className="eyebrow reveal"><FaWhatsapp style={{verticalAlign:'middle',marginRight:6}}/>Get In Touch</span>
          <h1 className="sec-title reveal">Send Us an <span>Enquiry</span></h1>
          <p className="sec-sub reveal">Fill in your details and we'll connect with you instantly on WhatsApp. Free consultation, no obligation.</p>
        </div>
      </section>

      {/* Main */}
      <section className="section enq-main">
        <div className="container enq-grid">

          {/* Form */}
          <div className="enq-form-wrap reveal-l">
            <div className="enq-form-hdr">
              <FaShieldAlt className="enq-form-ico"/>
              <div>
                <h2>Service Enquiry</h2>
                <p>We'll respond within minutes on WhatsApp</p>
              </div>
            </div>

            <form className="enq-form" onSubmit={handleWA}>
              <div className="enq-field">
                <label>Your Name</label>
                <input
                  type="text" placeholder="Enter your full name"
                  value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                />
              </div>
              <div className="enq-field">
                <label>Phone Number</label>
                <input
                  type="tel" placeholder="Your WhatsApp number"
                  value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                />
              </div>
              <div className="enq-field">
                <label>Service Required</label>
                <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                  <option value="">— Select a service —</option>
                  {services.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="enq-field">
                <label>Message (Optional)</label>
                <textarea
                  rows={4} placeholder="Describe your requirement, location, or any questions..."
                  value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                />
              </div>
              <button type="submit" className="enq-wa-btn">
                <FaWhatsapp/>Send via WhatsApp
              </button>
              <p className="enq-note">
                Clicking the button will open WhatsApp with your details pre-filled.
              </p>
            </form>
          </div>

          {/* Info */}
          <div className="enq-info reveal-r">
            <div className="enq-contact-card">
              <h3>Contact Us Directly</h3>
              <a href="tel:9248353592" className="enq-contact-row">
                <span className="enq-cico"><MdPhone/></span>
                <div><span>Call Us</span><strong>9248353592</strong></div>
              </a>
              <a href="https://wa.me/919248353592" className="enq-contact-row" target="_blank" rel="noreferrer">
                <span className="enq-cico enq-cico-wa"><FaWhatsapp/></span>
                <div><span>WhatsApp</span><strong>9248353592</strong></div>
              </a>
            </div>

            <div className="enq-services-card">
              <h3>Our Services</h3>
              <ul>
                {services.slice(0,-1).map(s=>(
                  <li key={s}><MdCheckCircle/>{s}</li>
                ))}
              </ul>
            </div>

            <div className="enq-trust-card">
              <h3>Why Choose NetKing?</h3>
              {[
                [<IoShieldCheckmark/>,'Certified & Experienced Team'],
                [<MdCheckCircle/>,'Free Site Survey'],
                [<MdCheckCircle/>,'1 Year Warranty'],
                [<MdCheckCircle/>,'24/7 Support'],
                [<MdCheckCircle/>,'Serving All of Telangana'],
              ].map(([ico,t])=>(
                <div key={t} className="enq-trust-row"><span>{ico}</span>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>



    </main>
  );
}
