import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const vehicleInfoSchema = z.object({
  manufacture:     z.string().min(1, 'Manufacturer is required').trim(),
  model:           z.string().min(1, 'Model is required').trim(),
  bodyType:        z.string().min(1, 'Body type is required').trim(),
  color:           z.string().min(1, 'Color is required').trim(),
  year:            z.coerce.number().int()
                     .min(1886, 'Year must be 1886 or later')
                     .max(currentYear + 1, `Max year is ${currentYear + 1}`),
  engineCapacity:  z.coerce.number().int().positive('Must be greater than 0'),
  odometerReading: z.coerce.number().int().min(0, 'Cannot be negative'),
  seatingCapacity: z.coerce.number().int().min(1, 'Minimum 1 seat'),
  vehicleType:     z.enum(['ELECTRIC','SUV','TRUCK','MOTORCYCLE','BUS','VAN','PICKUP','OTHER'],
                     { errorMap: () => ({ message: 'Select a vehicle type' }) }),
  fuelType:        z.enum(['PETROL','DIESEL','ELECTRIC','HYBRID','GAS','OTHER'],
                     { errorMap: () => ({ message: 'Select a fuel type' }) }),
  purpose:         z.enum(['PERSONAL','COMMERCIAL','TAXI','GOVERNMENT'],
                     { errorMap: () => ({ message: 'Select a purpose' }) }),
  status:          z.enum(['NEW','USED','REBUILT'],
                     { errorMap: () => ({ message: 'Select a status' }) }),
});

export const ownerSchema = z.object({
  ownerName:        z.string().min(1, 'Owner name is required').trim(),
  ownerType:        z.enum(['INDIVIDUAL','COMPANY','NGO','GOVERNMENT'],
                      { errorMap: () => ({ message: 'Select owner type' }) }),
  address:          z.string().min(1, 'Address is required').trim(),
  nationalId:       z.string().regex(/^\d{16}$/, 'Must be exactly 16 digits'),
  mobile:           z.string().regex(/^\d{10}$/, 'Must be exactly 10 digits'),
  email:            z.string().email('Invalid email address'),
  companyRegNumber: z.string().optional(),
  passportNumber:   z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.ownerType === 'COMPANY' && !data.companyRegNumber?.trim()) {
    ctx.addIssue({
      path: ['companyRegNumber'],
      code: z.ZodIssueCode.custom,
      message: 'Required for COMPANY owner type',
    });
  }
});

export const registrationSchema = z.object({
  plateNumber:          z.string().regex(/^(R[A-Z]{2}|GR|CD)\s?\d{3}\s?[A-Z]?$/i, 'Invalid Rwandan plate (e.g. RAB 123A)'),
  plateType:            z.enum(['PRIVATE','COMMERCIAL','GOVERNMENT','DIPLOMATIC','PERSONALIZED'],
                          { errorMap: () => ({ message: 'Select plate type' }) }),
  registrationDate:     z.string().min(1, 'Registration date required'),
  expiryDate:           z.string().min(1, 'Expiry date required'),
  registrationStatus:   z.enum(['ACTIVE','SUSPENDED','EXPIRED','PENDING'],
                          { errorMap: () => ({ message: 'Select status' }) }),
  customsRef:           z.string().min(1, 'Customs reference required'),
  proofOfOwnership:     z.string().min(1, 'Proof of ownership required'),
  roadworthyCert:       z.string().min(1, 'Roadworthy certificate required'),
  policyNumber:         z.string().min(1, 'Policy number required'),
  companyName:          z.string().min(1, 'Insurance company required'),
  insuranceType:        z.string().min(1, 'Insurance type required'),
  insuranceExpiryDate:  z.string().min(1, 'Insurance expiry required'),
  insuranceStatus:      z.enum(['ACTIVE','SUSPENDED','EXPIRED'],
                          { errorMap: () => ({ message: 'Select insurance status' }) }),
  state:                z.string().min(1, 'State is required'),
}).superRefine((data, ctx) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (data.expiryDate && new Date(data.expiryDate) < today) {
    ctx.addIssue({ path: ['expiryDate'], code: z.ZodIssueCode.custom, message: 'Cannot be in the past' });
  }
  if (data.insuranceExpiryDate && new Date(data.insuranceExpiryDate) < today) {
    ctx.addIssue({ path: ['insuranceExpiryDate'], code: z.ZodIssueCode.custom, message: 'Cannot be in the past' });
  }
});