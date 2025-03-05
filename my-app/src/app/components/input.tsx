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
import { FaPaperPlane } from "react-icons/fa6"; // Import FaPaperPlane for a send icon
import { LuImagePlus } from "react-icons/lu";

interface SendMessageProps {
  onSendMessage: (message: string, imageUrl?: string) => void;
}

const ChatInterface: React.FC<SendMessageProps> = ({ onSendMessage }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [input, setInput] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isImageSelected, setIsImageSelected] = useState<boolean>(false)

  const handleRecordButtonClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          try {
            const response = await fetch('http://localhost:5000/transcribe', {
              method: 'POST',
              body: formData,
            });
            const result = await response.json();
            setTranscription(result.text);
            setInput(result.text);
          } catch (error) {
            console.error('Error:', error);
          }

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
    if (input.trim() !== '' || imageUrl.trim() !== '') {
      onSendMessage(input, imageUrl);
      setInput('');
      setImageUrl('');
      setIsImageSelected(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setIsImageSelected(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-52 max-w-[53rem] p-4 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        {/* Add Button with LuImagePlus Icon */}
        <label className="p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <LuImagePlus className="h-6 w-6" />
        </label>

        {/* Voice Recorder Button */}
        <button
          onClick={handleRecordButtonClick}
          className={`p-2 rounded-full ${
            isRecording ? 'bg-red-500' : 'bg-blue-800'
          } text-white hover:opacity-80 transition-all`}
        >
          <MdOutlineSettingsVoice className="h-6 w-6" />
        </button>

        {/* Input Box */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />

        {/* Send Button with FaPaperPlane Icon */}
        <button
          onClick={handleSendMessage}
          className={`p-2 ${
            isImageSelected ? 'bg-red-500' : 'bg-blue-800' // Change color based on image selection
          } text-white rounded-lg hover:opacity-80 transition-all`}
        >
          <FaPaperPlane className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;