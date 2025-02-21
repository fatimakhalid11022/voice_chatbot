import React, { useEffect, useRef } from "react";
import { RiRobot2Fill } from "react-icons/ri";
 
type Message = {
    role: string;
    content: string;
};


interface ChatbotProps {
    messages: Message[]
}

const Chatbot:React.FC<ChatbotProps> = ({ messages }) => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [messages]);
return(
    <div 
    ref={chatContainerRef}
    className="container mx-auto p-4 h-[450px] w-2/3 bg-slate-50 min-h-fit overflow-y-auto shadow-md">
        {messages.map((message, index) => (
            <div key={index} className= {message.role === "user"? "text-right" : "text-left"}>
               <div className="grid justify-start">
                {message.role === "bot" && <RiRobot2Fill className="mr-2 " />}
                </div>
             <p className={message.role === "user" ? "border mb-3 inline-block bg-blue-800 p-2 text-white rounded-lg" : "bg-gray-200 p-2 mb-3 rounded-lg inline-block"}>
                            {message.content}
            </p>
            </div>     
       
        ) )}
        </div>
)
}

export default Chatbot