import {
  validateName,
  validatePakistaniPhone,
  validateEmail,
  validateAddress,
  validateFutureDate,
  validateTimeSlot,
  validateRequired,
  hasErrors,
  type FieldError,
} from '@/lib/validation';

export type MultiStepFormData = {
  name: string;
  phone: string;
  email: string;
  orderType: 'cake' | 'cupcakes';
  flavour: string;
  size: string;
  cupcakeSize: string;
  shape: string;
  theme: string;
  colorPreferences: string;
  addOns: string[];
  messageOnCake: string;
  referenceImage: File | null;
  specialInstructions: string;
  deliveryType: 'delivery' | 'pickup';
  address: string;
  date: string;
  timeSlot: string;
  termsAccepted: boolean;
};

export function validateMultiStepStep(
  step: number,
  data: MultiStepFormData
): Record<string, FieldError> {
  switch (step) {
    case 1:
      return {
        name: validateName(data.name, 'Name'),
        phone: validatePakistaniPhone(data.phone),
        email: validateEmail(data.email, false),
      };
    case 2:
      return {};
    case 3:
      return {
        flavour: validateRequired(data.flavour, 'Flavour'),
      };
    case 4:
      return {};
    case 5:
      return {
        address:
          data.deliveryType === 'delivery' ? validateAddress(data.address) : undefined,
        date: validateFutureDate(data.date),
        timeSlot: validateTimeSlot(data.timeSlot),
      };
    case 6:
      return {
        termsAccepted: data.termsAccepted
          ? undefined
          : 'You must accept the Terms & Conditions',
      };
    default:
      return {};
  }
}

export function validateEntireMultiStepForm(
  data: MultiStepFormData
): Record<string, FieldError> {
  const merged: Record<string, FieldError> = {};
  for (let s = 1; s <= 6; s++) {
    Object.assign(merged, validateMultiStepStep(s, data));
  }
  return merged;
}

export function stepIsValid(step: number, data: MultiStepFormData): boolean {
  return !hasErrors(validateMultiStepStep(step, data));
}
