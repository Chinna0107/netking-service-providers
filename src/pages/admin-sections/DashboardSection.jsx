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
import {
  countAssignedProducts,
  formatCurrency,
  getCollectionRate,
  getCustomers,
} from './adminData';

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
  const [customers] = useState(() => getCustomers());

  const cctvCustomers = customers.filter((customer) => customer.service === 'cctv');
  const broadbandCustomers = customers.filter((customer) => customer.service === 'broadband');
  const totalProducts = countAssignedProducts(customers);
  const totalReceived = customers.reduce((sum, customer) => sum + customer.paidAmount, 0);
  const totalBalance = customers.reduce((sum, customer) => sum + customer.balanceAmount, 0);
  const dueAccounts = customers.filter((customer) => customer.balanceAmount > 0).length;
  const collectionRate = getCollectionRate(customers);
  const customersWithoutProducts = customers.filter((customer) => customer.products.length === 0).length;

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
      statLabel: 'Products mapped',
      statValue: totalProducts,
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
      label: 'Assigned Products',
      value: totalProducts,
      formatter: (value) => value.toLocaleString('en-IN'),
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

  const attentionCustomers = useMemo(
    () =>
      [...customers]
        .sort((first, second) => {
          const firstScore = first.balanceAmount + (first.products.length === 0 ? 5000 : 0);
          const secondScore = second.balanceAmount + (second.products.length === 0 ? 5000 : 0);
          return secondScore - firstScore;
        })
        .slice(0, 6),
    [customers]
  );

  const recentCustomers = useMemo(
    () =>
      [...customers]
        .sort((first, second) => {
          const firstDate = new Date(first.createdAt || 0).getTime();
          const secondDate = new Date(second.createdAt || 0).getTime();
          return secondDate - firstDate;
        })
        .slice(0, 5),
    [customers]
  );

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
          <p>{formatCurrency(totalReceived)} received out of {formatCurrency(totalReceived + totalBalance)}</p>
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
                <span>Customers without products</span>
              </div>
              <strong>{customersWithoutProducts}</strong>
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
              <strong>{formatCurrency(totalReceived + totalBalance)}</strong>
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
              {attentionCustomers.map((customer) => (
                <div key={customer.id} className="attention-item">
                  <div>
                    <strong>{customer.customerName}</strong>
                    <span>
                      {customer.service === 'cctv' ? 'CCTV / NKSS' : 'Broadband / NKBB'}
                    </span>
                  </div>
                  <div className="attention-tags">
                    {customer.balanceAmount > 0 && (
                      <span className="attention-tag due">{formatCurrency(customer.balanceAmount)} due</span>
                    )}
                    {customer.products.length === 0 && (
                      <span className="attention-tag neutral">No products mapped</span>
                    )}
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
                  <div className="rc-avatar">{customer.customerName.charAt(0)}</div>
                  <div className="rc-info">
                    <strong>{customer.customerName}</strong>
                    <span>
                      {customer.mobile} • {customer.city}
                    </span>
                  </div>
                  <div className="rc-right">
                    <span className={`rc-service ${customer.service}`}>
                      {customer.service === 'cctv' ? 'NKSS' : 'NKBB'}
                    </span>
                    <span className={`rc-balance ${customer.balanceAmount > 0 ? 'due' : 'clear'}`}>
                      {customer.balanceAmount > 0
                        ? `${formatCurrency(customer.balanceAmount)} due`
                        : 'Paid'}
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
