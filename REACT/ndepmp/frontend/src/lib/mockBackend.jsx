import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { generateId, generateOtp } from './ids';
import { NIGERIA_STATES, DISCOS, TARIFF_BANDS } from '@/data/nigeria';

const MockBackendContext = createContext(null);
const DB_KEY = 'ndepmp-mock-db';
const SESSION_KEY = 'ndepmp-session';

function seedAccounts() {
  return [
    { id: 'seed-admin', fullName: 'Demo Admin', email: 'admin@ndepmp.example', phone: '', password: '', role: 'admin', status: 'active', createdAt: new Date().toISOString() },
    { id: 'seed-agent', fullName: 'Demo Field Agent', email: 'agent@ndepmp.example', phone: '', password: '', role: 'field_agent', status: 'active', createdAt: new Date().toISOString() },
  ];
}

const emptyDb = () => ({
  accounts: seedAccounts(),
  properties: [],
  electricityAccounts: [],
  meters: [],
  bills: [],
  payments: [],
  complaints: [],
  notifications: [],
  supportTickets: [],
  fieldTasks: [],
  auditLogs: [],
  states: NIGERIA_STATES.map((name) => ({ id: generateId('st'), name, active: true })),
  utilityCompanies: DISCOS.map((d) => ({ id: generateId('uc'), code: d.code, name: d.name, active: true })),
  tariffBands: TARIFF_BANDS.map((b) => ({ id: generateId('tb'), ...b })),
  settings: { maintenanceMode: false, allowRegistrations: true, requireFieldVerification: true },
  callRequests: [],
  rolePermissions: {
    citizen: ['view_own_properties', 'file_complaints', 'pay_bills'],
    field_agent: ['view_own_properties', 'verify_properties'],
    admin: ['view_own_properties', 'file_complaints', 'pay_bills', 'verify_properties', 'approve_properties', 'manage_users', 'manage_complaints', 'manage_tariffs', 'manage_settings'],
  },
});

function loadDb() {
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) return emptyDb();
    const parsed = JSON.parse(raw);
    return { ...emptyDb(), ...parsed, accounts: parsed.accounts?.length ? parsed.accounts : seedAccounts() };
  } catch {
    return emptyDb();
  }
}

export function MockBackendProvider({ children }) {
  const [db, setDb] = useState(loadDb);
  const [currentUserId, setCurrentUserId] = useState(() => window.localStorage.getItem(SESSION_KEY) || null);

  useEffect(() => {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  }, [db]);

  const log = useCallback((action, entity) => {
    setDb((prev) => ({
      ...prev,
      auditLogs: [{ id: generateId('LOG'), action, entity, at: new Date().toISOString() }, ...prev.auditLogs].slice(0, 300),
    }));
  }, []);

  const notify = useCallback((title, message, type = 'system') => {
    setDb((prev) => ({
      ...prev,
      notifications: [
        { id: generateId('NTF'), title, message, type, isRead: false, createdAt: new Date().toISOString() },
        ...prev.notifications,
      ],
    }));
  }, []);

  const currentUser = useMemo(() => db.accounts.find((a) => a.id === currentUserId) || null, [db.accounts, currentUserId]);

  // ---------- Auth ----------

  const signup = useCallback(
    (data) => {
      if (db.accounts.some((a) => a.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('An account with this email already exists.');
      }
      const code = generateOtp();
      const account = {
        id: generateId('usr'),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        password: data.password,
        role: 'citizen',
        status: 'pending_verification',
        verificationCode: code,
        createdAt: new Date().toISOString(),
      };
      setDb((prev) => ({ ...prev, accounts: [...prev.accounts, account] }));
      log('account.registered', account.email);
      return account;
    },
    [db.accounts, log]
  );

  const resendVerification = useCallback(
    (email) => {
      const account = db.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!account || account.status === 'active') return null;
      const code = generateOtp();
      setDb((prev) => ({
        ...prev,
        accounts: prev.accounts.map((a) => (a.id === account.id ? { ...a, verificationCode: code } : a)),
      }));
      return code;
    },
    [db.accounts]
  );

  const verifyEmail = useCallback(
    (email, code) => {
      const account = db.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!account) throw new Error('No account found for this email.');
      if (account.status === 'active') return true;
      if (account.verificationCode !== code) throw new Error('Invalid or expired code.');
      setDb((prev) => ({
        ...prev,
        accounts: prev.accounts.map((a) => (a.id === account.id ? { ...a, status: 'active', verificationCode: null } : a)),
      }));
      log('account.verified', account.email);
      return true;
    },
    [db.accounts, log]
  );

  const login = useCallback(
    (email, password) => {
      const account = db.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!account || account.password !== password) throw new Error('Invalid email or password.');
      if (account.status !== 'active') throw new Error('Please verify your email before signing in.');
      setCurrentUserId(account.id);
      window.localStorage.setItem(SESSION_KEY, account.id);
      log('account.login', account.email);
      return account;
    },
    [db.accounts, log]
  );

  const loginAsDemo = useCallback(
    (role) => {
      const account = db.accounts.find((a) => a.role === role);
      if (!account) return null;
      setCurrentUserId(account.id);
      window.localStorage.setItem(SESSION_KEY, account.id);
      log('account.demo_login', account.email);
      return account;
    },
    [db.accounts, log]
  );

  const logout = useCallback(() => {
    setCurrentUserId(null);
    window.localStorage.removeItem(SESSION_KEY);
  }, []);

  const requestPasswordReset = useCallback(
    (email) => {
      const account = db.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!account) return null;
      const code = generateOtp();
      setDb((prev) => ({
        ...prev,
        accounts: prev.accounts.map((a) => (a.id === account.id ? { ...a, resetCode: code } : a)),
      }));
      return code;
    },
    [db.accounts]
  );

  const resetPassword = useCallback(
    (email, code, newPassword) => {
      const account = db.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!account || !account.resetCode || account.resetCode !== code) throw new Error('Invalid or expired code.');
      setDb((prev) => ({
        ...prev,
        accounts: prev.accounts.map((a) => (a.id === account.id ? { ...a, password: newPassword, resetCode: null } : a)),
      }));
      log('account.password_reset', account.email);
    },
    [db.accounts, log]
  );

  const updateProfile = useCallback(
    (data) => {
      if (!currentUserId) return;
      setDb((prev) => ({
        ...prev,
        accounts: prev.accounts.map((a) => (a.id === currentUserId ? { ...a, ...data } : a)),
      }));
      log('account.profile_updated', currentUser?.email);
    },
    [currentUserId, currentUser, log]
  );

  // ---------- Properties ----------

  const registerProperty = useCallback(
    (data) => {
      const property = {
        id: generateId('id'),
        propertyUid: generateId('PROP'),
        addressUid: generateId('ADDR'),
        ownerId: currentUserId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...data,
      };
      const task = {
        id: generateId('id'),
        propertyId: property.id,
        taskType: 'verification',
        status: 'assigned',
        assignedAt: new Date().toISOString(),
      };
      setDb((prev) => ({
        ...prev,
        properties: [property, ...prev.properties],
        fieldTasks: [task, ...prev.fieldTasks],
      }));
      notify('Property submitted', `${property.street} has been submitted and queued for field verification.`, 'property');
      log('property.submitted', property.propertyUid);
      return property;
    },
    [currentUserId, notify, log]
  );

  const reviewProperty = useCallback(
    (id, decision, reason) => {
      const property = db.properties.find((p) => p.id === id);
      setDb((prev) => ({
        ...prev,
        properties: prev.properties.map((p) =>
          p.id === id ? { ...p, status: decision, reviewedAt: new Date().toISOString(), rejectionReason: decision === 'rejected' ? reason : undefined } : p
        ),
      }));
      if (property) {
        notify(
          decision === 'approved' ? 'Property approved' : 'Property rejected',
          decision === 'approved'
            ? `${property.street} is now verified. You can link an electricity account.`
            : `${property.street} was rejected: ${reason || 'see notes'}.`,
          'property'
        );
        log(`property.${decision}`, property.propertyUid);
      }
    },
    [db.properties, notify, log]
  );

  // ---------- Electricity ----------

  const linkMeter = useCallback(
    (propertyId, data) => {
      const accountId = generateId('id');
      const account = { id: accountId, accountNumber: generateId('ACC'), propertyId, ...data };
      const meter = {
        id: generateId('id'),
        meterUid: generateId('MTR'),
        electricityAccountId: accountId,
        meterNumber: `M${Math.floor(10000000 + Math.random() * 89999999)}`,
        status: 'active',
      };
      const bill = {
        id: generateId('id'),
        billUid: generateId('BILL'),
        electricityAccountId: accountId,
        propertyId,
        period: new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }),
        consumptionKwh: Math.floor(80 + Math.random() * 220),
        amount: Math.floor(4000 + Math.random() * 18000),
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        status: 'pending',
        isEstimated: true,
      };
      setDb((prev) => ({
        ...prev,
        electricityAccounts: [...prev.electricityAccounts, account],
        meters: [...prev.meters, meter],
        bills: [bill, ...prev.bills],
      }));
      notify('Meter linked', `Meter ${meter.meterNumber} is now linked to your property.`, 'electricity');
      log('meter.linked', meter.meterUid);
      return { account, meter };
    },
    [notify, log]
  );

  // ---------- Payments ----------

  const payBill = useCallback(
    (billId, provider) => {
      const bill = db.bills.find((b) => b.id === billId);
      if (!bill) return null;
      const payment = {
        id: generateId('id'),
        paymentUid: generateId('PAY'),
        purpose: 'bill',
        billId,
        propertyId: bill.propertyId,
        amount: bill.amount,
        provider,
        status: 'success',
        paidAt: new Date().toISOString(),
      };
      setDb((prev) => ({
        ...prev,
        bills: prev.bills.map((b) => (b.id === billId ? { ...b, status: 'paid' } : b)),
        payments: [payment, ...prev.payments],
      }));
      notify('Payment received', `\u20a6${bill.amount.toLocaleString()} paid via ${provider}. Receipt ${payment.paymentUid} is ready.`, 'payment');
      log('payment.success', payment.paymentUid);
      return payment;
    },
    [db.bills, notify, log]
  );

  // ---------- Complaints ----------

  const fileComplaint = useCallback(
    (data) => {
      const complaint = {
        id: generateId('id'),
        complaintUid: generateId('CMP'),
        ownerId: currentUserId,
        status: 'open',
        createdAt: new Date().toISOString(),
        updates: [],
        ...data,
      };
      setDb((prev) => ({ ...prev, complaints: [complaint, ...prev.complaints] }));
      notify('Complaint filed', `Reference ${complaint.complaintUid} \u2014 we'll track it from here.`, 'complaint');
      log('complaint.filed', complaint.complaintUid);
      return complaint;
    },
    [currentUserId, notify, log]
  );

  const updateComplaint = useCallback(
    (id, status, note) => {
      const complaint = db.complaints.find((c) => c.id === id);
      setDb((prev) => ({
        ...prev,
        complaints: prev.complaints.map((c) =>
          c.id === id ? { ...c, status, updates: [...c.updates, { status, note, at: new Date().toISOString() }] } : c
        ),
      }));
      if (complaint) {
        notify('Complaint updated', `${complaint.complaintUid} is now ${status.replace('_', ' ')}.`, 'complaint');
        log('complaint.updated', complaint.complaintUid);
      }
    },
    [db.complaints, notify, log]
  );

  // ---------- Support ----------

  const fileTicket = useCallback(
    (data) => {
      const ticket = { id: generateId('id'), ticketUid: generateId('TCK'), ownerId: currentUserId, status: 'open', createdAt: new Date().toISOString(), ...data };
      setDb((prev) => ({ ...prev, supportTickets: [ticket, ...prev.supportTickets] }));
      notify('Ticket opened', `${ticket.ticketUid} \u2014 support will follow up soon.`, 'support');
      log('ticket.filed', ticket.ticketUid);
      return ticket;
    },
    [currentUserId, notify, log]
  );

  // ---------- Notifications ----------

  const markNotificationRead = useCallback((id) => {
    setDb((prev) => ({ ...prev, notifications: prev.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)) }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setDb((prev) => ({ ...prev, notifications: prev.notifications.map((n) => ({ ...n, isRead: true })) }));
  }, []);

  // ---------- Field agent ----------

  const submitFieldReport = useCallback(
    (taskId, data) => {
      setDb((prev) => ({
        ...prev,
        fieldTasks: prev.fieldTasks.map((t) => (t.id === taskId ? { ...t, status: 'completed', completedAt: new Date().toISOString(), report: data } : t)),
      }));
      log('field_task.completed', taskId);
    },
    [log]
  );

  // ---------- Demo utilities ----------

  // ---------- Reference data (super admin) ----------

  const addState = useCallback(
    (name) => {
      setDb((prev) => ({ ...prev, states: [...prev.states, { id: generateId('st'), name, active: true }] }));
      log('state.added', name);
    },
    [log]
  );

  const toggleStateActive = useCallback((id) => {
    setDb((prev) => ({ ...prev, states: prev.states.map((s) => (s.id === id ? { ...s, active: !s.active } : s)) }));
  }, []);

  const addUtilityCompany = useCallback(
    (data) => {
      setDb((prev) => ({ ...prev, utilityCompanies: [...prev.utilityCompanies, { id: generateId('uc'), active: true, ...data }] }));
      log('utility_company.added', data.code);
    },
    [log]
  );

  const toggleUtilityCompanyActive = useCallback((id) => {
    setDb((prev) => ({ ...prev, utilityCompanies: prev.utilityCompanies.map((u) => (u.id === id ? { ...u, active: !u.active } : u)) }));
  }, []);

  const updateTariffBand = useCallback(
    (id, data) => {
      setDb((prev) => ({ ...prev, tariffBands: prev.tariffBands.map((b) => (b.id === id ? { ...b, ...data } : b)) }));
      log('tariff_band.updated', id);
    },
    [log]
  );

  const updateSettings = useCallback(
    (data) => {
      setDb((prev) => ({ ...prev, settings: { ...prev.settings, ...data } }));
      log('settings.updated', JSON.stringify(data));
    },
    [log]
  );

  const updateRolePermissions = useCallback(
    (role, permissions) => {
      setDb((prev) => ({ ...prev, rolePermissions: { ...prev.rolePermissions, [role]: permissions } }));
      log('role_permissions.updated', role);
    },
    [log]
  );

  const inviteStaff = useCallback(
    (data) => {
      const account = {
        id: generateId('usr'),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        password: '',
        role: data.role,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setDb((prev) => ({ ...prev, accounts: [...prev.accounts, account] }));
      notify('Staff invited', `${account.fullName} added as ${account.role.replace('_', ' ')}.`, 'system');
      log('staff.invited', account.email);
      return account;
    },
    [notify, log]
  );

  const requestCall = useCallback(
    (data) => {
      const request = { id: generateId('id'), ownerId: currentUserId, status: 'pending', createdAt: new Date().toISOString(), ...data };
      setDb((prev) => ({ ...prev, callRequests: [request, ...prev.callRequests] }));
      notify('Callback requested', "We'll call you at the time you selected.", 'support');
      log('call_request.filed', request.id);
      return request;
    },
    [currentUserId, notify, log]
  );

  const resetDemoData = useCallback(() => {
    window.localStorage.removeItem(DB_KEY);
    window.localStorage.removeItem(SESSION_KEY);
    setDb(emptyDb());
    setCurrentUserId(null);
  }, []);

  const value = {
    ...db,
    currentUser,
    signup,
    resendVerification,
    verifyEmail,
    login,
    loginAsDemo,
    logout,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    registerProperty,
    reviewProperty,
    linkMeter,
    payBill,
    fileComplaint,
    updateComplaint,
    fileTicket,
    markNotificationRead,
    markAllNotificationsRead,
    submitFieldReport,
    addState,
    toggleStateActive,
    addUtilityCompany,
    toggleUtilityCompanyActive,
    updateTariffBand,
    updateSettings,
    updateRolePermissions,
    inviteStaff,
    requestCall,
    resetDemoData,
  };

  return <MockBackendContext.Provider value={value}>{children}</MockBackendContext.Provider>;
}

export function useMockBackend() {
  const ctx = useContext(MockBackendContext);
  if (!ctx) throw new Error('useMockBackend must be used within MockBackendProvider');
  return ctx;
}
