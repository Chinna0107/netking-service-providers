import { Link } from 'react-router-dom';
import { MdPhone, MdEmail, MdLocationOn, MdArrowForward } from 'react-icons/md';
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaShieldAlt } from 'react-icons/fa';
import logo from '../assets/logo.jpeg';
import './Footer.css';

const socials = [
  { ico:<FaFacebook/>, href:'#', label:'Facebook' },
  { ico:<FaInstagram/>, href:'#', label:'Instagram' },
  { ico:<FaWhatsapp/>, href:'https://wa.me/919248353592', label:'WhatsApp' },
  { ico:<FaYoutube/>, href:'#', label:'YouTube' },
];

const quickLinks = [
  { to:'/', l:'Home' }, { to:'/services', l:'Services' },
  { to:'/about', l:'About Us' }, { to:'/contact', l:'Contact' },
  { to:'/login', l:'Client Login' },
];

const serviceLinks = [
  'CCTV Installation','System Maintenance','Remote Monitoring',
  'Mobile App Integration','Access Control','Alarm Systems',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="NetKing"/>
              <div><span className="fl-name">NetKing</span><span className="fl-sub">Security Systems</span></div>
            </Link>
            <p>Your trusted partner in advanced surveillance and security solutions. Protecting homes and businesses across Hyderabad since 2019.</p>
            <div className="footer-socials">
              {socials.map(({ ico, href, label }) => (
                <a key={label} href={href} aria-label={label} className="soc-btn"
                  target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{ico}</a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            {quickLinks.map(({ to, l }) => (
              <Link key={to} to={to} className="footer-link"><MdArrowForward/>{l}</Link>
            ))}
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            {serviceLinks.map(s => (
              <Link key={s} to="/services" className="footer-link"><MdArrowForward/>{s}</Link>
            ))}
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <a href="tel:9248353592" className="footer-contact-row">
              <span className="fcr-ico"><MdPhone/></span>
              <div><span>Phone</span><strong>9248353592</strong></div>
            </a>
            <a href="mailto:support.netkingservice@gmail.com" className="footer-contact-row">
              <span className="fcr-ico"><MdEmail/></span>
              <div><span>Email</span><strong>support.netkingservice@gmail.com</strong></div>
            </a>
            <div className="footer-contact-row">
              <span className="fcr-ico"><MdLocationOn/></span>
              <div><span>Location</span><strong>Hyderabad, Telangana</strong></div>
            </div>
            <a href="https://wa.me/919248353592" className="footer-wa" target="_blank" rel="noreferrer">
              <FaWhatsapp/>WhatsApp Us
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="fb-l"><FaShieldAlt/><p>© {new Date().getFullYear()} NetKing Security Systems. All rights reserved.</p></div>
          <p className="fb-r">Designed for your security 🔐</p>
        </div>
      </div>
    </footer>
  );
}
