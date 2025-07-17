import React from 'react';
import Image from 'next/image';
import { cn } from '../utils/cn';

interface WeatherIconProps extends React.HTMLAttributes<HTMLDivElement> {
  iconName?: string;
}

export default function WeatherIcon({ iconName, className, ...props }: WeatherIconProps) {
  // تجاهل القيم الفارغة
  if (!iconName) return null;

  // تنظيف قيمة الأيقونة (إزالة أي مسافات وجعل الحروف صغيرة)
  const cleanIconName = iconName.trim().toLowerCase();
  
  // التأكد من أن الأيقونة تنتهي بـ d أو n
  const validIcon = /^(\d{2}[d|n])$/.test(cleanIconName) ? cleanIconName : '01d';
  
  // تكوين رابط الصورة
  const iconUrl = `https://openweathermap.org/img/wn/${validIcon}@4x.png`;
  
  console.log('Using weather icon:', {
    original: iconName,
    cleaned: cleanIconName,
    valid: validIcon,
    url: iconUrl
  });

  return (
    <div {...props} className={cn('relative h-20 w-20', className)}>
      <Image
        width={100}
        height={100}
        alt={`Weather icon for ${validIcon}`}
        src={iconUrl}
        unoptimized
        className="absolute h-full w-full object-contain"
        priority
      />
    </div>
  );
}
