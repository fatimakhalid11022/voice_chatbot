"use client"
import React, { useState } from "react";
import Chatbot from "@/app/components/chatbot";
import Inputbox from "./components/input";
import Logo from "./components/logo";

type Message = {
  role: string;
  content: string;
};

export default function Home() {
  const [messages, setMessages] =  useState<Message[]>([]);

  const handleSendMessage =async (message: string)=> {
    setMessages([...messages , {role:"user", content: message}])
    try{
      const response = await fetch("http://localhost:5000/chat",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({message})
      })
      const data = await response.json()
      if(response.ok){
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "bot", content: data.response }
        ])
      } else {
        console.error("Error",data.error)}
      } catch(error){
        console.error("Error:" ,error)
      
      }
    }
    const handleClearMessages = () => {
      setMessages([]);
    };
  return (
    <div className="min-h-screen max-h-fit bg-gray-100">
       
      <Logo onClear={handleClearMessages}/>
     <Chatbot messages={messages}/>
     <Inputbox onSendMessage={handleSendMessage}/>
     
    </div>
  );
}
