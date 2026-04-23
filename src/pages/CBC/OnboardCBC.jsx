import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { onboardCBC } from '../../api/userOnboarding'
import { BANK_CODE, INDIA_STATES, PRODUCT_FEATURES } from '../../utils/constants'
import FormField from '../../components/common/FormField'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'

const SECTIONS = ['Basic Information', 'Business Details', 'Admin Details', 'Bank Details', 'Other Details']

export default function OnboardCBC() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm()

  const toggleFeature = (feat) => {
    setSelectedFeatures((prev) =>
      prev.some((f) => f.id === feat.id)
        ? prev.filter((f) => f.id !== feat.id)
        : [...prev, feat]
    )
  }

  const nextStep = async () => {
    const valid = await trigger()
    if (valid) setStep((s) => Math.min(s + 1, SECTIONS.length - 1))
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        reqType: 'CREATE',
        bankCode: BANK_CODE,
        cbcDetails: {
          BasicInformation: {
            firstName:    data.firstName,
            middleName:   data.middleName || '',
            lastName:     data.lastName,
            mobileNumber: data.mobileNumber,
            email:        data.email,
            country:      'India',
            state:        data.state,
            district:     data.district,
            city:         data.city,
            pinCode:      data.pinCode,
          },
          BusinessDetails: {
            numberOfStaff:   Number(data.numberOfStaff),
            faxNumber:       data.faxNumber,
            businessAddress: data.businessAddress,
            ceoName:         data.ceoName,
            companyName:     data.companyName,
            gstNumber:       data.gstNumber,
            pan:             data.pan,
            institutionType: data.institutionType,
            latitude:        Number(data.latitude),
            longitude:       Number(data.longitude),
          },
          AdminDetails: {
            adminName:         data.adminName,
            adminEmail:        data.adminEmail,
            adminMobileNumber: data.adminMobileNumber,
          },
          BankDetails: {
            accountNumber:  data.accountNumber,
            bankResolution: data.bankResolution,
          },
          OtherDetails: {
            affiliationFee:                       data.affiliationFee,
            telephoneNumber:                      data.telephoneNumber || '',
            entityId:                             data.entityId,
            agreementStartDate:                   data.agreementStartDate,
            agreementEndDate:                     data.agreementEndDate,
            entityPanCard:                        data.entityPanCard,
            authorizedSignatoryKyc:               data.authorizedSignatoryKyc,
            certificateOfIncorporationDocumentPdf: data.certificateOfIncorporationDocumentPdf,
            incorporationAddress:                 data.incorporationAddress,
            firstAndLastPageAgreement:            data.firstAndLastPageAgreement,
            productFeatures:                      selectedFeatures,
            termsAndConditions:                   data.termsAndConditions,
            businessProposal:                     data.businessProposal,
          },
        },
      }

      const res = await onboardCBC(payload)
      if (res.data?.success) {
        toast.success(res.data.message || 'CBC onboarded successfully!')
        reset()
        setStep(0)
        setSelectedFeatures([])
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
      <PageHeader title="Onboard New CBC" subtitle="Register a Corporate Business Correspondent" />

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {SECTIONS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-nsdl-blue text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${i === step ? 'text-nsdl-blue' : 'text-gray-400'}`}>{s}</span>
            {i < SECTIONS.length - 1 && <div className="w-6 h-px bg-gray-300" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card p-6">

          {/* Step 0: Basic Information */}
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
                  <input {...register('mobileNumber', { pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid mobile number' } })} className="form-input" placeholder="10-digit mobile" />
                </FormField>
                <FormField label="Email" error={errors.email?.message}>
                  <input {...register('email', { pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} className="form-input" type="email" />
                </FormField>
                <FormField label="State" required error={errors.state?.message}>
                  <select {...register('state', { required: 'Required' })} className="form-input">
                    <option value="">Select State</option>
                    {INDIA_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </FormField>
                <FormField label="District" required error={errors.district?.message}>
                  <input {...register('district', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="City" required error={errors.city?.message}>
                  <input {...register('city', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Pin Code" required error={errors.pinCode?.message}>
                  <input {...register('pinCode', { required: 'Required', pattern: { value: /^\d{6}$/, message: '6-digit pincode' } })} className="form-input" />
                </FormField>
              </div>
            </div>
          )}

          {/* Step 1: Business Details */}
          {step === 1 && (
            <div>
              <p className="section-title">Business Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Company Name" required error={errors.companyName?.message}>
                  <input {...register('companyName', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="CEO Name" required error={errors.ceoName?.message}>
                  <input {...register('ceoName', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Institution Type" required error={errors.institutionType?.message}>
                  <input {...register('institutionType', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="GST Number" required error={errors.gstNumber?.message}>
                  <input {...register('gstNumber', { required: 'Required' })} className="form-input" placeholder="GST Number" />
                </FormField>
                <FormField label="PAN" required error={errors.pan?.message}>
                  <input {...register('pan', { required: 'Required', pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]$/, message: 'Invalid PAN' } })} className="form-input" placeholder="ABCDE1234F" />
                </FormField>
                <FormField label="Number of Staff" required error={errors.numberOfStaff?.message}>
                  <input {...register('numberOfStaff', { required: 'Required' })} type="number" className="form-input" />
                </FormField>
                <FormField label="Fax Number" required error={errors.faxNumber?.message}>
                  <input {...register('faxNumber', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Business Address" required error={errors.businessAddress?.message}>
                  <input {...register('businessAddress', { required: 'Required' })} className="form-input" />
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

          {/* Step 2: Admin Details */}
          {step === 2 && (
            <div>
              <p className="section-title">Admin Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Admin Name" required error={errors.adminName?.message}>
                  <input {...register('adminName', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Admin Email" required error={errors.adminEmail?.message}>
                  <input {...register('adminEmail', { required: 'Required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} className="form-input" type="email" />
                </FormField>
                <FormField label="Admin Mobile Number" required error={errors.adminMobileNumber?.message}>
                  <input {...register('adminMobileNumber', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid mobile' } })} className="form-input" placeholder="10-digit mobile" />
                </FormField>
              </div>
            </div>
          )}

          {/* Step 3: Bank Details */}
          {step === 3 && (
            <div>
              <p className="section-title">Bank Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Account Number" required error={errors.accountNumber?.message}>
                  <input {...register('accountNumber', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Bank Resolution" required error={errors.bankResolution?.message}>
                  <input {...register('bankResolution', { required: 'Required' })} className="form-input" />
                </FormField>
              </div>
            </div>
          )}

          {/* Step 4: Other Details */}
          {step === 4 && (
            <div>
              <p className="section-title">Other Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Entity ID" required error={errors.entityId?.message}>
                  <input {...register('entityId', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Affiliation Fee" required error={errors.affiliationFee?.message}>
                  <input {...register('affiliationFee', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Telephone Number">
                  <input {...register('telephoneNumber')} className="form-input" />
                </FormField>
                <FormField label="Agreement Start Date (MM/DD/YYYY)" required error={errors.agreementStartDate?.message}>
                  <input {...register('agreementStartDate', { required: 'Required' })} className="form-input" placeholder="MM/DD/YYYY" />
                </FormField>
                <FormField label="Agreement End Date (MM/DD/YYYY)" required error={errors.agreementEndDate?.message}>
                  <input {...register('agreementEndDate', { required: 'Required' })} className="form-input" placeholder="MM/DD/YYYY" />
                </FormField>
                <FormField label="Entity PAN Card" required error={errors.entityPanCard?.message}>
                  <input {...register('entityPanCard', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Authorized Signatory KYC" required error={errors.authorizedSignatoryKyc?.message}>
                  <input {...register('authorizedSignatoryKyc', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="Certificate of Incorporation PDF" required error={errors.certificateOfIncorporationDocumentPdf?.message}>
                  <input {...register('certificateOfIncorporationDocumentPdf', { required: 'Required' })} className="form-input" placeholder="PDF link" />
                </FormField>
                <FormField label="Incorporation Address" required error={errors.incorporationAddress?.message}>
                  <input {...register('incorporationAddress', { required: 'Required' })} className="form-input" />
                </FormField>
                <FormField label="First & Last Page Agreement" required error={errors.firstAndLastPageAgreement?.message}>
                  <input {...register('firstAndLastPageAgreement', { required: 'Required' })} className="form-input" placeholder="Document link" />
                </FormField>
                <FormField label="Terms & Conditions" required error={errors.termsAndConditions?.message}>
                  <input {...register('termsAndConditions', { required: 'Required' })} className="form-input" placeholder="Document link" />
                </FormField>
                <FormField label="Business Proposal" required error={errors.businessProposal?.message}>
                  <input {...register('businessProposal', { required: 'Required' })} className="form-input" />
                </FormField>
              </div>

              {/* Product Features */}
              <div className="mt-6">
                <p className="section-title">Product Features</p>
                <div className="flex flex-wrap gap-3">
                  {PRODUCT_FEATURES.map((feat) => {
                    const selected = selectedFeatures.some((f) => f.id === feat.id)
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition
                          ${selected
                            ? 'bg-nsdl-blue text-white border-nsdl-blue'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-nsdl-blue'}`}
                      >
                        {feat.featureName}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="btn-secondary disabled:opacity-40"
          >
            ← Previous
          </button>

          {step < SECTIONS.length - 1 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next →
            </button>
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
