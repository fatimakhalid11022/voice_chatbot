import React from "react";
import { RiRobot2Fill } from "react-icons/ri";

interface LogoProps {
    onClear: () => void;
  }
  
  

const Logo: React.FC<LogoProps> = ({ onClear }) => {
    
return(
    <div className="container mx-auto flex justify-between rounded-t-3xl p-4 border-b-2 w-2/3 bg-slate-50">
        <h1 className="flex">
            <div className="mx-2 mt-1">
            <RiRobot2Fill/>
            </div>
            <div className="font-bold">
            Bot Tester
            </div>
              
            
        </h1>
        <button onClick={onClear} className="text-gray-400 mr-3 hover:text-gray-600">
        Clear
      </button>
    </div>
)
}

export default Logo