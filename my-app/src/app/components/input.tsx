// import React from "react";
// import { useState } from "react"

// interface SendMessageProps {
//   onSendMessage: (message: string) => void;
// }

// const Inputbox: React.FC<SendMessageProps> = ({onSendMessage}) => {
//     const [ input,setInput ] = useState("")
 
// const handleSendMessage = () => {
//   if (input.trim() !== ""){
//     onSendMessage(input)
//     setInput("")
//   }
// }

// const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) =>{
//   if (event.key === "Enter"){
//     handleSendMessage()
//   }
// }
// return(
// <div className="container mx-[214px] bg-slate-50 h-12 rounded-b-2xl w-2/3">
//      <input
//       value={input}
//       onChange={(e) => setInput(e.target.value)}
//       onKeyDown={handleKeyDown}
//       placeholder="Text Anything.."
//       className="w-[92%] h-9 p-4  bg-slate-50 border-[1px] border-blue-300"/>
     
//      <button
//       type="button" 
//       onClick={handleSendMessage}
//       className="bg-blue-800  rounded-sm text-slate-50 font-medium py-2 px-3 ">
//         Send
        
       
//       </button>
     
//     </div>
// )
// }

// export default Inputbox

// import React, { useState, useRef } from 'react';
// import { MdOutlineSettingsVoice } from "react-icons/md";
// import { FaCirclePlus } from "react-icons/fa6";

// interface SendMessageProps {
//   onSendMessage: (message: string) => void;
// }

// const ChatInterface: React.FC<SendMessageProps> = ({ onSendMessage }) => {
//   // State for recording functionality
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [transcription, setTranscription] = useState<string>('');
//   const mediaRecorder = useRef<MediaRecorder | null>(null);
//   const audioChunks = useRef<Blob[]>([]);

//   // State for input box functionality
//   const [input, setInput] = useState<string>('');

//   // Handle recording button click
//   const handleRecordButtonClick = async () => {
//     if (!isRecording) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         mediaRecorder.current = new MediaRecorder(stream);

//         mediaRecorder.current.ondataavailable = (event) => {
//           audioChunks.current.push(event.data);
//         };

//         mediaRecorder.current.onstop = async () => {
//           const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
//           const formData = new FormData();
//           formData.append('audio', audioBlob, 'recording.webm');

//           try {
//             const response = await fetch('http://localhost:5000/transcribe', {
//               method: 'POST',
//               body: formData,
//             });
//             const result = await response.json();
//             setTranscription(result.text);
//             setInput(result.text); // Automatically populate the input box with the transcription
//           } catch (error) {
//             console.error('Error:', error);
//           }

//           audioChunks.current = [];
//           stream.getTracks().forEach(track => track.stop());
//         };

//         mediaRecorder.current.start();
//         setIsRecording(true);
//       } catch (err) {
//         console.error('Error accessing microphone:', err);
//       }
//     } else {
//       mediaRecorder.current?.stop();
//       setIsRecording(false);
//     }
//   };

//   // Handle sending a message
//   const handleSendMessage = () => {
//     if (input.trim() !== '') {
//       onSendMessage(input);
//       setInput('');
//     }
//   };

//   // Handle Enter key press in the input box
//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="container mx-52 max-w-[53rem] p-4 bg-white rounded-lg shadow-lg">
//       {/* Input Box and Buttons */}
//       <div className="flex items-center gap-2">
//         {/* Voice Recorder Button */}
//         <button
//           onClick={handleRecordButtonClick}
//           className={`p-2 rounded-full ${
//             isRecording ? 'bg-red-500' : 'bg-blue-800'
//           } text-white hover:opacity-80 transition-all`}
//         >
//           <MdOutlineSettingsVoice className="h-6 w-6" />
//         </button>

//         {/* Input Box */}
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type a message..."
//           className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
//         />

//         {/* Send Button */}
//         <button
//           onClick={handleSendMessage}
//           className="p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 transition-all"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++


import React, { useState, useRef } from 'react';
import { MdOutlineSettingsVoice } from "react-icons/md";
import { FaPaperPlane } from "react-icons/fa6";
import { LuImagePlus } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

interface SendMessageProps {
  onSendMessage: (message: string, imageUrls?: string[]) => void;
}

const ChatInterface: React.FC<SendMessageProps> = ({ onSendMessage }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isImageSelected, setIsImageSelected] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRecordButtonClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => audioChunks.current.push(event.data);
        mediaRecorder.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          const response = await fetch('http://localhost:5000/transcribe', { method: 'POST', body: formData });
          const result = await response.json();
          setInput(result.text);
          audioChunks.current = [];
          stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorder.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    } else {
      mediaRecorder.current?.stop();
      setIsRecording(false);
    }
  };

  const handleSendMessage = () => {
    if (input.trim() || imageUrls.length > 0) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urlsFromInput = input.match(urlRegex) || [];
      const message = input.replace(urlRegex, '').trim();

      console.log("URLs from input:", urlsFromInput); // Debug log
      console.log("Current imageUrls:", imageUrls); // Debug log

      if (imageUrls.length > 0) {
        // Send local images if present
        onSendMessage(message, imageUrls.slice(0, 2));
      } else if (urlsFromInput.length > 0) {
        // Send pasted URLs if no local images
        onSendMessage(message, urlsFromInput.slice(0, 2));
      } else {
        onSendMessage(message);
      }

      setInput('');
      setImageUrls([]);
      setIsImageSelected(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSendMessage();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImageUrls: string[] = [...imageUrls];
      Array.from(files).slice(0, 2 - imageUrls.length).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (!newImageUrls.includes(result)) {
            newImageUrls.push(result);
            setImageUrls([...newImageUrls]);
            setIsImageSelected(true);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    setIsImageSelected(newImageUrls.length > 0);
    if (newImageUrls.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Only detect pasted URLs if no local images are selected
    if (imageUrls.length === 0) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = Array.from(value.matchAll(urlRegex), match => match[0]);
      console.log("Detected URLs:", urls); // Debug log
      if (urls.length > 0) {
        setImageUrls(urls.slice(0, 2)); // Capture up to 2 URLs
        setIsImageSelected(true);
      } else {
        setImageUrls([]);
        setIsImageSelected(false);
      }
    }
  };

  return (
    <div className="container mx-52 max-w-[53rem] p-4 bg-white rounded-lg shadow-lg">
      {imageUrls.length > 0 && (
        <div className="relative mb-2 flex gap-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative inline-block">
              <img
                src={url}
                alt={`Selected content ${index + 1}`}
                className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                onError={() => handleRemoveImage(index)}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
              >
                <RxCross2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <LuImagePlus className="h-6 w-6" />
        </label>

        <button
          onClick={handleRecordButtonClick}
          className={`p-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-800'} text-white hover:opacity-80 transition-all`}
        >
          <MdOutlineSettingsVoice className="h-6 w-6" />
        </button>

        <input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or paste image URLs..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />

        <button
          onClick={handleSendMessage}
          className={`p-2 ${isImageSelected ? 'bg-red-500' : 'bg-blue-800'} text-white rounded-lg hover:opacity-80 transition-all`}
        >
          <FaPaperPlane className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;