import { useEffect, useState } from 'react';
import { MdClose, MdArrowBack, MdArrowForward, MdPhoto, MdCameraAlt } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import './Gallery.css';

const cats = ['All', 'CCTV Install', 'Networking', 'Access Control', 'Commercial', 'Residential'];

const items = [
  { id:1, cat:'CCTV Install',   title:'4K Dome Camera Setup',        sub:'Corporate Office, Hyderabad',   color:'#e01020' },
  { id:2, cat:'Networking',     title:'Structured Cabling Project',  sub:'IT Park, Madhapur',             color:'#0078ff' },
  { id:3, cat:'Access Control', title:'Biometric Entry System',      sub:'Warehouse, Uppal',              color:'#f59e0b' },
  { id:4, cat:'Commercial',     title:'Retail Store Surveillance',   sub:'Mall, Kukatpally',              color:'#10b981' },
  { id:5, cat:'Residential',    title:'Home Security Package',       sub:'Villa, Jubilee Hills',          color:'#8b5cf6' },
  { id:6, cat:'CCTV Install',   title:'PTZ Camera Installation',     sub:'Factory, Patancheru',           color:'#e01020' },
  { id:7, cat:'Networking',     title:'Fiber Optic Splicing',        sub:'Data Center, Gachibowli',       color:'#0078ff' },
  { id:8, cat:'Commercial',     title:'Bank Branch Security',        sub:'SBI Branch, Secunderabad',      color:'#10b981' },
  { id:9, cat:'Residential',    title:'Apartment Complex CCTV',      sub:'Kondapur Apartments',           color:'#e01020' },
  { id:10, cat:'Access Control','title':'Smart Door Lock Setup',     sub:'Office, Banjara Hills',         color:'#f59e0b' },
  { id:11, cat:'CCTV Install',  title:'Solar Wireless Camera',       sub:'Farm, Medak',                   color:'#e01020' },
  { id:12, cat:'Commercial',    title:'Hospital Surveillance',       sub:'Clinic, LB Nagar',              color:'#10b981' },
];

const icons = ['📷','🔌','🔐','🏢','🏠','📡','🔧','🛡️','📹','🔑','☀️','🏥'];

export default function Gallery() {
  const [cat, setCat] = useState('All');
  const [light, setLight] = useState(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.06 }
    );
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [cat]);

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') setLight(null); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const filtered = cat === 'All' ? items : items.filter(i => i.cat === cat);

  const nav = dir => {
    const idx = filtered.findIndex(i => i.id === light.id);
    const next = filtered[(idx + dir + filtered.length) % filtered.length];
    setLight(next);
  };

  return (
    <main className="gallery-page">

      {/* Hero */}
      <section className="gallery-hero">
        <div className="gh-bg"><div className="gh-orb gh-o1"/><div className="gh-orb gh-o2"/><div className="gh-grid"/></div>
        <div className="container gh-inner">
          <span className="eyebrow reveal"><MdCameraAlt style={{verticalAlign:'middle',marginRight:6}}/>Our Work</span>
          <h1 className="sec-title reveal">Installation <span>Gallery</span></h1>
          <p className="sec-sub reveal">Real projects. Real results. Browse our recently completed security installations across Hyderabad and Telangana.</p>
          <div className="gh-stats reveal">
            {[['500+','Projects Done'],['50+','Cities Covered'],['5+','Years Experience'],['100%','Client Satisfaction']].map(([v,l])=>(
              <div key={l} className="gh-stat"><strong>{v}</strong><span>{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="gal-filter-bar">
        <div className="container gal-filter-inner">
          {cats.map(c => (
            <button key={c} className={`gal-filter-btn ${cat===c?'on':''}`} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="section gal-sec">
        <div className="container">
          <div className="gal-grid">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="gal-card reveal"
                data-delay={i * 50}
                style={{'--gc':item.color}}
                onClick={() => setLight(item)}
              >
                <div className="gal-card-img">
                  <div className="gal-placeholder" style={{background:`linear-gradient(135deg,${item.color}22,${item.color}08)`}}>
                    <span className="gal-emoji">{icons[item.id-1]}</span>
                    <div className="gal-scan-line"/>
                  </div>
                  <div className="gal-overlay">
                    <MdPhoto className="gal-zoom-ico"/>
                    <span>View Details</span>
                  </div>
                </div>
                <div className="gal-card-body">
                  <span className="gal-cat-tag">{item.cat}</span>
                  <h3>{item.title}</h3>
                  <p>{item.sub}</p>
                </div>
                <div className="gal-card-bar" style={{background:`linear-gradient(90deg,${item.color},transparent)`}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gal-cta">
        <div className="container gal-cta-inner reveal">
          <h2>Want a Similar Installation?</h2>
          <p>Get a free site survey and custom quote for your property.</p>
          <div className="gal-cta-btns">
            <a href="tel:9248353592" className="btn-red">📞 Call: 9248353592</a>
            <a href="https://wa.me/919248353592" className="btn-wa" target="_blank" rel="noreferrer"><FaWhatsapp/>WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {light && (
        <div className="gal-lightbox" onClick={()=>setLight(null)}>
          <div className="gal-lb-card" onClick={e=>e.stopPropagation()} style={{'--gc':light.color}}>
            <button className="gal-lb-close" onClick={()=>setLight(null)}><MdClose/></button>
            <div className="gal-lb-img" style={{background:`linear-gradient(135deg,${light.color}33,${light.color}11)`}}>
              <span style={{fontSize:80}}>{icons[light.id-1]}</span>
              <div className="gal-lb-scan"/>
            </div>
            <div className="gal-lb-info">
              <span className="gal-cat-tag">{light.cat}</span>
              <h2>{light.title}</h2>
              <p>{light.sub}</p>
              <div className="gal-lb-actions">
                <a href="tel:9248353592" className="btn-red">📞 Enquire Now</a>
                <a href="https://wa.me/919248353592" className="btn-wa" target="_blank" rel="noreferrer"><FaWhatsapp/>WhatsApp</a>
              </div>
            </div>
            <button className="gal-lb-nav gal-lb-prev" onClick={()=>nav(-1)}><MdArrowBack/></button>
            <button className="gal-lb-nav gal-lb-next" onClick={()=>nav(1)}><MdArrowForward/></button>
          </div>
        </div>
      )}
    </main>
  );
}
