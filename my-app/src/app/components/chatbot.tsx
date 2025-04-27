import React, { useEffect, useRef } from "react";
import { RiRobot2Fill } from "react-icons/ri";

type Message = {
  role: string;
  content: string;
  imageUrls?: string[]; // Already supports multiple image URLs
};

interface ChatbotProps {
  messages: Message[];
}

const Chatbot: React.FC<ChatbotProps> = ({ messages }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to parse and render content with images from bot response
  const renderContentWithImages = (content: string) => {
    const imageUrlRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif))/gi;
    const elements: JSX.Element[] = [];
    let lastIndex = 0;
    let match;

    while ((match = imageUrlRegex.exec(content)) !== null) {
      const url = match[0];
      if (match.index > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>
            {content.slice(lastIndex, match.index)}
          </span>
        );
      }
      elements.push(
        <img
          key={`img-${match.index}`}
          src={url}
          alt="Bot response content"
          className="max-w-xs mb-3 rounded-lg"
          onError={() => console.error(`Failed to load bot image: ${url}`)}
        />
      );
      lastIndex = imageUrlRegex.lastIndex;
    }
    if (lastIndex < content.length) {
      elements.push(
        <span key={`text-${lastIndex}`}>{content.slice(lastIndex)}</span>
      );
    }
    return elements.length > 0 ? elements : <span>{content}</span>;
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="container mx-auto p-4 h-[450px] w-2/3 bg-slate-50 min-h-fit overflow-y-auto shadow-md"
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className={message.role === "user" ? "text-right" : "text-left"}
        >
          <div className="flex items-center">
            {message.role === "bot" && <RiRobot2Fill className="mr-2" />}
          </div>
          {/* Render user-provided image URLs */}
          {message.imageUrls && message.imageUrls.length > 0 && (
            <div className="flex gap-2 mb-3 justify-end">
              {message.imageUrls.map((url, imgIndex) => (
                <img
                  key={`user-img-${index}-${imgIndex}`}
                  src={url}
                  alt={`User uploaded image ${imgIndex + 1}`}
                  className="max-w-xs rounded-lg"
                  onError={() => console.error(`Failed to load user image ${imgIndex + 1}: ${url}`)}
                />
              ))}
            </div>
          )}
          <p
            className={
              message.role === "user"
                ? "border mb-3 inline-block bg-blue-800 p-2 text-white rounded-lg"
                : "bg-gray-200 p-2 mb-3 rounded-lg inline-block"
            }
          >
            {message.role === "bot"
              ? renderContentWithImages(message.content)
              : message.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Chatbot;