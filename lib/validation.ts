export type FieldError = string | undefined;

/** Trim and collapse multiple spaces. */
export function trimValue(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizePhoneDigits(input: string): string {
  let digits = input.replace(/[\s\-().]/g, '').trim();
  if (digits.startsWith('+92')) digits = `0${digits.slice(3)}`;
  else if (digits.startsWith('92') && digits.length >= 12) digits = `0${digits.slice(2)}`;
  return digits;
}

/** Pakistani mobile (03XX…) or national landline (0XX…). */
export function isValidPakistaniPhone(input: string): boolean {
  const digits = normalizePhoneDigits(input);
  if (!digits) return false;
  if (/^03[0-9]{9}$/.test(digits)) return true;
  if (/^0[2-9][0-9]{8,9}$/.test(digits)) return true;
  return false;
}

export function validateRequired(value: string, label = 'This field'): FieldError {
  if (!trimValue(value)) return `${label} is required`;
}

export function validateName(value: string, label = 'Name'): FieldError {
  const trimmed = trimValue(value);
  if (!trimmed) return `${label} is required`;
  if (trimmed.length < 2) return `${label} must be at least 2 characters`;
  if (/\d/.test(trimmed)) return `${label} cannot contain numbers`;
  if (!/^[a-zA-Z\s'.-]+$/.test(trimmed)) {
    return `${label} can only contain letters, spaces, hyphens, and apostrophes`;
  }
}

export function validateEmail(value: string, required = false): FieldError {
  const trimmed = trimValue(value);
  if (!trimmed) return required ? 'Email is required' : undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
    return 'Enter a valid email address';
  }
}

export function validatePakistaniPhone(value: string): FieldError {
  const trimmed = trimValue(value);
  if (!trimmed) return 'Phone number is required';
  if (!isValidPakistaniPhone(trimmed)) {
    return 'Enter a valid Pakistani number (e.g. 0300 1234567 or +92 300 1234567)';
  }
}

export function validatePassword(value: string, label = 'Password'): FieldError {
  if (!value) return `${label} is required`;
  if (value.length < 6) return `${label} must be at least 6 characters`;
}

export function validateAddress(value: string): FieldError {
  const trimmed = trimValue(value);
  if (!trimmed) return 'Address is required';
  if (trimmed.length < 10) return 'Please enter a complete delivery address';
}

export function validateMessage(value: string, minLength = 10): FieldError {
  const trimmed = trimValue(value);
  if (!trimmed) return 'Message is required';
  if (trimmed.length < minLength) return `Message must be at least ${minLength} characters`;
}

export function validateFutureDate(value: string, minHoursAhead = 48): FieldError {
  if (!value) return 'Date is required';
  const selected = new Date(`${value}T12:00:00`);
  const minDate = new Date(Date.now() + minHoursAhead * 60 * 60 * 1000);
  minDate.setHours(0, 0, 0, 0);
  if (selected < minDate) {
    return `Please choose a date at least ${minHoursAhead} hours from now`;
  }
}

export function validateTimeSlot(value: string): FieldError {
  if (!value) return 'Please select a time slot';
}

export function validatePositiveNumber(value: number, label = 'Price'): FieldError {
  if (Number.isNaN(value) || value <= 0) return `${label} must be greater than 0`;
}

export function validateItemName(value: string, label = 'Name'): FieldError {
  const trimmed = trimValue(value);
  if (!trimmed) return `${label} is required`;
  if (trimmed.length < 2) return `${label} must be at least 2 characters`;
}

export function validateProductSizes(
  sizes: { size_label: string; price: number }[]
): FieldError {
  for (const s of sizes) {
    if (!trimValue(s.size_label)) return 'Each size must have a label';
    const priceErr = validatePositiveNumber(s.price, 'Price');
    if (priceErr) return priceErr;
  }
}

export function hasErrors(errors: Record<string, FieldError>): boolean {
  return Object.values(errors).some(Boolean);
}
