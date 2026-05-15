import { useEffect, useState } from 'react';
import { MdClose, MdArrowBack, MdArrowForward, MdCameraAlt } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import './Gallery.css';

const cats = ['All', 'CCTV Install', 'Networking', 'Access Control', 'Commercial', 'Residential'];

const items = [
  {
    id:1,
    // cat:'CCTV Install',
    // title:'4K Dome Camera Setup',
    // sub:'Corporate Office, Hyderabad',
    color:'#e01020',
    image:'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860537/WhatsApp_Image_2026-05-12_at_12.30.50_2_ggs8sc.jpg',
  },
  {
    id:2,
    // cat:'Networking',
    // title:'Structured Cabling Project',
    // sub:'IT Park, Madhapur',
    color:'#0078ff',
    image:'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860538/WhatsApp_Image_2026-05-12_at_12.30.51_1_c3mehj.jpg',
  },
  {
    id:3,
    // cat:'Access Control',
    // title:'Biometric Entry System',
    // sub:'Warehouse, Uppal',
    color:'#f59e0b',
    image:'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860537/WhatsApp_Image_2026-05-12_at_12.30.50_1_mewzt0.jpg',
  },
  {
    id:4,
    // cat:'Commercial',
    // title:'Retail Store Surveillance',
    // sub:'Mall, Kukatpally',
    color:'#10b981',
    image:'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860536/WhatsApp_Image_2026-05-10_at_13.55.45_iryqfc.jpg',
  },
  {
    id:5,
    // cat:'Residential',
    // title:'Home Security Package',
    // sub:'Villa, Jubilee Hills',
    color:'#8b5cf6',
    image:'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860536/WhatsApp_Image_2026-05-12_at_12.30.48_1_o7ny3v.jpg',
  },
  {
    id:6,
    cat:'CCTV Install',
    title:'PTZ Camera Installation',
    sub:'Factory, Patancheru',
    color:'#e01020',
    image:'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860535/WhatsApp_Image_2026-05-10_at_13.55.47_2_gfuutt.jpg',
  },
  {
    id:7,
    cat:'Networking',
    title:'Fiber Optic Splicing',
    sub:'Data Center, Gachibowli',
    color:'#0078ff',
    image:'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860535/WhatsApp_Image_2026-05-10_at_13.55.46_dgpxws.jpg',
  },
  {
    id:8,
    cat:'Commercial',
    title:'Bank Branch Security',
    sub:'SBI Branch, Secunderabad',
    color:'#10b981',
    image:'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860534/WhatsApp_Image_2026-05-10_at_13.55.46_1_kquony.jpg',
  },
  {
    id:9,
    cat:'Residential',
    title:'Apartment Complex CCTV',
    sub:'Kondapur Apartments',
    color:'#e01020',
    image:'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778860534/WhatsApp_Image_2026-05-10_at_13.55.46_2_il1fs4.jpg',
  },
];

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
              <button
                key={item.id}
                type="button"
                className="gal-card reveal"
                data-delay={i * 50}
                style={{'--gc':item.color}}
                onClick={() => setLight(item)}
                aria-label={`Open ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="gal-card-img"
                  loading="lazy"
                />
              </button>
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
          <div className="gal-lb-card" onClick={e=>e.stopPropagation()}>
            <button className="gal-lb-close" onClick={()=>setLight(null)}><MdClose/></button>
            <div className="gal-lb-img">
              <img
                src={light.image}
                alt={light.title}
                className="gal-lb-photo"
              />
            </div>
            <button className="gal-lb-nav gal-lb-prev" onClick={()=>nav(-1)}><MdArrowBack/></button>
            <button className="gal-lb-nav gal-lb-next" onClick={()=>nav(1)}><MdArrowForward/></button>
          </div>
        </div>
      )}
    </main>
  );
}
