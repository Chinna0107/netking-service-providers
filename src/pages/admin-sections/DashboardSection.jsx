import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MdArrowForward,
  MdCheckCircle,
  MdInventory,
  MdPayment,
  MdPersonAdd,
  MdWarning,
} from 'react-icons/md';
import { FaVideo, FaWifi } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` };
}

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

function CountUp({ target, formatter = (value) => value.toLocaleString('en-IN') }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();

        let current = 0;
        const step = Math.max(1, Math.ceil(target / 45));
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          setCount(current);

          if (current >= target) {
            clearInterval(timer);
          }
        }, 20);
      },
      { threshold: 0.35 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{formatter(count)}</span>;
}

export default function DashboardSection({ onNavigate }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [dashRes, customersRes] = await Promise.all([
        fetch(`${API}/api/admin/dashboard`, { headers: authHeaders() }),
        fetch(`${API}/api/admin/customers`, { headers: authHeaders() })
      ]);
      const dashData = await dashRes.json();
      const customersData = await customersRes.json();
      
      setDashboardData(dashData);
      setCustomers(customersData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setLoading(false);
    }
  };

  const cctvCustomers = customers.filter((c) => c.service_type === 'CC Camera' || c.service_type === 'Both');
  const broadbandCustomers = customers.filter((c) => c.service_type === 'Broadband' || c.service_type === 'Both');
  const totalReceived = Number(dashboardData?.totalPayments || 0);
  const totalAssigned = Number(dashboardData?.totalAssigned || 0);
  const totalBalance = totalAssigned - totalReceived;
  const dueAccounts = dashboardData?.balances?.filter((b) => Number(b.remaining_balance) > 0).length || 0;
  const collectionRate = totalAssigned > 0 ? Math.round((totalReceived / totalAssigned) * 100) : 0;

  const attentionCustomers = useMemo(
    () =>
      (dashboardData?.balances || [])
        .filter((b) => Number(b.remaining_balance) > 0)
        .sort((a, b) => Number(b.remaining_balance) - Number(a.remaining_balance))
        .slice(0, 6),
    [dashboardData]
  );

  const recentCustomers = useMemo(
    () =>
      [...customers]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5),
    [customers]
  );

  if (loading) {
    return <div style={{ padding: 40 }}>Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div style={{ padding: 40, color: 'red' }}>Failed to load dashboard data</div>;
  }

  const workflowCards = [
    {
      id: 'addcustomer',
      icon: <MdPersonAdd />,
      title: 'Add Customer',
      description: 'Create new CCTV or broadband customers and capture their opening billing.',
      statLabel: 'Profiles created',
      statValue: customers.length,
      tone: 'blue',
    },
    {
      id: 'products',
      icon: <MdInventory />,
      title: 'Add Products To Customers',
      description: 'Assign installed devices, plans, and accessories to the correct customer.',
      statLabel: 'Total assigned',
      statValue: formatCurrency(totalAssigned),
      tone: 'green',
    },
    {
      id: 'payments',
      icon: <MdPayment />,
      title: 'Payments & Balances',
      description: 'Track total received amounts and follow up on remaining balances quickly.',
      statLabel: 'Outstanding',
      statValue: formatCurrency(totalBalance),
      tone: 'amber',
    },
  ];

  const kpiCards = [
    {
      icon: <MdPersonAdd />,
      label: 'Total Customers',
      value: customers.length,
      formatter: (value) => value.toLocaleString('en-IN'),
      tone: 'blue',
    },
    {
      icon: <MdInventory />,
      label: 'Total Assigned',
      value: totalAssigned,
      formatter: (value) => formatCurrency(value),
      tone: 'green',
    },
    {
      icon: <MdCheckCircle />,
      label: 'Total Received',
      value: totalReceived,
      formatter: (value) => formatCurrency(value),
      tone: 'green',
    },
    {
      icon: <MdWarning />,
      label: 'Remaining Balance',
      value: totalBalance,
      formatter: (value) => formatCurrency(value),
      tone: 'amber',
    },
  ];

  return (
    <div className="dash-root">
      <div className="dashboard-spotlight">
        <div className="dashboard-spotlight-copy">
          <span className="section-eyebrow">Admin Workflow</span>
          <h2>Run the customer, product, and payment workflow from one dashboard.</h2>
          <p>
            This panel is now centered around onboarding customers, mapping products to each
            account, and tracking how much has been collected versus what is still due.
          </p>

          <div className="dashboard-spotlight-chips">
            <span>
              <FaVideo /> {cctvCustomers.length} CCTV
            </span>
            <span>
              <FaWifi /> {broadbandCustomers.length} Broadband
            </span>
            <span>
              <MdPayment /> {dueAccounts} due accounts
            </span>
          </div>
        </div>

        <div className="dashboard-spotlight-card">
          <span>Collection Rate</span>
          <strong>{collectionRate}%</strong>
          <p>{formatCurrency(totalReceived)} received out of {formatCurrency(totalAssigned)}</p>
          <div className="spotlight-progress">
            <div className="spotlight-progress-track">
              <div className="spotlight-progress-fill" style={{ width: `${collectionRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="workflow-card-grid">
        {workflowCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`workflow-card tone-${card.tone}`}
            onClick={() => onNavigate && onNavigate(card.id)}
          >
            <div className="workflow-card-icon">{card.icon}</div>
            <div className="workflow-card-body">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
            <div className="workflow-card-footer">
              <div>
                <span>{card.statLabel}</span>
                <strong>{card.statValue}</strong>
              </div>
              <MdArrowForward />
            </div>
          </button>
        ))}
      </div>

      <div className="dashboard-kpi-grid">
        {kpiCards.map((card) => (
          <div key={card.label} className={`dashboard-kpi-card tone-${card.tone}`}>
            <div className="dashboard-kpi-icon">{card.icon}</div>
            <div>
              <span>{card.label}</span>
              <strong>
                <CountUp target={card.value} formatter={card.formatter} />
              </strong>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-insights-grid">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <h3>Service Mix</h3>
            <span>{customers.length} customers</span>
          </div>

          <div className="mix-list">
            <div className="mix-row">
              <div className="mix-label">
                <FaVideo />
                <span>CCTV / NKSS</span>
              </div>
              <strong>{cctvCustomers.length}</strong>
            </div>
            <div className="mix-row">
              <div className="mix-label">
                <FaWifi />
                <span>Broadband / NKBB</span>
              </div>
              <strong>{broadbandCustomers.length}</strong>
            </div>
            <div className="mix-row">
              <div className="mix-label">
                <MdInventory />
                <span>Accounts with balance</span>
              </div>
              <strong>{dueAccounts}</strong>
            </div>
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h3>Collection Snapshot</h3>
            <span>Live totals</span>
          </div>

          <div className="payment-overview">
            <div className="po-row">
              <span>Total Billing</span>
              <strong>{formatCurrency(totalAssigned)}</strong>
            </div>
            <div className="po-row">
              <span>Received</span>
              <strong className="paid">{formatCurrency(totalReceived)}</strong>
            </div>
            <div className="po-row">
              <span>Balance</span>
              <strong className="balance">{formatCurrency(totalBalance)}</strong>
            </div>
          </div>
        </div>

        <div className="dash-panel dash-panel-tall">
          <div className="dash-panel-head">
            <h3>Needs Attention</h3>
            <span>Balance or missing products</span>
          </div>

          {attentionCustomers.length === 0 ? (
            <div className="dash-empty">
              No active follow-ups right now. Use the Add Customer page to start building the list.
            </div>
          ) : (
            <div className="attention-list">
              {attentionCustomers.map((balance) => (
                <div key={balance.customer_id} className="attention-item">
                  <div>
                    <strong>{balance.name}</strong>
                    <span>{balance.email}</span>
                  </div>
                  <div className="attention-tags">
                    <span className="attention-tag due">{formatCurrency(balance.remaining_balance)} due</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-panel dash-panel-wide">
          <div className="dash-panel-head">
            <h3>Recent Customers</h3>
            <button type="button" className="inline-link-btn" onClick={() => onNavigate?.('addcustomer')}>
              Add another customer
            </button>
          </div>

          {recentCustomers.length === 0 ? (
            <div className="dash-empty">
              No customers added yet. Start with <button onClick={() => onNavigate?.('addcustomer')}>Add Customer</button>.
            </div>
          ) : (
            <div className="recent-customers-list">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="rc-item">
                  <div className="rc-avatar">{customer.name?.charAt(0) || 'C'}</div>
                  <div className="rc-info">
                    <strong>{customer.name}</strong>
                    <span>
                      {customer.phone} • {customer.city}
                    </span>
                  </div>
                  <div className="rc-right">
                    <span className={`rc-service ${customer.service_type === 'CC Camera' ? 'cctv' : 'broadband'}`}>
                      {customer.service_type === 'CC Camera' ? 'NKSS' : 'NKBB'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
