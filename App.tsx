
import React, { useState, useCallback, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Profile, Message, Role } from './types';
import SettingsModal from './components/Settings/SettingsModal';
import ProfileEditor from './components/ProfileEditor';
import ChatWindow from './components/ChatWindow';
import { callN8nWebhook } from './services/n8nService';
import { LogoIcon, SettingsIcon, MenuIcon, CloseIcon } from './components/Icons';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const AppContent: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useLocalStorage<string | null>('n8nWebhookUrl', null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Temporary state for settings modal to enable auto-save on close
  const [tempWebhookUrl, setTempWebhookUrl] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile>({
    fullName: 'Jane Doe',
    professionalSummary: 'A passionate frontend developer with 5 years of experience in React, TypeScript, and building scalable web applications.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'UI/UX Design'],
    desiredRole: 'Senior Frontend Engineer',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, background } = useTheme();

  useEffect(() => {
    if (messages.length === 0) {
      if (!webhookUrl) {
        setMessages([
          {
            role: Role.AI,
            content: "Welcome! To get started, please add your n8n webhook URL in settings. Click the menu icon, then 'Agent Settings'.",
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
    }
  }, [webhookUrl, messages.length]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = { role: Role.User, content: userInput };
    
    if (!webhookUrl) {
        setMessages(prev => [...prev, userMessage, {
            role: Role.AI,
            content: "I can't connect to your agent. Please set your n8n webhook URL in settings first. You can find it in the sidebar menu.",
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
  
  const openSettings = () => {
    setTempWebhookUrl(webhookUrl); // Initialize temp state when opening
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    // Auto-save on close
    if (tempWebhookUrl !== webhookUrl) {
        if (!tempWebhookUrl) {
            handleUrlReset();
        } else {
            handleUrlSubmit(tempWebhookUrl);
        }
    }
    setIsSettingsOpen(false);
  };

  const handleUrlSubmit = (url: string) => {
    setWebhookUrl(url);
    // FIX: Property 'at' does not exist on type 'Message[]'. Replaced with bracket notation for wider compatibility.
    if(messages.length > 0 && messages[messages.length - 1]?.content.includes("webhook URL has been cleared")) {
      setMessages(prev => [...prev, {
          role: Role.AI,
          content: "Great! Your webhook URL is saved. How can I help you find a job?",
      }]);
    }
  };

  const handleUrlReset = () => {
    setWebhookUrl(null);
    setTempWebhookUrl(null);
    setMessages(prev => [...prev, {
        role: Role.AI,
        content: "Your webhook URL has been cleared. Please set a new one in settings to continue.",
    }]);
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <LogoIcon className={`h-8 w-8 ${theme.accent.text}`} />
            <h1 className="text-2xl font-bold ml-3">Agentic Job Seeker</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(false)} 
          className="md:hidden text-slate-400 hover:text-white"
          aria-label="Close sidebar"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>
      <ProfileEditor profile={profile} setProfile={setProfile} />
      <div className="mt-auto pt-4 border-t border-slate-700">
        <button 
          onClick={() => {
            openSettings();
            setIsSidebarOpen(false);
          }}
          className={`flex items-center w-full text-left text-sm ${theme.text.secondary} hover:${theme.accent.text} transition-colors p-2 rounded-md hover:bg-slate-700/50`}
          aria-label="Open agent settings"
        >
          <SettingsIcon className="h-5 w-5 mr-3" />
          Agent Settings
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className={`h-screen font-sans ${theme.text.primary} ${background.className} flex flex-col md:flex-row overflow-hidden`}>
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
          <div className="flex items-center">
            <LogoIcon className={`h-7 w-7 ${theme.accent.text}`} />
            <h1 className="text-xl font-bold ml-3">Job Seeker AI</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar menu"
            className={`${theme.text.tertiary} hover:${theme.accent.text}`}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/60 z-20 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden="true"
            ></div>
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-full max-w-sm transform transition-transform duration-300 ease-in-out ${theme.background.sidebarMobile} border-r border-slate-700 p-6 flex flex-col
          md:relative md:w-1/3 md:min-w-[350px] md:max-w-[450px] md:translate-x-0 ${theme.background.sidebar}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        </main>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        currentUrl={tempWebhookUrl}
        onUrlChange={setTempWebhookUrl}
        onUrlReset={handleUrlReset}
      />
    </>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);


export default App;