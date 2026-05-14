import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MdDashboard, MdAssignment, MdAccountBalance,
  MdDescription, MdReceiptLong, MdAccessTime, MdLogout, MdMenu, MdClose,
  MdPersonAdd, MdInventory, MdAccountBalanceWallet, MdPeople
} from 'react-icons/md';
import { FaVideo, FaWifi, FaShieldAlt } from 'react-icons/fa';
import './AdminPanel.css';

import DashboardSection    from './admin-sections/DashboardSection';
import CustomersSection    from './admin-sections/CustomersSection';
import AddCustomerSection  from './admin-sections/AddCustomerSection';
import AllCustomersSection from './admin-sections/AllCustomersSection';
import ProductsSection     from './admin-sections/ProductsSection';
import PaymentsSummary     from './admin-sections/PaymentsSummary';
import AMCSection          from './admin-sections/AMCSection';
import TicketsSection      from './admin-sections/TicketsSection';
import AccountsSection     from './admin-sections/AccountsSection';
import QuotationsSection   from './admin-sections/QuotationsSection';
import BillBookSection     from './admin-sections/BillBookSection';
import AttendanceSection   from './admin-sections/AttendanceSection';
import SubscriptionsSection from './admin-sections/SubscriptionsSection';

const MENU = [
  { id: 'dashboard',      label: 'Dashboard Home',         icon: <MdDashboard/>,            group: 'main' },
  { id: 'addcustomer',    label: 'Add Customer',           icon: <MdPersonAdd/>,            group: 'customers' },
  { id: 'customers',      label: 'All Customers',          icon: <MdPeople/>,               group: 'customers' },
  { id: 'cctv',           label: 'CCTV Clients [NKSS]',   icon: <FaVideo/>,                group: 'customers' },
  { id: 'broadband',      label: 'Broadband Users [NKBB]', icon: <FaWifi/>,                 group: 'customers' },
  { id: 'products',       label: 'Add Products To Customers', icon: <MdInventory/>,         group: 'customers' },
  { id: 'subscriptions',  label: 'Subscription Plans',     icon: <MdAccessTime/>,           group: 'customers' },
  { id: 'payments',       label: 'Payments & Balances',    icon: <MdAccountBalanceWallet/>, group: 'finance' },
  { id: 'accounts',       label: 'Accounts',               icon: <MdAccountBalance/>,       group: 'finance' },
  { id: 'quotations',     label: 'Quotations',             icon: <MdDescription/>,          group: 'finance' },
  // { id: 'billbook',       label: 'Bill Book',              icon: <MdReceiptLong/>,          group: 'finance' },
  // { id: 'amc',            label: 'AMC Contracts',          icon: <FaShieldAlt/>,            group: 'services' },
  { id: 'tickets',        label: 'Service Tickets',        icon: <MdAssignment/>,           group: 'services' },
  // { id: 'attendance',     label: 'Staff Attendance',       icon: <MdAccessTime/>,           group: 'hr' },
];

const GROUPS = {
  main:      'Overview',
  customers: 'Core Workflow',
  finance:   'Collections',
  services:  'Service Ops',
  hr:        'HR',
};

const SECTION_META = {
  dashboard: {
    title: 'Admin Dashboard',
    subtitle: 'Focus the team on onboarding customers, mapping products, and tracking collections.',
  },
  addcustomer: {
    title: 'Add Customer',
    subtitle: 'Create a new customer profile and capture opening billing details.',
  },
  customers: {
    title: 'All Customers',
    subtitle: 'View, edit, and manage all customer accounts in one place.',
  },
  cctv: {
    title: 'CCTV Clients',
    subtitle: 'Browse CCTV customer records, billing, and installed equipment.',
  },
  broadband: {
    title: 'Broadband Users',
    subtitle: 'Manage broadband customers and connection-related customer details.',
  },
  products: {
    title: 'Add Products To Customers',
    subtitle: 'Assign installed items and service assets to the right customer account.',
  },
  subscriptions: {
    title: 'Subscription Plans',
    subtitle: 'Create and manage subscription plans, assign them to customers.',
  },
  payments: {
    title: 'Payments & Balances',
    subtitle: 'Monitor received amounts, pending balances, and payment updates in one place.',
  },
  accounts: {
    title: 'Accounts',
    subtitle: 'Review higher-level income and expense movements.',
  },
  quotations: {
    title: 'Quotations',
    subtitle: 'Track quotes, approvals, and follow-up activity.',
  },
  billbook: {
    title: 'Bill Book',
    subtitle: 'Create and monitor billing records for your customers.',
  },
  amc: {
    title: 'AMC Contracts',
    subtitle: 'Keep service maintenance contracts visible and up to date.',
  },
  tickets: {
    title: 'Service Tickets',
    subtitle: 'Watch open service tickets and resolution progress.',
  },
  attendance: {
    title: 'Staff Attendance',
    subtitle: 'Track team attendance and daily operations.',
  },
};

export default function AdminPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState(() => {
    // First check URL params, then localStorage, then default to dashboard
    return searchParams.get('section') || localStorage.getItem('adminActiveSection') || 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userRole') !== 'admin') nav('/login');
  }, [nav]);

  // Set initial URL param if not present
  useEffect(() => {
    if (!searchParams.get('section')) {
      const savedSection = localStorage.getItem('adminActiveSection') || 'dashboard';
      setSearchParams({ section: savedSection }, { replace: true });
    }
  }, []);

  // Sync URL params with active section
  useEffect(() => {
    const urlSection = searchParams.get('section');
    if (urlSection && urlSection !== active) {
      setActive(urlSection);
    }
  }, [searchParams]);

  // Update URL and localStorage when active section changes
  const handleSetActive = (section) => {
    setActive(section);
    setSearchParams({ section });
    localStorage.setItem('adminActiveSection', section);
  };

  const logout = () => {
    ['userRole','userEmail','token','adminActiveSection'].forEach(k => localStorage.removeItem(k));
    nav('/');
  };

  const renderSection = () => {
    switch (active) {
      case 'dashboard':     return <DashboardSection   onNavigate={handleSetActive} />;
      case 'addcustomer':   return <AddCustomerSection />;
      case 'customers':     return <AllCustomersSection />;
      case 'cctv':          return <CustomersSection   serviceFilter="cctv" />;
      case 'broadband':     return <CustomersSection   serviceFilter="broadband" />;
      case 'products':      return <ProductsSection />;
      case 'subscriptions': return <SubscriptionsSection />;
      case 'payments':      return <PaymentsSummary />;
      case 'accounts':      return <AccountsSection />;
      case 'quotations':    return <QuotationsSection />;
      // case 'billbook':      return <BillBookSection />;
      // case 'amc':           return <AMCSection />;
      case 'tickets':       return <TicketsSection />;
      // case 'attendance':    return <AttendanceSection />;
      default:              return <DashboardSection   onNavigate={handleSetActive} />;
    }
  };

  const currentMeta = SECTION_META[active] || SECTION_META.dashboard;
  const primaryActions = MENU.filter((item) => ['addcustomer', 'products', 'payments'].includes(item.id));

  const grouped = Object.entries(GROUPS).map(([key, label]) => ({
    key, label, items: MENU.filter(m => m.group === key)
  }));

  return (
    <div className="crm-root">
      {/* ── Sidebar ── */}
      <aside className={`crm-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sb-logo">
          <div className="sb-logo-icon"><FaVideo /></div>
          <div>
            <div className="sb-logo-name">NetKing</div>
            <div className="sb-logo-sub">CRM Dashboard</div>
          </div>
          <button className="sb-close-btn" onClick={() => setSidebarOpen(false)}><MdClose /></button>
        </div>

        <nav className="sb-nav">
          {grouped.map(group => (
            <div key={group.key} className="sb-group">
              <div className="sb-group-label">{group.label}</div>
              {group.items.map(item => (
                <button
                  key={item.id}
                  className={`sb-item ${active === item.id ? 'active' : ''}`}
                  onClick={() => { handleSetActive(item.id); setSidebarOpen(false); }}
                >
                  <span className="sb-item-icon">{item.icon}</span>
                  <span className="sb-item-label">{item.label}</span>
                  {active === item.id && <span className="sb-active-dot" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <button className="sb-logout" onClick={logout}>
          <MdLogout /> Logout
        </button>
      </aside>

      {sidebarOpen && <div className="crm-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <div className="crm-main">
        <header className="crm-topbar">
          <button className="crm-menu-btn" onClick={() => setSidebarOpen(true)}><MdMenu /></button>
          <div className="crm-topbar-title">
            <span className="crm-page-eyebrow">NetKing Admin Workspace</span>
            <span className="crm-page-label">{currentMeta.title}</span>
            <span className="crm-page-subtitle">{currentMeta.subtitle}</span>
          </div>
          <div className="crm-topbar-right">
            <div className="crm-primary-nav">
              {primaryActions.map((item) => (
                <button
                  key={item.id}
                  className={`crm-mini-tab ${active === item.id ? 'active' : ''}`}
                  onClick={() => handleSetActive(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="crm-admin-badge">
              <div className="crm-admin-avatar">A</div>
              <span>Admin</span>
            </div>
          </div>
        </header>

        <div className="crm-body">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
