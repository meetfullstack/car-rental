export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { id: "letter", label: "At least one letter", test: (v) => /[a-zA-Z]/.test(v) },
  { id: "number", label: "At least one number", test: (v) => /\d/.test(v) },
];

export function passwordErrors(value: string): string[] {
  return passwordRules.filter((rule) => !rule.test(value)).map((rule) => rule.label);
}

export function isPasswordValid(value: string): boolean {
  return passwordRules.every((rule) => rule.test(value));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidName(value: string): boolean {
  return value.trim().length >= 2;
}

// North American phone: accepts common separators, requires 10 digits.
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export function isValidCardNumber(value: string): boolean {
  const digits = value.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(digits)) return false;
  return luhnCheck(digits);
}

function luhnCheck(digits: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function isValidExpiry(value: string): boolean {
  const match = value.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiry = new Date(year, month, 0, 23, 59, 59);
  return expiry >= now;
}

export function isValidCvc(value: string): boolean {
  return /^\d{3,4}$/.test(value);
}

export function isValidMessage(value: string, minLength = 10): boolean {
  return value.trim().length >= minLength;
}
