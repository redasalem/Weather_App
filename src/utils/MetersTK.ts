// utils/visibility.ts (مثال لو حابب تفصله في ملف)
export function metersToKilometers(visibilityInMeters: number): string {
  const visibilityInKilometers = visibilityInMeters / 1000;
  return `${visibilityInKilometers.toFixed(0)}km`; // تقريب لأقرب رقم صحيح
}
