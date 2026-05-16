const CUSTOMER_STORAGE_KEY = 'netking_customers';

export const SERVICE_CODES = {
  cctv: 'NKSS',
  broadband: 'NKBB',
};

export const SERVICE_LABELS = {
  cctv: 'CCTV Services',
  broadband: 'Broadband Services',
};

export const SERVICE_PRODUCT_OPTIONS = {
  cctv: [
    'DVR / NVR',
    'Bullet Camera',
    'Dome Camera',
    'Hard Disk',
    'Power Supply',
    'Network Switch',
    'Cable / Accessories',
  ],
  broadband: [
    'Fiber Router',
    'ONU / Modem',
    'Wi-Fi Extender',
    'Cable Roll',
    'Plan Package',
    'Static IP',
    'Accessories',
  ],
};

export const PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque', 'Others'];

const normalizeService = (service) => (service === 'broadband' ? 'broadband' : 'cctv');

export const todayDate = () => new Date().toISOString().split('T')[0];

export const toNumber = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (value) => `₹${toNumber(value).toLocaleString('en-IN')}`;

export const calculateBalance = (totalAmount, paidAmount) =>
  Math.max(toNumber(totalAmount) - toNumber(paidAmount), 0);

export const getEmptyProduct = (service = 'cctv') => {
  const normalizedService = normalizeService(service);

  return {
    type: SERVICE_PRODUCT_OPTIONS[normalizedService][0],
    model: '',
    serialNo: '',
    vendorCode: '',
    quantity: 1,
    unitPrice: 0,
  };
};

export const getProductLineTotal = (product = {}) =>
  toNumber(product.quantity) * toNumber(product.unitPrice);

export const normalizeProduct = (product = {}, service = 'cctv') => {
  const normalizedService = normalizeService(service);
  const quantity = product.quantity === '' ? '' : Math.max(1, toNumber(product.quantity) || 1);

  return {
    type: product.type !== undefined ? product.type : SERVICE_PRODUCT_OPTIONS[normalizedService][0],
    model: product.model || '',
    serialNo: product.serialNo || '',
    vendorCode: product.vendorCode || '',
    quantity,
    unitPrice: product.unitPrice === '' ? '' : toNumber(product.unitPrice),
  };
};

export const isMeaningfulProduct = (product = {}, service = 'cctv') => {
  const normalized = normalizeProduct(product, service);
  const defaultType = SERVICE_PRODUCT_OPTIONS[normalizeService(service)][0];

  return Boolean(
    normalized.model.trim() ||
      normalized.serialNo.trim() ||
      normalized.unitPrice > 0 ||
      normalized.quantity > 1 ||
      normalized.type !== defaultType
  );
};

const normalizePaymentEntry = (entry = {}) => ({
  id: entry.id || `PMT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  amount: toNumber(entry.amount),
  date: entry.date || todayDate(),
  method: entry.method || 'Cash',
  note: entry.note || '',
});

export const getEmptyCustomerForm = (service = 'cctv') => {
  const normalizedService = normalizeService(service);

  return {
    service: normalizedService,
    customerName: '',
    mobile: '',
    altMobile: '',
    address: '',
    city: '',
    installDate: '',
    installType: normalizedService === 'cctv' ? 'Home' : 'Residential',
    userId: '',
    password: '',
    appAccess: 'Yes - Mobile App Access',
    expireDate: '',
    installTech: '',
    totalAmount: 0,
    advancePay: 0,
    paidAmount: 0,
    balanceAmount: 0,
    remark: '',
    currentLocation: 'Unit 1',
    branch: 'Branch 1',
    products: [],
    paymentHistory: [],
  };
};

const createOpeningPaymentHistory = (paidAmount, date) => {
  if (paidAmount <= 0) {
    return [];
  }

  return [
    normalizePaymentEntry({
      amount: paidAmount,
      date: date || todayDate(),
      method: 'Cash',
      note: 'Opening received amount',
    }),
  ];
};

export const normalizeCustomer = (customer = {}) => {
  const service = normalizeService(customer.service);
  const totalAmount = toNumber(customer.totalAmount);
  const advancePay = toNumber(customer.advancePay);
  const explicitPaid = Math.max(toNumber(customer.paidAmount), advancePay);
  const rawHistory = Array.isArray(customer.paymentHistory) ? customer.paymentHistory : [];
  const paymentHistory =
    rawHistory.length > 0
      ? rawHistory.map(normalizePaymentEntry).filter((entry) => entry.amount > 0)
      : createOpeningPaymentHistory(explicitPaid, customer.installDate || customer.lastPaymentDate);
  const paidFromHistory = paymentHistory.reduce((sum, entry) => sum + entry.amount, 0);
  const paidAmount = Math.min(totalAmount || paidFromHistory || explicitPaid, paidFromHistory || explicitPaid);
  const balanceAmount = calculateBalance(totalAmount, paidAmount);
  const lastPayment = paymentHistory[paymentHistory.length - 1];

  return {
    ...getEmptyCustomerForm(service),
    ...customer,
    service,
    totalAmount,
    advancePay,
    paidAmount,
    balanceAmount,
    products: Array.isArray(customer.products)
      ? customer.products.map((product) => normalizeProduct(product, service))
      : [],
    paymentHistory,
    lastPaymentDate: lastPayment?.date || customer.lastPaymentDate || '',
  };
};

const parseCustomers = () => {
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getCustomers = () => parseCustomers().map(normalizeCustomer);

export const saveCustomers = (customers) => {
  const normalized = customers.map(normalizeCustomer);
  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
};

export const buildCustomerPayload = (form, existingCustomer = null) => {
  const service = normalizeService(form.service || existingCustomer?.service);
  const totalAmount = toNumber(form.totalAmount);
  const advancePay = toNumber(form.advancePay);
  const paidAmount = Math.max(toNumber(form.paidAmount), advancePay);
  const baseHistory = Array.isArray(existingCustomer?.paymentHistory)
    ? existingCustomer.paymentHistory
    : Array.isArray(form.paymentHistory)
      ? form.paymentHistory
      : [];
  const paymentHistory =
    baseHistory.length > 0
      ? baseHistory.map(normalizePaymentEntry).filter((entry) => entry.amount > 0)
      : createOpeningPaymentHistory(paidAmount, form.installDate || todayDate());

  return normalizeCustomer({
    ...existingCustomer,
    ...form,
    id: existingCustomer?.id || form.id || `${service}-${Date.now()}`,
    service,
    totalAmount,
    advancePay,
    paidAmount,
    balanceAmount: calculateBalance(totalAmount, paidAmount),
    products: Array.isArray(form.products)
      ? form.products
          .map((product) => normalizeProduct(product, service))
          .filter((product) => isMeaningfulProduct(product, service))
      : Array.isArray(existingCustomer?.products)
        ? existingCustomer.products
        : [],
    paymentHistory,
    createdAt: existingCustomer?.createdAt || form.createdAt || new Date().toISOString(),
  });
};

export const applyPaymentUpdate = (customer, paymentInput) => {
  const normalizedCustomer = normalizeCustomer(customer);
  const remainingBalance = normalizedCustomer.balanceAmount;
  const requestedAmount = toNumber(paymentInput.amount);
  const amount = Math.min(requestedAmount, remainingBalance);

  if (amount <= 0) {
    return normalizedCustomer;
  }

  const nextHistory = [
    ...normalizedCustomer.paymentHistory,
    normalizePaymentEntry({
      amount,
      date: paymentInput.date || todayDate(),
      method: paymentInput.method || 'Cash',
      note: paymentInput.note || '',
    }),
  ];

  return normalizeCustomer({
    ...normalizedCustomer,
    paidAmount: normalizedCustomer.paidAmount + amount,
    paymentHistory: nextHistory,
    lastPaymentDate: paymentInput.date || todayDate(),
  });
};

export const countAssignedProducts = (customers) =>
  customers.reduce((sum, customer) => sum + customer.products.length, 0);

export const getCollectionRate = (customers) => {
  const totalAmount = customers.reduce((sum, customer) => sum + customer.totalAmount, 0);
  const totalPaid = customers.reduce((sum, customer) => sum + customer.paidAmount, 0);

  if (!totalAmount) {
    return 0;
  }

  return Math.round((totalPaid / totalAmount) * 100);
};
