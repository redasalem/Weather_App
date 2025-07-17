import React from 'react';
import Container from './Container';
import WeatherIcon from './WeatherIcon';
import WeatherDetails, { WeatherDetailProps } from './WeatherDetials';
import { ConvertKalvintoslices } from '../utils/ConvertKalvintoslices';



export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;      // أيقونة الطقس
  date: string;             // التاريخ (مثلاً: 2025-07-16)
  day: string;              // اسم اليوم (مثلاً: Tuesday)
  temp: number;             // درجة الحرارة الحالية
  feels_like: number;       // درجة الحرارة المحسوسة
  temp_min: number;         // أقل درجة حرارة
  temp_max: number;         // أعلى درجة حرارة
  description: string;      // وصف الطقس (مثلاً: clear sky)
}
export default function ForecastWeatherDetails(props:ForecastWeatherDetailProps) {
  const {
   weatherIcon='02d',      // أيقونة الطقس
  date='19.09',      // التاريخ (مثلاً: 2025-07-16)
  day="tuesday",      // اسم اليوم (مثلاً: Tuesday)
  temp,      // درجة الحرارة الحالية
   feels_like,     // درجة الحرارة المحسوسة
  //   temp_min,      // أقل درجة حرارة
  //  temp_max,    // أعلى درجة حرارة
  description   // وصف الطقس (مثلاً: clear sky)
} = props;

  return (
    <Container className='gap-4'>
      {/* left */}
      <section className='flex gap-4 items-center px-4'>
        <div className='flex items-center justify-center gap-1'>
          <WeatherIcon 
          iconName={weatherIcon}/>
          <p>{date}</p>
          <p className='text-sm'>{day}</p>
        </div>
        {/* */}
        <div className='flex flex-col px-4 items-center'>
          <p className='text-xs space-x-1 whitespace-nowrap'>
          <p className='text-5xl'>{ConvertKalvintoslices(temp ?? 0)}°</p>
          <p>feels likes {ConvertKalvintoslices(feels_like ?? 0)}°</p>
          </p>
          <p className='capitalize'>{description}</p>
        </div>
        
      </section>
      {/* right */}
      <section className='overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
        <WeatherDetails {...props}/>

      </section>

    </Container>
  )
}