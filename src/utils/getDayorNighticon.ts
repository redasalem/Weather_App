export function getDayOrNightIcon(
  iconName: string,
  dateTimeString: string
): string {
  // تحقق من صحة قيمة الأيقونة
  if (!iconName) return '01d'; // القيمة الافتراضية

  // استخراج رمز الطقس (أول رقمين)
  const weatherCode = iconName.slice(0, 2);
  
  // تحديد الوقت (نهار أم ليل)
  const hours = new Date(dateTimeString).getHours();
  const isDayTime = hours >= 6 && hours < 18;

  console.log('Icon Processing:', {
    original: iconName,
    weatherCode,
    hour: hours,
    isDayTime
  });

  // إرجاع الرمز مع d للنهار و n لليل
  return `${weatherCode}${isDayTime ? 'd' : 'n'}`;
}
