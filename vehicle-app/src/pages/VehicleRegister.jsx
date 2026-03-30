import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Car, User, FileText, CheckCircle, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

import { vehicleInfoSchema, ownerSchema, registrationSchema } from '../schemas/vehicleSchema';
import { createVehicle } from '../services/api';
import InputField  from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';

const STEPS = [
  { label: 'Vehicle Info',             icon: Car,      schema: vehicleInfoSchema },
  { label: 'Owner Info',               icon: User,     schema: ownerSchema },
  { label: 'Registration & Insurance', icon: FileText, schema: registrationSchema },
];

export default function VehicleRegister() {
  const [step, setStep]                 = useState(0);
  const [formData, setFormData]         = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(STEPS[step].schema),
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      toast.success('Vehicle registered successfully!');
      navigate('/dashboard');
    },
    onError: (err) => {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setServerErrors(data.errors);
        toast.error(data.errors.length + ' validation error(s) from server');
      } else if (data?.message) {
        setServerErrors([data.message]);
        toast.error(data.message);
      } else {
        setServerErrors(['Something went wrong. Please try again.']);
        toast.error('Submission failed');
      }
      console.log('Payload sent:', err.config?.data);
    },
  });

  const onStepSubmit = (data) => {
    setServerErrors([]);
    const updated = { ...formData, ...data };
    if (step < STEPS.length - 1) {
      setFormData(updated);
      setStep(function(s) { return s + 1; });
    } else {
      console.log('Submitting:', updated);
      mutation.mutate(updated);
    }
  };

  const StepIcon = STEPS[step].icon;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '780px', margin: '0 auto' }}>

      {/* Step indicators */}
      <div className="fade-up" style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
        {STEPS.map(function(s, i) {
          const Icon = s.icon;
          const done   = i < step;
          const active = i === step;
          return (
            <div key={s.label} style={{ flex: 1 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 16px', borderRadius: '12px',
                background: active ? 'var(--accent-soft)' : done ? 'rgba(16,185,129,0.08)' : 'var(--card)',
                border: '1px solid ' + (active ? 'var(--accent)' : done ? 'rgba(16,185,129,0.3)' : 'var(--border)'),
                transition: 'all 0.3s',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                  background: active ? 'var(--accent)' : done ? 'rgba(16,185,129,0.2)' : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {done
                    ? <CheckCircle size={16} color="#10B981" />
                    : <Icon size={15} color={active ? 'white' : 'var(--text-muted)'} />
                  }
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'Syne' }}>
                    Step {i + 1}
                  </p>
                  <p style={{
                    fontSize: '13px', fontWeight: 600, fontFamily: 'Syne',
                    color: active ? 'var(--accent)' : done ? '#10B981' : 'var(--text-secondary)',
                  }}>
                    {s.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Server errors */}
      {serverErrors.length > 0 && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '12px', padding: '16px 20px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertCircle size={16} color="var(--danger)" />
            <span style={{ color: 'var(--danger)', fontFamily: 'Syne', fontWeight: 700, fontSize: '13px' }}>
              Server validation errors
            </span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {serverErrors.map(function(e, i) {
              return (
                <li key={i} style={{ color: 'var(--danger)', fontSize: '13px' }}>
                  {'-> '}{e}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Form card */}
      <div className="card fade-up" style={{ padding: '32px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <StepIcon size={18} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Syne', fontSize: '20px', fontWeight: 700 }}>
              {STEPS[step].label}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Step {step + 1} of {STEPS.length}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onStepSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>

            {/* STEP 0 - Vehicle Info */}
            {step === 0 && (
              <>
                <InputField label="Manufacturer"         registration={register('manufacture')}    error={errors.manufacture}    placeholder="e.g. Toyota" />
                <InputField label="Model"                registration={register('model')}           error={errors.model}           placeholder="e.g. Corolla" />
                <InputField label="Body Type"            registration={register('bodyType')}        error={errors.bodyType}        placeholder="e.g. Sedan" />
                <InputField label="Color"                registration={register('color')}           error={errors.color}           placeholder="e.g. White" />
                <InputField label="Year"                 registration={register('year')}            error={errors.year}            type="number" placeholder="e.g. 2022" />
                <InputField label="Engine Capacity (cc)" registration={register('engineCapacity')}  error={errors.engineCapacity}  type="number" placeholder="e.g. 1800" />
                <InputField label="Odometer (km)"        registration={register('odometerReading')} error={errors.odometerReading} type="number" placeholder="e.g. 45000" />
                <InputField label="Seating Capacity"     registration={register('seatingCapacity')} error={errors.seatingCapacity} type="number" placeholder="e.g. 5" />
                <SelectField label="Vehicle Type"        registration={register('vehicleType')}     error={errors.vehicleType}
                  options={['ELECTRIC','SUV','TRUCK','MOTORCYCLE','BUS','VAN','PICKUP','OTHER']} />
                <SelectField label="Fuel Type"           registration={register('fuelType')}        error={errors.fuelType}
                  options={['PETROL','DIESEL','ELECTRIC','HYBRID','GAS','OTHER']} />
                <SelectField label="Purpose"             registration={register('vehiclePurpose')}  error={errors.vehiclePurpose}
                  options={['PERSONAL','COMMERCIAL','TAXI','GOVERNMENT']} />
                <SelectField label="Vehicle Status"      registration={register('vehicleStatus')}   error={errors.vehicleStatus}
                  options={['NEW','USED','REBUILT']} />
              </>
            )}

            {/* STEP 1 - Owner Info */}
            {step === 1 && (
              <>
                <InputField label="Owner Full Name"         registration={register('ownerName')}        error={errors.ownerName}        placeholder="e.g. John Doe" />
                <SelectField label="Owner Type"             registration={register('ownerType')}        error={errors.ownerType}
                  options={['INDIVIDUAL','COMPANY','NGO','GOVERNMENT']} />
                <div style={{ gridColumn: '1/-1' }}>
                  <InputField label="Address"               registration={register('address')}          error={errors.address}          placeholder="Full address" />
                </div>
                <InputField label="National ID"             registration={register('nationalId')}       error={errors.nationalId}       placeholder="16 digits" hint="Exactly 16 digits" />
                <InputField label="Mobile Number"           registration={register('mobile')}           error={errors.mobile}           placeholder="10 digits" hint="Exactly 10 digits" />
                <InputField label="Email Address"           registration={register('email')}            error={errors.email}            type="email" placeholder="owner@email.com" />
                <InputField label="Company Reg No."         registration={register('companyRegNumber')} error={errors.companyRegNumber} placeholder="Required if COMPANY" />
                <InputField label="Passport No. (optional)" registration={register('passportNumber')}   error={errors.passportNumber}   placeholder="Optional" />
              </>
            )}

            {/* STEP 2 - Registration & Insurance */}
            {step === 2 && (
              <>
                <InputField label="Plate Number"          registration={register('plateNumber')}         error={errors.plateNumber}         placeholder="e.g. RAB 123A" hint="Rwandan plate format" />
                <SelectField label="Plate Type"           registration={register('plateType')}           error={errors.plateType}
                  options={['PRIVATE','COMMERCIAL','GOVERNMENT','DIPLOMATIC','PERSONALIZED']} />
                <InputField label="Registration Date"     registration={register('registrationDate')}    error={errors.registrationDate}    type="date" />
                <InputField label="Expiry Date"           registration={register('expiryDate')}          error={errors.expiryDate}          type="date" />
                <SelectField label="Registration Status"  registration={register('registrationStatus')}  error={errors.registrationStatus}
                  options={['ACTIVE','SUSPENDED','EXPIRED','PENDING']} />
                <InputField label="Customs Reference"     registration={register('customsRef')}          error={errors.customsRef}          placeholder="e.g. CUS-RW-2023-11223" />
                <InputField label="Proof of Ownership"    registration={register('proofOfOwnership')}    error={errors.proofOfOwnership}    placeholder="e.g. LOG-BOOK-2024-XYZ" />
                <InputField label="Roadworthy Cert"       registration={register('roadworthyCert')}      error={errors.roadworthyCert}      placeholder="e.g. RWC-2024-78901" />
                <InputField label="Policy Number"         registration={register('policyNumber')}        error={errors.policyNumber}        placeholder="e.g. POL-2024-00456" />
                <InputField label="Insurance Company"     registration={register('companyName')}         error={errors.companyName}         placeholder="e.g. SORAS" />
                <InputField label="Insurance Type"        registration={register('insuranceType')}       error={errors.insuranceType}       placeholder="e.g. Comprehensive" />
                <InputField label="Insurance Expiry Date" registration={register('insuranceExpiryDate')} error={errors.insuranceExpiryDate} type="date" />
                <SelectField label="Insurance Status"     registration={register('insuranceStatus')}     error={errors.insuranceStatus}
                  options={['ACTIVE','SUSPENDED','EXPIRED']} />
                <InputField label="State"                 registration={register('state')}               error={errors.state}               placeholder="e.g. Kigali" />
              </>
            )}

          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)',
          }}>
            {step > 0 ? (
              <button
                type="button"
                onClick={function() { setStep(function(s) { return s - 1; }); }}
                className="btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {step < STEPS.length - 1 ? (
                <>Next Step <ArrowRight size={14} /></>
              ) : mutation.isPending ? (
                'Submitting...'
              ) : (
                <>Register Vehicle <CheckCircle size={14} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}