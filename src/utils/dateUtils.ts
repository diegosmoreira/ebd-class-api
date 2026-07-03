/**
 * Extracts exactly 13 Sundays (Domingos) starting from the given start date.
 * If the period doesn't have 13 Sundays, it will throw an error or handle accordingly.
 */
export function get13Sundays(startDate: Date, endDate: Date): Date[] {
  const sundays: Date[] = [];
  
  // Clone to avoid mutation
  let current = new Date(startDate);
  
  // Find the first Sunday
  while (current.getDay() !== 0) {
    current.setDate(current.getDate() + 1);
  }

  // Collect Sundays until endDate
  while (current <= endDate && sundays.length < 13) {
    sundays.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  if (sundays.length !== 13) {
    throw new Error(`O período informado contém ${sundays.length} domingos. São necessários exatamente 13 domingos para um trimestre válido.`);
  }

  return sundays;
}
