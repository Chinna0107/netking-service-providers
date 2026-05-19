import { useState, useEffect } from 'react';
import { MdPhone, MdEmail, MdLocationOn, MdAccessTime, MdSend, MdCheckCircle, MdPerson, MdBuild } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import './Contact.css';

const cards = [
  { ico: <MdPhone size={22} />, t: 'Phone', v: '9248353592', s: 'Mon–Sat, 9AM–7PM', href: 'tel:9248353592', cls: 'cc-red' },
  { ico: <FaWhatsapp size={22} />, t: 'WhatsApp', v: 'Chat with us', s: 'Quick response', href: 'https://wa.me/919248353592', cls: 'cc-green', ext: true },
  { ico: <MdEmail size={22} />, t: 'Email', v: 'support.netkingservice@gmail.com', s: 'Reply within 2hrs', href: 'mailto:support.netkingservice@gmail.com', cls: 'cc-red' },
  { ico: <MdLocationOn size={22} />, t: 'Location', v: 'Hyderabad', s: 'Telangana, India', href: 'https://www.google.com/maps/dir/?api=1&destination=Netking%20Security%20Systems%2C%20Hyderabad%2C%20Telangana', ext: true, cls: 'cc-orange' },
];
const hours = [
  ['Monday – Friday', '9:00 AM – 7:00 PM', true],
  ['Saturday', '9:00 AM – 5:00 PM', true],
  ['Sunday', 'Emergency Only', false],
  ['Emergency Support', '24/7 Available', true],
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); const d = e.target.dataset.delay; if (d) e.target.style.transitionDelay = d + 'ms'; } }), { threshold: 0.08 });
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const buildWAMsg = () => {
    const lines = [
      `*New Contact — NetKing Security Systems*`,
      ``,
      `👤 *Name:* ${form.name || 'Not provided'}`,
      `📞 *Phone:* ${form.phone || 'Not provided'}`,
      `✉️ *Email:* ${form.email || 'Not provided'}`,
      `🔧 *Service Required:* ${form.service || 'Not specified'}`,
      `💬 *Message:* ${form.message || 'No message'}`,
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  const handleGetDirections = () => {
  const fallbackUrl = 'https://maps.app.goo.gl/9T6JvayWwSUZhpnc9';
  const destination = '17.4172464795,78.3183561634';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}`;
        window.open(url, '_blank');
      },
      () => {
        window.open(fallbackUrl, '_blank');
      }
    );
  } else {
    window.open(fallbackUrl, '_blank');
  }
};

    const submit = e => {
  e.preventDefault();
  window.open(`https://wa.me/919248353592?text=${buildWAMsg()}`, '_blank');
};

  return (
    <main className="contact-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow reveal">Get In Touch</span>
          <h1 className="sec-title reveal">Contact <span>Us</span></h1>
          <p className="sec-sub reveal">Ready to secure your property? Our certified technicians are just a call away.</p>
        </div>
        <div className="contact-hero-img reveal">
          <img src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1400&q=85" alt="CCTV Security Installation" loading="lazy" />
          <div className="chi-overlay" />
          <div className="chi-badges">
            <span className="chi-badge"><MdPhone />Call: 9248353592</span>
            <span className="chi-badge"><MdLocationOn />Hyderabad, Telangana</span>
            <span className="chi-badge"><MdAccessTime />Mon–Sat 9AM–7PM</span>
          </div>
        </div>
        {/* Get Directions Button */}
        <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn-red get-dir-btn" onClick={handleGetDirections}>Get Directions</button>
        </div>
</section>
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121820.73024843958!2d78.3183561633535!3d17.417246479532824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91005b6fa145%3A0xe5a30bf9bc2cde71!2sNetking%20Security%20Systems!5e0!3m2!1sen!2sin!4v1716091395914!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: '24px', boxShadow: '0 8px 32px rgba(224, 16, 32, 0.08)' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="NetKing Security Systems Location"
          ></iframe>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="contact-cards">
            {cards.map(({ ico, t, v, s, href, cls, ext }, i) => (
              <a key={t} href={href} className={`cc-card ${cls} reveal`} data-delay={i * 80}
                target={ext ? '_blank' : undefined} rel="noreferrer">
                <div className="cc-ico">{ico}</div>
                <div className="cc-info">
                  <span className="cc-lbl">{t}</span>
                  <span className="cc-val">{v}</span>
                  <span className="cc-sub">{s}</span>
                </div>
                <span className="cc-arr">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container contact-main">
          <div className="form-card reveal-l">
            <div className="form-card-hdr">
              <MdSend size={26} />
              <div><h2>Send Us a Message</h2><p>We'll get back to you within 2 hours</p></div>
            </div>
            {sent && <div className="success-msg"><MdCheckCircle size={20} />Message sent! We'll contact you shortly.</div>}
            <form onSubmit={submit} className="contact-form">
              <div className="form-row">
                <div className="form-grp">
                  <label><MdPerson />Full Name *</label>
                  <input type="text" placeholder="Your full name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-grp">
                  <label><MdPhone />Phone Number *</label>
                  <input type="tel" placeholder="Your phone number" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-grp">
                <label><MdEmail />Email Address</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-grp">
                <label><MdBuild />Service Required</label>
                <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                  <option value="">Select a service...</option>
                  <option>CCTV Camera Installation</option>
                  <option>System Maintenance & Repair</option>
                  <option>Remote Monitoring Setup</option>
                  <option>Mobile App Integration</option>
                  <option>Access Control & Alarm Systems</option>
                  <option>Commercial Surveillance</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-grp">
                <label>Message</label>
                <textarea rows={5} placeholder="Describe your security requirements..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className={`btn-red submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? <span className="spin-ico" /> : <><MdSend />Send Message</>}
              </button>
            </form>
          </div>

          <div className="contact-side">
            <div className="side-card reveal-r">
              <div className="side-card-hdr"><MdAccessTime /><h3>Working Hours</h3></div>
              {hours.map(([day, time, on]) => (
                <div key={day} className="hours-row">
                  <span className="hours-day">{day}</span>
                  <span className={on ? 'hours-t-on' : 'hours-t-off'}>{time}</span>
                </div>
              ))}
            </div>
            <div className="side-card reveal-r" data-delay="100">
              <p className="qc-title">Quick Contact</p>
              <div className="qc-btns">
                <a href="tel:9248353592" className="btn-red qc-btn"><MdPhone />Call: 9248353592</a>
                <a href="https://wa.me/919248353592" className="qc-wa" target="_blank" rel="noreferrer"><FaWhatsapp />WhatsApp Us</a>
              </div>
              <p className="qc-note">Available Mon–Sat 9AM–7PM. Emergency support 24/7.</p>
            </div>
            <div className="side-card reveal-r" data-delay="200">
              <div className="side-card-hdr"><MdEmail /><h3>Email Us</h3></div>
              <a href="mailto:support.netkingservice@gmail.com" className="email-a">support.netkingservice@gmail.com</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
