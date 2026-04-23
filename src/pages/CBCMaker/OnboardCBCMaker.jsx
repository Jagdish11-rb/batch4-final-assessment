import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { onboardCBCMaker } from '../../api/userOnboarding'
import { BANK_CODE, INDIA_STATES } from '../../utils/constants'
import FormField from '../../components/common/FormField'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'

const FEATURES = ['accountOpen', 'cardPin', 'DMT', 'AEPS', 'miniStatement', 'balanceEnquiry']
const SECTIONS = ['Basic Information', 'Shop Details', 'Other Details']

export default function OnboardCBCMaker() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm()

  const toggleFeature = (f) =>
    setSelectedFeatures((p) => p.includes(f) ? p.filter((x) => x !== f) : [...p, f])

  const nextStep = async () => {
    if (await trigger()) setStep((s) => Math.min(s + 1, SECTIONS.length - 1))
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        reqType: 'CREATE',
        bankCode: BANK_CODE,
        cbcMakerDetails: {
          BasicInformation: {
            firstName:    data.firstName,
            middleName:   data.middleName || '',
            lastName:     data.lastName,
            mobileNumber: data.mobileNumber,
            email:        data.email,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            country:      'India',
            state:        data.state,
            city:         data.city,
            pincode:      data.pincode,
            district:     data.district,
            area:         data.area,
            dob:          data.dob,
            pan:          data.pan,
            companyName:  data.companyName,
          },
          ShopDetails: {
            shopAddress:  data.shopAddress,
            shopState:    data.shopState,
            shopCity:     data.shopCity,
            shopDistrict: data.shopDistrict,
            shopArea:     data.shopArea,
            shopPinCode:  data.shopPinCode,
            latitude:     Number(data.latitude),
            longitude:    Number(data.longitude),
          },
          OtherDetails: {
            productFeatures:  selectedFeatures,
            telephone:        data.telephone,
            alternateNumber:  data.alternateNumber,
            bcAgentForm:      data.bcAgentForm,
          },
        },
      }

      const res = await onboardCBCMaker(payload)
      if (res.data?.success) {
        toast.success(res.data.message || 'CBC Maker onboarded!')
        reset(); setStep(0); setSelectedFeatures([])
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
      <PageHeader title="Onboard CBC Maker" subtitle="Register a new CBC Maker under a CBC entity" />

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
                <FormField label="Mobile Number" required error={errors.mobileNumber?.message}>
                  <input {...register('mobileNumber', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid mobile' } })} className="form-input" />
                </FormField>
                <FormField label="Email" required error={errors.email?.message}>
                  <input {...register('email', { required: 'Required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} className="form-input" type="email" />
                </FormField>
                <FormField label="Date of Birth (MM/DD/YYYY)" required error={errors.dob?.message}>
                  <input {...register('dob', { required: 'Required' })} className="form-input" placeholder="MM/DD/YYYY" />
                </FormField>
                <FormField label="PAN" required error={errors.pan?.message}>
                  <input {...register('pan', { required: 'Required', pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]$/, message: 'Invalid PAN' } })} className="form-input" placeholder="ABCDE1234F" />
                </FormField>
                <FormField label="Company Name" required error={errors.companyName?.message}>
                  <input {...register('companyName', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Address Line 1" required error={errors.addressLine1?.message}>
                  <input {...register('addressLine1', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Address Line 2" required error={errors.addressLine2?.message}>
                  <input {...register('addressLine2', { required: 'Required' })} className="form-input" />
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
                <FormField label="Pin Code" required error={errors.pincode?.message}>
                  <input {...register('pincode', { required: 'Required', pattern: { value: /^\d{6}$/, message: '6-digit pincode' } })} className="form-input" />
                </FormField>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="section-title">Shop Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Shop Address" required error={errors.shopAddress?.message}>
                  <input {...register('shopAddress', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Shop State" required error={errors.shopState?.message}>
                  <select {...register('shopState', { required: 'Required' })} className="form-input">
                    <option value="">Select State</option>
                    {INDIA_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </FormField>
                <FormField label="Shop City" required error={errors.shopCity?.message}>
                  <input {...register('shopCity', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Shop District" required error={errors.shopDistrict?.message}>
                  <input {...register('shopDistrict', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Shop Area" required error={errors.shopArea?.message}>
                  <input {...register('shopArea', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Shop Pin Code" required error={errors.shopPinCode?.message}>
                  <input {...register('shopPinCode', { required: 'Required', pattern: { value: /^\d{6}$/, message: '6-digit pincode' } })} className="form-input" />
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
              <p className="section-title">Other Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Telephone" required error={errors.telephone?.message}>
                  <input {...register('telephone', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Alternate Number" required error={errors.alternateNumber?.message}>
                  <input {...register('alternateNumber', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="BC Agent Form" required error={errors.bcAgentForm?.message}>
                  <input {...register('bcAgentForm', { required: 'Required' })} className="form-input" />
                </FormField>
              </div>

              <div className="mt-6">
                <p className="section-title">Product Features</p>
                <div className="flex flex-wrap gap-3">
                  {FEATURES.map((f) => (
                    <button key={f} type="button" onClick={() => toggleFeature(f)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition
                        ${selectedFeatures.includes(f)
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
