"use client"
// import Image from "next/image";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import Container from  '../components/Container';
import {ConvertKalvintoslices}  from '../utils/ConvertKalvintoslices';
import WeatherIcon from '../components/WeatherIcon';
import { getDayOrNightIcon } from "../utils/getDayorNighticon";
import { metersToKilometers } from "../utils/MetersTK";
import WeatherDetails from "../components/WeatherDetials";
import { formatWindSpeed } from "../utils/converwindspeed";
import ForecastWeatherDetails from "../components/ForecastWeatherDetails";
import { useAtom } from "jotai"
import { placeAtom } from "./atom";
import { useEffect } from "react";

// https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=167b3d7129c9ec82abe9b64babdcb6c8&cnt=56

export interface WeatherAPIResponse {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherItem[];
  city: CityInfo;
}

export interface WeatherItem {
  dt: number;
  main: MainInfo;
  weather: WeatherDescription[];
  clouds: { all: number };
  wind: WindInfo;
  visibility: number;
  pop: number;
  sys: { pod: string };
  dt_txt: string;
}

export interface MainInfo {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WindInfo {
  speed: number;
  deg: number;
  gust: number;
}

export interface CityInfo {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export default function Home() {
  const [place] = useAtom(placeAtom);
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const { data } = await axios.get<WeatherAPIResponse>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  });

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  // وظيفة مساعدة للتحقق من صحة التاريخ وتنسيقه
  const formatDate = (dateStr: string | undefined, formatStr: string, defaultValue: string = 'N/A') => {
    if (!dateStr) return defaultValue;
    try {
      const date = parseISO(dateStr);
      if (isNaN(date.getTime())) return defaultValue;
      return format(date, formatStr);
    } catch (err) {
      console.error('Error formatting date:', err);
      return defaultValue;
    }
  };

  // وظيفة مساعدة للتحقق من صحة التاريخ Unix timestamp
  const formatUnixTimestamp = (timestamp: number | undefined, formatStr: string, defaultValue: string = 'N/A') => {
    if (!timestamp) return defaultValue;
    try {
      const date = new Date(timestamp * 1000);
      if (isNaN(date.getTime())) return defaultValue;
      return format(date, formatStr);
    } catch (err) {
      console.error('Error formatting unix timestamp:', err);
      return defaultValue;
    }
  };

  if (isPending) return (
    <div className="flex items-center min-h-screen justify-center">
      <p className="animate-bounce text-xl text-red-500">loading....</p>
    </div>
  );

  if (error) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="text-xl text-red-500">Unable to fetch weather data. Please try again.</p>
      </div>
    );
  }

  if (!data || !firstData) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="text-xl text-red-500">No weather data available</p>
      </div>
    );
  }

 // استخراج التواريخ الفريدة من بيانات الطقس
const uniqueDates = [
  ...new Set(
    data?.list
      ?.filter((entry, i) => {
        const isValid = entry && typeof entry.dt === 'number' && !isNaN(entry.dt);
        if (!isValid) {
          console.warn("❌ عنصر غير صالح في list عند index:", i, entry);
        }
        return isValid;
      })
      ?.map((entry) => {
        try {
          const date = new Date(entry.dt * 1000);
          return date.toISOString().split("T")[0];
        } catch (error) {
          console.error("🚨 خطأ في تحويل dt لتاريخ:", entry.dt, error);
          return null;
        }
      })
      .filter(Boolean) // حذف العناصر الفارغة
  )
];

// اختيار أول عنصر بعد الساعة 6 صباحًا لكل تاريخ
const firstDataForEachDate = uniqueDates.map((date) => {
  return data?.list?.find((entry, i) => {
    if (!entry || typeof entry.dt !== 'number' || isNaN(entry.dt)) {
      console.warn("❌ عنصر غير صالح داخل البحث عند index:", i, entry);
      return false;
    }

    try {
      const entryDateObj = new Date(entry.dt * 1000);
      const entryDate = entryDateObj.toISOString().split("T")[0];
      const entryHour = entryDateObj.getHours();

      return entryDate === date && entryHour > 6;
    } catch (err) {
      console.error("🚨 خطأ أثناء تحويل التاريخ داخل البحث:", entry.dt, err);
      return false;
    }
  });
});


  return (
    <>
      <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
        <Navbar location={data?.city.name}/>
        <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
          {/* today data */}
          <section className="space-y-4">
            <div>
              <h2 className="flex gap-1 text-2xl items-end">
                <p>{formatDate(firstData?.dt_txt, 'EEEE')}</p>
                <p className="text-lg">
                  ({formatDate(firstData?.dt_txt, 'dd.MM.yyyy')})
                </p>
              </h2>
             <Container className="gap-10 px-6 items-center">
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                   {ConvertKalvintoslices(firstData?.main.temp ?? 298.69)}°
                </span>
                <p className="text-xs space-x-1 whitespace-normal">
                  <span>Feels likes</span>
                  <span>
                    {ConvertKalvintoslices(firstData?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                     {ConvertKalvintoslices(firstData?.main.temp_min ?? 0)}
                     °↓{""}
                  </span>
                  <span>
                     {ConvertKalvintoslices(firstData?.main.temp_max ?? 0)}
                     °↑{""}
                  </span>

                </p>
               
              </div>
              {/* time and weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d,i)=>(
                  <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                    <p className="whitespace-nowrap">
                      {formatDate(d.dt_txt, "h:mm a")}
                    </p>
                    <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon,d.dt_txt)}/>
                    <p>{ConvertKalvintoslices(d?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>


             </Container>

            </div>
            <div className="flex gap-4">
              {/* left */}
              <Container className="w-fit justify-center flex-col px-4  items-center">
                <p className="capitalize text-center">{firstData?.weather[0].description}</p>
                  <WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon ??'',firstData?.dt_txt ??'')}/>
              </Container>
              <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                <WeatherDetails 
                  visibility={metersToKilometers(firstData?.visibility ?? 10000)} 
                  airPressure={`${firstData?.main.pressure} hpa`}
                  humidity={`${firstData?.main.humidity}%`}
                  sunrise={formatUnixTimestamp(data?.city.sunrise, 'HH:mm')}
                  sunset={formatUnixTimestamp(data?.city.sunset, 'HH:mm')}
                  windSpeed={`${formatWindSpeed(firstData?.wind?.speed ?? 2.89)} km/h`}
                />
              </Container>
              {/* right */}

            </div>
          </section>
          {/* 7   day forcast data */}
          <section className="flex w-full flex-col gap-4">
            <p className="text-2xl">forcast(7 days)</p>
          {firstDataForEachDate.map((d, i) => (
            <ForecastWeatherDetails
              key={i}
              description={d?.weather[0]?.description ?? ""}
              weatherIcon={d?.weather[0]?.icon ?? "01d"}
              date={formatDate(d?.dt_txt, "dd.MM")}
              day={formatDate(d?.dt_txt, "EEEE")}
              feels_like={d?.main?.feels_like ?? 0}
              temp={d?.main?.temp ?? 0}
              temp_max={d?.main?.temp_max ?? 0}
              temp_min={d?.main?.temp_min ?? 0}
              airPressure={`${d?.main?.pressure} hPa`}
              humidity={`${d?.main?.humidity}%`}
              sunrise={formatUnixTimestamp(data?.city.sunrise, 'H:mm')}
              sunset={formatUnixTimestamp(data?.city.sunset, 'H:mm')}
              visibility={`${metersToKilometers(d?.visibility ?? 10000)}`}
              windSpeed={`${formatWindSpeed(d?.wind?.speed ?? 1.64)}`}
            />
          ))}
            

          </section>
        </main>

      </div>
    </>
  );
}
