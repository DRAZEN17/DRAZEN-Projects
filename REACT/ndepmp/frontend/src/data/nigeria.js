export const NIGERIA_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

export const PROPERTY_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'government', label: 'Government' },
];

export const DISCOS = [
  { code: 'AEDC', name: 'Abuja Electricity Distribution Company' },
  { code: 'BEDC', name: 'Benin Electricity Distribution Company' },
  { code: 'EEDC', name: 'Enugu Electricity Distribution Company' },
  { code: 'EKEDC', name: 'Eko Electricity Distribution Company' },
  { code: 'IBEDC', name: 'Ibadan Electricity Distribution Company' },
  { code: 'IKEDC', name: 'Ikeja Electric' },
  { code: 'JED', name: 'Jos Electricity Distribution Plc' },
  { code: 'KAEDCO', name: 'Kaduna Electric' },
  { code: 'KEDCO', name: 'Kano Electricity Distribution Company' },
  { code: 'PHED', name: 'Port Harcourt Electricity Distribution' },
  { code: 'YEDC', name: 'Yola Electricity Distribution Company' },
];

export const TARIFF_BANDS = [
  { band: 'A', hours: '20+ hrs/day', rate: 209.5 },
  { band: 'B', hours: '16+ hrs/day', rate: 63.26 },
  { band: 'C', hours: '12+ hrs/day', rate: 52.05 },
  { band: 'D', hours: '8+ hrs/day', rate: 43.27 },
  { band: 'E', hours: '4+ hrs/day', rate: 32.15 },
];

export const COMPLAINT_CATEGORIES = [
  { value: 'no_power', label: 'No power' },
  { value: 'low_voltage', label: 'Low voltage' },
  { value: 'meter_fault', label: 'Meter fault' },
  { value: 'wrong_billing', label: 'Wrong billing' },
  { value: 'transformer_fault', label: 'Transformer fault' },
  { value: 'cable_fault', label: 'Cable fault' },
  { value: 'illegal_connection', label: 'Illegal connection' },
];

export const PAYMENT_PROVIDERS = [
  { value: 'paystack', label: 'Paystack' },
  { value: 'flutterwave', label: 'Flutterwave' },
  { value: 'bank_transfer', label: 'Bank transfer' },
];
