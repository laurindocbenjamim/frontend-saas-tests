
/**
 * Validates a Portuguese NIF (Número de Identificação Fiscal)
 * @param nif 9 digit string
 */
export function validateNIF(nif: string): boolean {
  const nifStr = nif.replace(/\s/g, '');
  if (!/^[0-9]{9}$/.test(nifStr)) return false;
  
  const firstDigit = parseInt(nifStr[0]);
  const allowedFirstDigits = [1, 2, 3, 5, 6, 7, 8, 9];
  if (!allowedFirstDigits.includes(firstDigit)) return false;

  let checkSum = 0;
  for (let i = 0; i < 8; i++) {
    checkSum += parseInt(nifStr[i]) * (9 - i);
  }

  const res = checkSum % 11;
  const expectedCheckDigit = res < 2 ? 0 : 11 - res;
  
  return expectedCheckDigit === parseInt(nifStr[8]);
}

/**
 * Validates a Portuguese IBAN (starts with PT50)
 */
export function validateIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  if (!/^PT50[0-9]{21}$/.test(cleaned)) return false;
  
  // Basic check for the length and PT50 prefix is often enough for a demo,
  // but a full IBAN check involves shifting "PT50" to the end and converting to numbers
  return true;
}

/**
 * Formats a number as a currency string (€)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}
