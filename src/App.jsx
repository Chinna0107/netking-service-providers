import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Enquiry from './pages/Enquiry';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import CustomerPanel from './pages/CustomerPanel';
import './App.css';

const tickerItems = [
  '🔐 Professional CCTV Installation','📷 HD & 4K Camera Systems',
  '🛡️ 24/7 Security Monitoring','⚡ Same Day Service Available',
  '✅ Certified Technicians','📞 Call: 9248353592',
  '🏆 500+ Happy Clients','🔧 Annual Maintenance Contracts',
  '📲 Mobile App Integration','🔒 Access Control Systems',
];

function Ticker() {
  const double = [...tickerItems, ...tickerItems];
  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {double.map((item, i) => (
          <span key={i} className="ticker-item">{item}<span className="ticker-sep">◆</span></span>
        ))}
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isDashboard = ['/admin-panel', '/customer-panel'].includes(location.pathname);
  return (
    <>
      <ScrollToTop />
      <Ticker />
      {!isLogin && !isDashboard && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:slug" element={<ServiceDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/customer-panel" element={<CustomerPanel />} />
      </Routes>
      {!isLogin && !isDashboard && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
