"use client"
import React, { useState, useEffect } from 'react'
// react icons
import { MdWbSunny } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdOutlineLocationOn } from "react-icons/md";
import SearchBox from './SearchBox';
import axios from 'axios';
import SuggestionBox from './suggestionBox';
import { useSetAtom } from "jotai"
import { placeAtom } from "../app/atom";

type Props = {location?:string};

const APIKEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({location}:Props) {
    const [city,setcity] = useState('');
    const [erorr, setErorr] = useState('');
    const [suggestions, setsuggestions] = useState<string[]>([]);
    const [showsuggestions, setshowsuggestions] = useState(false);
    const setPlace = useSetAtom(placeAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setcity('Paris');
        setPlace('Paris');
    }, [setPlace]);

    async function handleInputChange(value:string){
        setcity(value)
        if(value.length>= 3){
            try{
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=${APIKEY}&cnt=56`);
                const suggestions = response.data.list.map((item: { name: string })=>item.name);
                setsuggestions(suggestions);
                setErorr('');
                setshowsuggestions(true)
            }
            catch{
                setsuggestions([]);
                setshowsuggestions(false)
            }
        }
        else{
            setsuggestions([]);
            setshowsuggestions(false)
        }
    }
    function handlesuggestionClick(value:string){
        setcity(value);
        setshowsuggestions(false);
    }
    async function handleSbmitSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!city) {
            setErorr('Please enter a location');
            return;
        }

        try {
            // التحقق من صحة المدينة مباشرة من API
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`
            );
            
            if (response.data) {
                setErorr('');
                setPlace(city);
                setshowsuggestions(false);
            }
        } catch (error) {
            console.error('Error validating city:', error);
            setErorr('Location not found');
        }
    }

    // دالة للحصول على الموقع الحالي
    const handleCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        // استخدام Nominatim للحصول على معلومات الموقع بشكل أكثر دقة
                        const response = await axios.get(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
                            {
                                headers: {
                                    'Accept-Language': 'en' // للحصول على النتائج باللغة الإنجليزية
                                }
                            }
                        );
                        
                        // محاولة العثور على المدينة أو المنطقة الأقرب
                        const address = response.data.address;
                        const cityName = address.city || address.town || address.suburb || address.county || address.state;
                        setcity(cityName);
                        setPlace(cityName);
                        setErorr('');
                    } catch (err) {
                        setErorr('Error fetching location');
                        console.error('Error fetching location:', err);
                    } finally {
                        setLoading(false);
                    }
                },
                (err) => {
                    setErorr('Location access denied');
                    console.error('Geolocation error:', err);
                    setLoading(false);
                }
            );
        } else {
            setErorr('Geolocation is not supported');
            setLoading(false);
        }
    };

  return (
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
        <div className='h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
            <div className='flex items-center gap-1 sm:gap-2'>
                <h2 className='text-gray-500 text-2xl sm:text-3xl'>Weather</h2>
                <MdWbSunny className='text-2xl sm:text-3xl mt-1 text-yellow-300' />
            </div>
            {/* -------- */}
            <section className='flex gap-1 sm:gap-2 items-center'>
                <button 
                    onClick={handleCurrentLocation}
                    className='relative shrink-0'
                    disabled={loading}
                >
                    <FaLocationCrosshairs 
                        className={`text-xl sm:text-2xl ${loading ? 'text-gray-300' : 'text-gray-400 hover:opacity-80'} cursor-pointer`}
                    />
                    {loading && (
                        <span className='absolute top-1 -right-1 h-3 w-3'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75'></span>
                            <span className='relative inline-flex rounded-full h-3 w-3 bg-gray-500'></span>
                        </span>
                    )}
                </button>
                <MdOutlineLocationOn className='text-2xl sm:text-3xl shrink-0' />
                <span className='text-slate-900/80 text-xs sm:text-sm hidden xs:block'>{location}</span>
                <div className='relative w-full max-w-[300px]'>
                    {/* searchbox */}
                    <SearchBox
                    value={city}
                    onSubmit={handleSbmitSearch}
                    onChange={(e)=>{handleInputChange(e.target.value)}}
                    />
                    <SuggestionBox 
                     showsuggestions={showsuggestions}
                     suggestions={suggestions}
                     handlesuggestionClick={handlesuggestionClick}
                     erorr={erorr}
                     />

                </div>

            </section>
        </div>
        </nav>
  )
};




