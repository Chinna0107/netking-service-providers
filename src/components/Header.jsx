import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdMenu, MdClose, MdPhone } from 'react-icons/md';
import { FaShieldAlt } from 'react-icons/fa';
import logo from '../assets/logo.jpeg';
import './Header.css';

const links = [
  { to:'/', label:'Home' },
  { to:'/services', label:'Services' },
  { to:'/about', label:'About Us' },
  { to:'/contact', label:'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [loc]);

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="logo">
            <div className="logo-img">
              <img src={logo} alt="NetKing"/>
              <div className="logo-ring"/>
            </div>
            <div className="logo-text">
              <span className="logo-name">NetKing</span>
              <span className="logo-sub">CCTV Service</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className={`nav ${open ? 'open' : ''}`}>
            <div className="nav-mob-hdr">
              <div className="logo-text">
                <span className="logo-name">NetKing</span>
                <span className="logo-sub" style={{display:'block'}}>CCTV Service</span>
              </div>
              <button className="nav-close" onClick={() => setOpen(false)}><MdClose size={22}/></button>
            </div>
            {links.map(({ to, label }) => (
              <Link key={to} to={to} className={`nav-link ${loc.pathname === to ? 'active' : ''}`}>{label}</Link>
            ))}
            {/* Mobile-only items inside nav */}
            <a href="tel:9248353592" className="nav-call"><MdPhone/>9248353592</a>
            <Link to="/login" className="nav-login-btn"><FaShieldAlt/>Login</Link>
          </nav>

          {/* Desktop right side */}
          <div className="hdr-right">
            <a href="tel:9248353592" className="hdr-phone"><MdPhone/><span>9248353592</span></a>
            <div className="hdr-divider"/>
            <Link to="/login" className="btn-red hdr-login"><FaShieldAlt/>Login</Link>
            <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <MdClose size={22}/> : <MdMenu size={22}/>}
            </button>
          </div>
        </div>
      </header>
      {open && <div className="nav-overlay" onClick={() => setOpen(false)}/>}
    </>
  );
}
