
import React from 'react';
import { Message, Role } from '../types';
import JobCard from './JobCard';
import { UserIcon, AiIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.User;

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <AiIcon className="h-5 w-5 text-white" />
        </div>
      )}
      <div className={`max-w-xl rounded-xl p-4 ${isUser ? 'bg-blue-600/80' : 'bg-slate-700'}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.jobs && message.jobs.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4">
            {message.jobs.map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
          <UserIcon className="h-5 w-5 text-slate-200" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
