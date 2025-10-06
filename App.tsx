
import React, { useState, useCallback, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Profile, Message, Role } from './types';
import Setup from './components/Setup';
import ProfileEditor from './components/ProfileEditor';
import ChatWindow from './components/ChatWindow';
import { callN8nWebhook } from './services/n8nService';
import { LogoIcon, SettingsIcon } from './components/Icons';

const App: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useLocalStorage<string | null>('n8nWebhookUrl', null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    fullName: 'Jane Doe',
    professionalSummary: 'A passionate frontend developer with 5 years of experience in React, TypeScript, and building scalable web applications.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'UI/UX Design'],
    desiredRole: 'Senior Frontend Engineer',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set initial message based on webhookUrl presence on first load
    if (!webhookUrl) {
      setMessages([
        {
          role: Role.AI,
          content: "Welcome! To get started, please add your n8n webhook URL in settings by clicking the gear icon below.",
        },
      ]);
    } else {
       setMessages([
        {
          role: Role.AI,
          content: "Hello! I'm your AI job seeking assistant. Tell me what kind of job you're looking for today.",
        },
      ]);
    }
  }, []); // Intentionally empty to run only on mount

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = { role: Role.User, content: userInput };
    
    if (!webhookUrl) {
        setMessages(prev => [...prev, userMessage, {
            role: Role.AI,
            content: "I can't connect to your agent. Please set your n8n webhook URL in settings first. Click the gear icon below.",
        }]);
        return;
    }

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponseData = await callN8nWebhook(webhookUrl, profile, userInput);
      
      const aiMessage: Message = {
        role: Role.AI,
        content: aiResponseData.responseText,
        jobs: aiResponseData.jobs || [],
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage: Message = {
        role: Role.AI,
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your webhook URL and n8n workflow in settings.`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [webhookUrl, profile]);
  
  const handleUrlSubmit = (url: string) => {
    setWebhookUrl(url);
    setIsSettingsOpen(false);
    setMessages(prev => [...prev, {
        role: Role.AI,
        content: "Great! Your webhook URL is saved. How can I help you find a job?",
    }]);
  };

  const handleUrlReset = () => {
    setWebhookUrl(null);
    setMessages(prev => [...prev, {
        role: Role.AI,
        content: "Your webhook URL has been cleared. Please set a new one in settings to continue.",
    }]);
  };

  return (
    <>
      <div className="flex h-screen font-sans bg-slate-900 text-slate-100">
        <div className="w-1/3 min-w-[350px] max-w-[450px] bg-slate-800/50 border-r border-slate-700 p-6 flex flex-col">
          <div className="flex items-center mb-6">
            <LogoIcon className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold ml-3">Agentic Job Seeker</h1>
          </div>
          <ProfileEditor profile={profile} setProfile={setProfile} />
          <div className="mt-auto pt-4 border-t border-slate-700">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center w-full text-left text-sm text-slate-400 hover:text-cyan-300 transition-colors p-2 rounded-md hover:bg-slate-700/50"
              aria-label="Open agent settings"
            >
              <SettingsIcon className="h-5 w-5 mr-3" />
              Agent Settings
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
      <Setup
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUrl={webhookUrl}
        onUrlSubmit={handleUrlSubmit}
        onUrlReset={handleUrlReset}
      />
    </>
  );
};

export default App;
