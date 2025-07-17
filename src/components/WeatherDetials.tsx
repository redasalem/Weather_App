import React from 'react'
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { ImMeter } from "react-icons/im";
// import SingleWeatherDetail from "../SingleWeatherDetail";

export interface WeatherDetailProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
  const { 
    visibility='25km',
     humidity='61%',
     windSpeed='7km/h',
    airPressure='1012 hPa',
     sunrise='6.20',
     sunset ='18.48'
  } = props;
 
  return <>
  <SingleWeatherDetials
  information='visibility'
  icon={<LuEye/>}
  value={ visibility} />

  <SingleWeatherDetials
  information='humidity'
  icon={<FiDroplet/>}
  value={humidity} />

   <SingleWeatherDetials
  information='windSpeed'
  icon={<MdAir/>}
  value={windSpeed} />

   <SingleWeatherDetials
  information='airPressure'
  icon={<ImMeter/>}
  value={airPressure} />

  <SingleWeatherDetials
  information='sunrise'
  icon={<LuSunrise/>}
  value={ sunrise} />

  <SingleWeatherDetials
  information='sunset'
  icon={<LuSunset/>}
  value={ sunset} />


  </>

}

export interface SingleWeatherDetialsProps{
    information:string;
    icon:React.ReactNode;
    value:string;
}

function SingleWeatherDetials({ information,icon,value}:SingleWeatherDetialsProps){
    return(
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className='whitespace-nowrap'>{information}</p>
            <div className='text-3xl'>{icon}</div>
            <p>{value}</p>


        </div>
    )


}