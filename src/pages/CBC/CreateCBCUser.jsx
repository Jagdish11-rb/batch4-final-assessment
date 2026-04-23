import { useState, useRef } from 'react'
import { onboardCBC } from '../../api/userOnboarding'

const PRIMARY = '#8b0304'

const INSTITUTION_TYPES = [
  'Private Limited', 'Public Limited', 'Proprietorship',
  'Partnership', 'LLP', 'Trust', 'Society', 'Others',
]

const PRODUCT_FEATURES = [
  { id: '100', featureName: 'ACCOUNT_OPENING' },
  { id: '25', featureName: 'DMT' },
  { id: '23', featureName: 'AEPS' },
  { id: '94', featureName: 'MATM' },
]

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">
        {label}{required && <span style={{ color: PRIMARY }}> *</span>}
      </label>
      {children}
    </div>
  )
}

function TextInput({ placeholder, value, onChange, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-800 w-full"
    />
  )
}

function FileUpload({ label, onChange }) {
  const ref = useRef()
  const [fileName, setFileName] = useState('')
  const handle = (e) => {
    const f = e.target.files[0]
    if (f) { setFileName(f.name); onChange && onChange(f) }
  }
  return (
    <div
      className="border border-dashed border-gray-400 rounded px-4 py-3 flex items-center gap-2 cursor-pointer hover:border-red-800 transition"
      onClick={() => ref.current.click()}
    >
      <i className="fas fa-paperclip text-gray-400 text-sm" />
      <span className="text-sm text-gray-400 truncate">
        {fileName || `Upload ${label} (.pdf Only)`}
      </span>
      <input ref={ref} type="file" accept=".pdf" className="hidden" onChange={handle} />
    </div>
  )
}

const init = {
  firstName: '', middleName: '', lastName: '', ceoName: '',
  companyName: '', emailId: '', pan: '', mobileNumber: '',
  faxNumber: '', adminName: '', adminEmail: '', adminMobileNumber: '',
  businessAddressLine: '', country: 'India', pinCode: '', state: '',
  district: '', city: '', accountNumber: '', gstNumber: '',
  institutionType: '', stdCode: '', telephoneNumber: '',
  affiliationFee: '', numberOfStaff: '',
  agreementFromDate: '', agreementToDate: '',
  entityPanCard: '', incorporationAddressLine1: '',
  entityId: '', latitude: '', longitude: '',
  productFeatures: [],
  bankResolution: null, authorizedSignatoryKyc: null,
  certificateOfIncorporation: null, firstAndLastPageAgreement: null,
  lastPageAgreement: null, businessProposal: null,
}

export default function CreateCBCUser() {
  const [form, setForm] = useState(init)
  const [agreed, setAgreed] = useState(false)

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleReset = () => { setForm(init); setAgreed(false) }

  const handleCreate = () => {
    const payload = {
      reqType: 'CREATE',
      bankCode: 'NSDL',
      cbcDetails: {
        BasicInformation: {
          firstName: form.firstName,
          middleName: form.middleName,
          lastName: form.lastName,
          mobileNumber: form.mobileNumber,
          email: form.emailId,
          country: form.country,
          state: form.state,
          district: form.district,
          city: form.city,
          pinCode: form.pinCode,
        },
        BusinessDetails: {
          numberOfStaff: form.numberOfStaff,
          faxNumber: form.faxNumber,
          businessAddress: form.businessAddressLine,
          ceoName: form.ceoName,
          companyName: form.companyName,
          gstNumber: form.gstNumber,
          pan: form.pan,
          institutionType: form.institutionType,
          latitude: form.latitude,
          longitude: form.longitude,
        },
        AdminDetails: {
          adminName: form.adminName,
          adminEmail: form.adminEmail,
          adminMobileNumber: form.adminMobileNumber,
        },
        BankDetails: {
          accountNumber: form.accountNumber,
          bankResolution: form.bankResolution ? form.bankResolution.name : '',
        },
        OtherDetails: {
          affiliationFee: form.affiliationFee,
          telephoneNumber: form.stdCode ? `${form.stdCode}-${form.telephoneNumber}` : form.telephoneNumber,
          entityId: form.entityId,
          agreementStartDate: form.agreementFromDate,
          agreementEndDate: form.agreementToDate,
          entityPanCard: form.entityPanCard,
          authorizedSignatoryKyc: form.authorizedSignatoryKyc ? form.authorizedSignatoryKyc.name : '',
          certificateOfIncorporationDocumentPdf: form.certificateOfIncorporation ? form.certificateOfIncorporation.name : '',
          incorporationAddress: form.incorporationAddressLine1,
          firstAndLastPageAgreement: form.firstAndLastPageAgreement ? form.firstAndLastPageAgreement.name : '',
          lastPageAgreement: form.lastPageAgreement ? form.lastPageAgreement.name : '',
          productFeatures: form.productFeatures,
          termsAndConditions: agreed ? 'agreed' : '',
          businessProposal: form.businessProposal ? form.businessProposal.name : '',
        },
      },
    }
    onboardCBC(payload)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        <Field label="First Name" required>
          <TextInput placeholder="Enter First Name" value={form.firstName} onChange={set('firstName')} />
        </Field>
        <Field label="Middle Name">
          <TextInput placeholder="Enter Middle Name" value={form.middleName} onChange={set('middleName')} />
        </Field>

        <Field label="Last Name" required>
          <TextInput placeholder="Enter Last Name" value={form.lastName} onChange={set('lastName')} />
        </Field>
        <Field label="CEO Name" required>
          <TextInput placeholder="Enter CEO Name" value={form.ceoName} onChange={set('ceoName')} />
        </Field>

        <Field label="Company Name" required>
          <TextInput placeholder="Enter Company Name" value={form.companyName} onChange={set('companyName')} />
        </Field>
        <Field label="Email ID" required>
          <TextInput placeholder="Enter Email ID" type="email" value={form.emailId} onChange={set('emailId')} />
        </Field>

        <Field label="PAN" required>
          <TextInput placeholder="Enter PAN" value={form.pan} onChange={set('pan')} />
        </Field>
        <Field label="Mobile Number" required>
          <TextInput placeholder="Enter Mobile Number" value={form.mobileNumber} onChange={set('mobileNumber')} />
        </Field>

        <Field label="FAX Number">
          <TextInput placeholder="Enter FAX Number" value={form.faxNumber} onChange={set('faxNumber')} />
        </Field>
        <Field label="Admin Name" required>
          <TextInput placeholder="Enter Admin Name" value={form.adminName} onChange={set('adminName')} />
        </Field>

        <Field label="Admin Email" required>
          <TextInput placeholder="Enter Admin Email" type="email" value={form.adminEmail} onChange={set('adminEmail')} />
        </Field>
        <Field label="Admin Mobile Number" required>
          <TextInput placeholder="Enter Admin Mobile Number" value={form.adminMobileNumber} onChange={set('adminMobileNumber')} />
        </Field>

        <Field label="Business Address Line" required>
          <TextInput placeholder="Enter Business Address Line" value={form.businessAddressLine} onChange={set('businessAddressLine')} />
        </Field>
        <Field label="Country" required>
          <TextInput placeholder="Country" value={form.country} onChange={set('country')} />
        </Field>

        <Field label="PIN Code" required>
          <TextInput placeholder="Enter PIN Code" value={form.pinCode} onChange={set('pinCode')} />
        </Field>
        <Field label="State" required>
          <TextInput placeholder="Enter State" value={form.state} onChange={set('state')} />
        </Field>

        <Field label="District" required>
          <TextInput placeholder="Enter District" value={form.district} onChange={set('district')} />
        </Field>
        <Field label="City" required>
          <TextInput placeholder="Enter City" value={form.city} onChange={set('city')} />
        </Field>

        <Field label="Account Number" required>
          <TextInput placeholder="Enter Account Number" value={form.accountNumber} onChange={set('accountNumber')} />
        </Field>
        <Field label="GST Number" required>
          <TextInput placeholder="Enter GST Number" value={form.gstNumber} onChange={set('gstNumber')} />
        </Field>

        {/* Institution Type */}
        <Field label="Institution Type" required>
          <div className="relative">
            <select
              value={form.institutionType}
              onChange={set('institutionType')}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none focus:outline-none focus:border-red-800 pr-8 text-gray-600"
            >
              <option value="" disabled>Select Institution Type</option>
              {INSTITUTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          </div>
        </Field>

        {/* Telephone Number */}
        <Field label="Telephone Number" required>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="STD Code"
              value={form.stdCode}
              onChange={set('stdCode')}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-800 w-28"
            />
            <input
              type="text"
              placeholder="Telephone Number"
              value={form.telephoneNumber}
              onChange={set('telephoneNumber')}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-800 flex-1"
            />
          </div>
        </Field>

        <Field label="Affiliation Fee" required>
          <TextInput placeholder="Enter Affiliation Fee" value={form.affiliationFee} onChange={set('affiliationFee')} />
        </Field>
        <Field label="Number of Staff" required>
          <TextInput placeholder="Enter Number of Staff" value={form.numberOfStaff} onChange={set('numberOfStaff')} />
        </Field>

        {/* Agreement dates */}
        <Field label="Agreement From Date" required>
          <div className="relative">
            <input
              type="date"
              value={form.agreementFromDate}
              onChange={set('agreementFromDate')}
              placeholder="Choose Agreement From Date"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-800 text-gray-500"
            />
          </div>
        </Field>
        <Field label="Agreement To Date" required>
          <div className="relative">
            <input
              type="date"
              value={form.agreementToDate}
              onChange={set('agreementToDate')}
              placeholder="Choose Agreement To Date"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-800 text-gray-500"
            />
          </div>
        </Field>

        <Field label="Entity PAN Card" required>
          <TextInput placeholder="Enter Entity PAN Card" value={form.entityPanCard} onChange={set('entityPanCard')} />
        </Field>
        <Field label="Incorporation Address" required>
          <TextInput placeholder="Enter Incorporation Address" value={form.incorporationAddressLine1} onChange={set('incorporationAddressLine1')} />
        </Field>

        <Field label="Entity ID" required>
          <TextInput placeholder="Enter Entity ID" value={form.entityId} onChange={set('entityId')} />
        </Field>
        <Field label="Latitude" required>
          <TextInput placeholder="Enter Latitude" value={form.latitude} onChange={set('latitude')} />
        </Field>

        <Field label="Longitude" required>
          <TextInput placeholder="Enter Longitude" value={form.longitude} onChange={set('longitude')} />
        </Field>

        {/* Product Features — full width */}
        <div className="md:col-span-2">
          <Field label="Product Features" required>
            <div className="flex flex-wrap gap-4 border border-gray-300 rounded px-3 py-2">
              {PRODUCT_FEATURES.map((f) => (
                <label key={f.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-red-800"
                    checked={form.productFeatures.some((p) => p.id === f.id)}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        productFeatures: e.target.checked
                          ? [...prev.productFeatures, { id: f.id, featureName: f.featureName }]
                          : prev.productFeatures.filter((p) => p.id !== f.id),
                      }))
                    }}
                  />
                  {f.featureName}
                </label>
              ))}
            </div>
          </Field>
        </div>

        {/* File uploads */}
        <Field label="Bank Resolution" required>
          <FileUpload label="Bank Resolution" onChange={(f) => setForm((p) => ({ ...p, bankResolution: f }))} />
        </Field>
        <Field label="Authorized Signatory KYC" required>
          <FileUpload label="Authorized Signatory KYC" onChange={(f) => setForm((p) => ({ ...p, authorizedSignatoryKyc: f }))} />
        </Field>

        <Field label="Certificate of Incorporation" required>
          <FileUpload label="Certificate of Incorporation" onChange={(f) => setForm((p) => ({ ...p, certificateOfIncorporation: f }))} />
        </Field>
        <Field label="First & Last Page of Agreement" required>
          <FileUpload label="First & Last Page of Agreement" onChange={(f) => setForm((p) => ({ ...p, firstAndLastPageAgreement: f }))} />
        </Field>

        <Field label="Last Page of Agreement" required>
          <FileUpload label="Last Page of Agreement" onChange={(f) => setForm((p) => ({ ...p, lastPageAgreement: f }))} />
        </Field>
        <Field label="Business Proposal" required>
          <FileUpload label="Business Proposal" onChange={(f) => setForm((p) => ({ ...p, businessProposal: f }))} />
        </Field>

      </div>

      {/* Terms */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 accent-red-800 flex-shrink-0"
        />
        <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
          By using our services, you confirm that you are at least 18 years old and legally capable of entering into agreements.
          You are responsible for securing your account details and for any activity on your account. Fees may apply to certain
          services, which will be disclosed at the time of use. Services are provided for personal, lawful purposes only. Your
          personal data will be handled in accordance with our Privacy Policy. We may update these terms from time to time, and
          your continued use of the services constitutes acceptance of any changes. We are not liable for any damages arising
          from the use of our services, except where required by law. We reserve the right to suspend or terminate your access
          if you violate these terms. These terms are governed by the laws of [Jurisdiction].
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded border text-sm font-semibold"
          style={{ color: PRIMARY, borderColor: PRIMARY }}
        >
          Reset
        </button>
        <button
          onClick={handleCreate}
          className="px-6 py-2 rounded text-sm font-semibold text-white"
          style={{ background: PRIMARY }}
        >
          Create
        </button>
      </div>
    </div>
  )
}
