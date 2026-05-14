import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdArrowForward } from 'react-icons/md';
import { FaShieldAlt } from 'react-icons/fa';
import { IoShieldCheckmark } from 'react-icons/io5';
import logo from '../assets/logo.jpeg';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rem, setRem] = useState(false);
  const [userType, setUserType] = useState('customer');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userEmail', data.email);
      if (data.role === 'admin') {
        // Redirect to admin panel with section parameter
        const savedSection = localStorage.getItem('adminActiveSection') || 'dashboard';
        nav(`/admin-panel?section=${savedSection}`);
      } else {
        // Redirect to customer panel with tab parameter
        const savedTab = localStorage.getItem('customerActiveTab') || 'dashboard';
        nav(`/customer-panel?tab=${savedTab}`);
      }
    } catch {
      setError('Server unreachable. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-bg">
        <div className="login-grid"/>
        <div className="login-orb login-orb-1"/>
        <div className="login-orb login-orb-2"/>
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-img">
            <img src={logo} alt="NetKing"/>
            <div className="login-logo-ring"/>
          </div>
          <div>
            <span className="login-brand">NetKing</span>
            <span className="login-brand-sub">Security Systems</span>
          </div>
        </div>

        <div className="login-hdr">
          <h1>Welcome Back</h1>
          <p>Sign in to your security dashboard</p>
          <div className="login-type-toggle">
            <button className={`ltt-btn ${userType === 'customer' ? 'active' : ''}`} onClick={() => setUserType('customer')}>Customer</button>
            <button className={`ltt-btn ${userType === 'admin' ? 'active' : ''}`} onClick={() => setUserType('admin')}>Admin</button>
          </div>
        </div>

        <div className="login-badges">
          <span className="login-badge"><IoShieldCheckmark/>Secure Login</span>
          <span className="login-badge"><FaShieldAlt/>Encrypted</span>
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="lf-grp">
            <label><MdEmail/>{userType === 'customer' ? 'User ID or Email' : 'Email Address'}</label>
            <div className="lf-wrap">
              <MdEmail className="lf-ico"/>
              <input 
                type="text" 
                placeholder={userType === 'customer' ? 'User ID or Email' : 'your@email.com'} 
                required 
                value={form.email} 
                onChange={e=>setForm({...form,email:e.target.value})}
              />
            </div>
          </div>
          <div className="lf-grp">
            <label><MdLock/>Password</label>
            <div className="lf-wrap">
              <MdLock className="lf-ico"/>
              <input type={showPass?'text':'password'} placeholder="Enter your password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
              <button type="button" className="lf-eye" onClick={()=>setShowPass(!showPass)}>
                {showPass ? <MdVisibilityOff/> : <MdVisibility/>}
              </button>
            </div>
          </div>
          <div className="lf-opts">
            <label className="lf-rem" onClick={()=>setRem(!rem)}>
              <span className={`lf-chk ${rem?'on':''}`}>{rem&&'✓'}</span>Remember me
            </label>
            <a href="#" className="lf-forgot">Forgot password?</a>
          </div>
          {error && <p style={{color:'#ff4d4d',fontSize:'0.85rem',margin:'-4px 0 4px',textAlign:'center'}}>{error}</p>}
          <button type="submit" className={`btn-red lf-submit ${loading?'loading':''}`} disabled={loading}>
            {loading ? <span className="lf-spin"/> : <><FaShieldAlt/>Sign In<MdArrowForward/></>}
          </button>
        </form>

        <div className="lf-div"><span>or</span></div>
        <a href="tel:9248353592" className="lf-support">Need help? Call Support: 9248353592</a>
        <p className="lf-foot">Don't have access? <Link to="/contact">Contact us</Link> to get your credentials.</p>
      </div>
    </main>
  );
}
