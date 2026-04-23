import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { onboardAgent } from '../../api/userOnboarding'
import { BANK_CODE, INDIA_STATES, AGENT_TYPES, BUSINESS_PROOF_OPTIONS } from '../../utils/constants'
import FormField from '../../components/common/FormField'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'

const PRODUCT_OPTS = ['dmt', 'aeps', 'cardPin', 'accountOpen', 'miniStatement', 'balanceEnquiry']
const SECTIONS = ['Basic Info', 'Business Details', 'KYC Details', 'Bank & Terminal', 'Other Details']

export default function OnboardAgent() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [agentType, setAgentType] = useState(AGENT_TYPES[0])
  const [productFeatures, setProductFeatures] = useState([])
  const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm()

  const toggleFeature = (f) =>
    setProductFeatures((p) => p.includes(f) ? p.filter((x) => x !== f) : [...p, f])

  const nextStep = async () => {
    if (await trigger()) setStep((s) => Math.min(s + 1, SECTIONS.length - 1))
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        reqType: 'CREATE',
        bankCode: BANK_CODE,
        agentType,
        agentDetails: {
          BasicInformation: {
            firstName:         data.firstName,
            middleName:        data.middleName || '',
            lastName:          data.lastName,
            mobileNumber:      data.mobileNumber,
            email:             data.email,
            permanentAddress1: data.permanentAddress1,
            permanentAddress2: data.permanentAddress2,
            permanentAddress3: data.permanentAddress3,
            country:           'India',
            state:             data.state,
            city:              data.city,
            pinCode:           data.pinCode,
            district:          data.district,
            area:              data.area,
            dob:               data.dob,
          },
          BusinessDetails: {
            businessName:    data.businessName,
            revenueCenter:   data.revenueCenter,
            workingShift:    data.workingShift,
            businessAddress: data.businessAddress,
            businessCity:    data.businessCity,
            businessDistrict: data.businessDistrict,
            businessArea:    data.businessArea,
            businessPincode: data.businessPincode,
            businessState:   data.businessState,
            gstNumber:       data.gstNumber,
            businessProof:   data.businessProof,
            latitude:        Number(data.latitude),
            longitude:       Number(data.longitude),
          },
          KycDetails: {
            pan:               data.pan,
            panImage:          data.panImage,
            aadhaar:           data.aadhaar,
            aadhaarFrontImage: data.aadhaarFrontImage,
            aadhaarBackImage:  data.aadhaarBackImage,
          },
          BankDetails: {
            accountNumber:  data.accountNumber,
            nomineeDetails: data.nomineeDetails,
          },
          TerminalDetails: {
            tAddress: data.tAddress || '',
            tAddress1: data.tAddress1 || '',
            tCity:    data.tCity || '',
            tState:   data.tState || '',
            tEmail:   data.tEmail || '',
            tPincode: data.tPincode || '',
          },
          OtherDetails: {
            bcAgentForm:     data.bcAgentForm,
            affiliationFee:  data.affiliationFee,
            additionalDoc:   data.additionalDoc || '',
            entityId:        data.entityId,
            termsAndCondition: data.termsAndCondition,
            businessProposal: data.businessProposal,
            telephone:       data.telephone,
            alternateNumber: data.alternateNumber,
            productFeatures,
          },
        },
      }

      const res = await onboardAgent(payload)
      if (res.data?.success) {
        toast.success(res.data.message || 'Agent onboarded successfully!')
        reset(); setStep(0); setProductFeatures([])
      } else {
        toast.error(res.data?.message || 'Onboarding failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Onboard Agent" subtitle="Register Master Distributor / Distributor / Agent" />

      {/* Agent type selector */}
      <div className="card p-4 mb-6 flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-600">Agent Type:</span>
        <div className="flex gap-2">
          {AGENT_TYPES.map((t) => (
            <button key={t} type="button" onClick={() => setAgentType(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
                ${agentType === t ? 'bg-nsdl-blue text-white border-nsdl-blue' : 'bg-white text-gray-600 border-gray-300 hover:border-nsdl-blue'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {SECTIONS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-nsdl-blue text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${i === step ? 'text-nsdl-blue' : 'text-gray-400'}`}>{s}</span>
            {i < SECTIONS.length - 1 && <div className="w-6 h-px bg-gray-300" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card p-6">

          {step === 0 && (
            <div>
              <p className="section-title">Basic Information</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="First Name" required error={errors.firstName?.message}>
                  <input {...register('firstName', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Middle Name">
                  <input {...register('middleName')} className="form-input" />
                </FormField>
                <FormField label="Last Name" required error={errors.lastName?.message}>
                  <input {...register('lastName', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Mobile Number" error={errors.mobileNumber?.message}>
                  <input {...register('mobileNumber', { pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid mobile' } })} className="form-input" />
                </FormField>
                <FormField label="Email" error={errors.email?.message}>
                  <input {...register('email', { pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} className="form-input" type="email" />
                </FormField>
                <FormField label="Date of Birth (MM/DD/YYYY)" required error={errors.dob?.message}>
                  <input {...register('dob', { required: 'Required' })} className="form-input" placeholder="MM/DD/YYYY" />
                </FormField>
                <FormField label="Address Line 1" required error={errors.permanentAddress1?.message}>
                  <input {...register('permanentAddress1', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Address Line 2" required error={errors.permanentAddress2?.message}>
                  <input {...register('permanentAddress2', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Address Line 3" required error={errors.permanentAddress3?.message}>
                  <input {...register('permanentAddress3', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="State" required error={errors.state?.message}>
                  <select {...register('state', { required: 'Required' })} className="form-input">
                    <option value="">Select State</option>
                    {INDIA_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </FormField>
                <FormField label="City" required error={errors.city?.message}>
                  <input {...register('city', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="District" required error={errors.district?.message}>
                  <input {...register('district', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Area" required error={errors.area?.message}>
                  <input {...register('area', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Pin Code" required error={errors.pinCode?.message}>
                  <input {...register('pinCode', { required: 'Required', pattern: { value: /^\d{6}$/, message: '6-digit pincode' } })} className="form-input" />
                </FormField>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="section-title">Business Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Business Name" required error={errors.businessName?.message}>
                  <input {...register('businessName', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Business Address" required error={errors.businessAddress?.message}>
                  <input {...register('businessAddress', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Business City" required error={errors.businessCity?.message}>
                  <input {...register('businessCity', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Business State" required error={errors.businessState?.message}>
                  <select {...register('businessState', { required: 'Required' })} className="form-input">
                    <option value="">Select State</option>
                    {INDIA_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </FormField>
                <FormField label="Business District" required error={errors.businessDistrict?.message}>
                  <input {...register('businessDistrict', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Business Area" required error={errors.businessArea?.message}>
                  <input {...register('businessArea', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Business Pincode" required error={errors.businessPincode?.message}>
                  <input {...register('businessPincode', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Revenue Center" required error={errors.revenueCenter?.message}>
                  <input {...register('revenueCenter', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Working Shift" required error={errors.workingShift?.message}>
                  <input {...register('workingShift', { required: 'Required' })} className="form-input" placeholder="e.g. 9" />
                </FormField>
                <FormField label="GST Number" required error={errors.gstNumber?.message}>
                  <input {...register('gstNumber', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Business Proof" required error={errors.businessProof?.message}>
                  <select {...register('businessProof', { required: 'Required' })} className="form-input">
                    <option value="">Select</option>
                    {BUSINESS_PROOF_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </FormField>
                <FormField label="Latitude" required error={errors.latitude?.message}>
                  <input {...register('latitude', { required: 'Required' })} type="number" step="any" className="form-input" />
                </FormField>
                <FormField label="Longitude" required error={errors.longitude?.message}>
                  <input {...register('longitude', { required: 'Required' })} type="number" step="any" className="form-input" />
                </FormField>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="section-title">KYC Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="PAN" required error={errors.pan?.message}>
                  <input {...register('pan', { required: 'Required', pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]$/, message: 'Invalid PAN' } })} className="form-input" placeholder="ABCDE1234F" />
                </FormField>
                <FormField label="PAN Image (link)" required error={errors.panImage?.message}>
                  <input {...register('panImage', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Aadhaar Number" required error={errors.aadhaar?.message}>
                  <input {...register('aadhaar', { required: 'Required', pattern: { value: /^\d{12}$/, message: '12-digit aadhaar' } })} className="form-input" />
                </FormField>
                <FormField label="Aadhaar Front Image (link)" required error={errors.aadhaarFrontImage?.message}>
                  <input {...register('aadhaarFrontImage', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Aadhaar Back Image (link)" required error={errors.aadhaarBackImage?.message}>
                  <input {...register('aadhaarBackImage', { required: 'Required' })} className="form-input" />
                </FormField>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="section-title">Bank Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <FormField label="Account Number" required error={errors.accountNumber?.message}>
                  <input {...register('accountNumber', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Nominee Details" required error={errors.nomineeDetails?.message}>
                  <input {...register('nomineeDetails', { required: 'Required' })} className="form-input" />
                </FormField>
              </div>

              <p className="section-title">Terminal Details <span className="text-gray-400 font-normal normal-case text-xs">(required if DMT/AEPS selected)</span></p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Terminal Address">
                  <input {...register('tAddress')} className="form-input" />
                </FormField>
                <FormField label="Terminal Address 2">
                  <input {...register('tAddress1')} className="form-input" />
                </FormField>
                <FormField label="Terminal City">
                  <input {...register('tCity')} className="form-input" />
                </FormField>
                <FormField label="Terminal State">
                  <input {...register('tState')} className="form-input" />
                </FormField>
                <FormField label="Terminal Email">
                  <input {...register('tEmail')} className="form-input" type="email" />
                </FormField>
                <FormField label="Terminal Pincode">
                  <input {...register('tPincode')} className="form-input" />
                </FormField>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="section-title">Other Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="BC Agent Form" required error={errors.bcAgentForm?.message}>
                  <input {...register('bcAgentForm', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Affiliation Fee" required error={errors.affiliationFee?.message}>
                  <input {...register('affiliationFee', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Entity ID" required error={errors.entityId?.message}>
                  <input {...register('entityId', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Terms & Conditions" required error={errors.termsAndCondition?.message}>
                  <input {...register('termsAndCondition', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Business Proposal" required error={errors.businessProposal?.message}>
                  <input {...register('businessProposal', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Telephone" required error={errors.telephone?.message}>
                  <input {...register('telephone', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Alternate Number" required error={errors.alternateNumber?.message}>
                  <input {...register('alternateNumber', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Additional Document">
                  <input {...register('additionalDoc')} className="form-input" />
                </FormField>
              </div>

              <div className="mt-6">
                <p className="section-title">Product Features</p>
                <div className="flex flex-wrap gap-3">
                  {PRODUCT_OPTS.map((f) => (
                    <button key={f} type="button" onClick={() => toggleFeature(f)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition
                        ${productFeatures.includes(f)
                          ? 'bg-nsdl-blue text-white border-nsdl-blue'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-nsdl-blue'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn-secondary disabled:opacity-40">
            ← Previous
          </button>
          {step < SECTIONS.length - 1 ? (
            <button type="button" onClick={nextStep} className="btn-primary">Next →</button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <><Spinner size="sm" /> Submitting…</> : 'Submit Onboarding'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
