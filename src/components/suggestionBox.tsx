import React from 'react'

interface SearchBoxProps {
     showsuggestions:boolean;
    suggestions:string[];
    handlesuggestionClick:(item:string)=>void;
    erorr:string;
}
export default function SuggestionBox({
    showsuggestions,
    suggestions,
    handlesuggestionClick,
    erorr
}:SearchBoxProps)
{
    return(
         <>
     {((showsuggestions && suggestions.length) || erorr) && (
     <ul className='mb-4 bg-white absolute border top-[44px]  left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2'>
        {erorr && suggestions.length<1 && <li className='text-red-500 p-1'>{erorr}</li>}
        {suggestions.map((item,i) =>{
        return  <li 
        onClick={()=>handlesuggestionClick(item)}
        key={i} className='cursor-pointer p-1 rounded hover:bg-gray-200'>{item}</li>
        })}
    </ul>
         )}

          </>
    

    );
   
    
}
