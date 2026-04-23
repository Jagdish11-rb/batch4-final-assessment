export const BASE_URL = 'https://apidev.iserveu.online/NSDL'
export const SDK_BASE_URL = 'https://apidev-sdk.iserveu.online/NSDL'
export const BANK_CODE = 'NSDL'
export const PASS_KEY = 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA'

export const ROLES = {
  OPS_MAKER: 'ops_maker',
  OPS_CHECKER: 'ops_checker',
  CBC: 'CBC',
  CBC_MAKER: 'CBC Maker',
  AGENT: 'Agent',
}

export const STATUS = {
  ALL: 'ALL',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

export const AGENT_TYPES = ['Master Distributor', 'Distributor', 'Agent']

export const PRODUCT_FEATURES = [
  { id: '1', featureName: 'accountOpen' },
  { id: '2', featureName: 'cardPin' },
  { id: '12', featureName: 'DMT' },
  { id: '30', featureName: 'AEPS' },
  { id: '5', featureName: 'miniStatement' },
  { id: '6', featureName: 'balanceEnquiry' },
]

export const BUSINESS_PROOF_OPTIONS = [
  'Aadhaar',
  'Electricity bill',
  'GST certificate',
  'Telephone',
  'Driving Licence',
  'Others',
]

export const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]
