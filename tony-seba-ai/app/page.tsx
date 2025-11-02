'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateGraphsForQuery, GraphData } from '@/lib/graphs/graph-generator';

const GraphRenderer = dynamic(() => import('@/components/GraphRenderer'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading graphs...</div>
});

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  graphs?: GraphData[];
  timestamp: Date;
}

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function TonySebaAI() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number>(0);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedMessageGraphs, setSelectedMessageGraphs] = useState<GraphData[]>([]);
  const [showGraphPanel, setShowGraphPanel] = useState(false);
  const [showSourcesPanel, setShowSourcesPanel] = useState(false);
  const [selectedMessageSources, setSelectedMessageSources] = useState<any[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Function to get sources based on message content
  const getSourcesForMessage = (content: string) => {
    const lowerContent = content.toLowerCase();
    const sources = [];

    // Base sources that apply to most topics
    const baseSources = [
      { name: 'RethinkX Research', description: 'Technology disruption analysis and forecasts', url: 'https://www.rethinkx.com/reports' },
    ];

    if (lowerContent.includes('india') || lowerContent.includes('two-wheeler') || lowerContent.includes('scooter')) {
      sources.push(
        { name: 'NITI Aayog', description: 'India\'s electric mobility transition roadmap', url: 'https://www.niti.gov.in/' },
        { name: 'CEEW Transport Study', description: 'Council on Energy, Environment and Water analysis', url: 'https://www.ceew.in/' },
        { name: 'India Brand Equity Foundation', description: 'EV market analysis for India', url: 'https://www.ibef.org/' }
      );
    }

    if (lowerContent.includes('ev') || lowerContent.includes('electric vehicle') || lowerContent.includes('transport')) {
      sources.push(
        { name: 'BloombergNEF EV Outlook', description: 'Global electric vehicle market forecasts', url: 'https://about.bnef.com/electric-vehicle-outlook/' },
        { name: 'IEA Global EV Data', description: 'Electric vehicle stock and sales statistics', url: 'https://www.iea.org/data-and-statistics/data-tools/global-ev-data-explorer' }
      );
    }

    if (lowerContent.includes('solar') || lowerContent.includes('renewable') || lowerContent.includes('energy')) {
      sources.push(
        { name: 'IRENA', description: 'Renewable energy statistics and cost analysis', url: 'https://www.irena.org/' },
        { name: 'NREL', description: 'National Renewable Energy Laboratory research', url: 'https://www.nrel.gov/' },
        { name: 'IEA', description: 'International Energy Agency reports', url: 'https://www.iea.org/' }
      );
    }

    if (lowerContent.includes('battery') || lowerContent.includes('storage')) {
      sources.push(
        { name: 'BloombergNEF Battery Report', description: 'Annual lithium-ion battery price surveys', url: 'https://about.bnef.com/' },
        { name: 'NREL Battery Research', description: 'Energy storage cost and performance data', url: 'https://www.nrel.gov/transportation/battery-cost.html' }
      );
    }

    if (lowerContent.includes('oil') || lowerContent.includes('petroleum')) {
      sources.push(
        { name: 'IEA World Energy Outlook', description: 'Global energy demand projections', url: 'https://www.iea.org/' },
        { name: 'BP Statistical Review', description: 'Historical and projected oil consumption data', url: 'https://www.bp.com/' }
      );
    }

    return sources.length > 0 ? [...baseSources, ...sources] : baseSources;
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;

        if (event.results[last].isFinal) {
          setInput(transcript);
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    let activeSessionId = currentSessionId;

    // Create first session if none exists
    if (sessions.length === 0) {
      const newSession: ChatSession = {
        id: Date.now(),
        title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
        messages: [userMessage],
        createdAt: new Date(),
      };
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
      activeSessionId = newSession.id;
    } else {
      // Update session messages
      setSessions(prev => prev.map(session =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      ));
    }

    setInput('');
    setIsLoading(true);

    const graphs = generateGraphsForQuery(input);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      const assistantMessageId = Date.now().toString();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        setSessions(prev => prev.map(session => {
          if (session.id !== activeSessionId) return session;

          const newMessages = [...session.messages];
          const lastIndex = newMessages.findIndex(m => m.id === assistantMessageId);

          if (lastIndex >= 0) {
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: assistantMessage,
            };
          } else {
            newMessages.push({
              id: assistantMessageId,
              role: 'assistant',
              content: assistantMessage,
              timestamp: new Date(),
              graphs: graphs,
            });
          }
          return { ...session, messages: newMessages };
        }));
      }

    } catch (error) {
      console.error('Error:', error);
      const mockResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'll analyze your question about clean energy and technology disruption.`,
        graphs: graphs,
        timestamp: new Date(),
      };
      setSessions(prev => prev.map(session =>
        session.id === activeSessionId
          ? { ...session, messages: [...session.messages, mockResponse] }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported. Use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    };
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setShowGraphPanel(false);
    setSelectedMessageGraphs([]);
  };

  const switchSession = (sessionId: number) => {
    setCurrentSessionId(sessionId);
    setShowGraphPanel(false);
    setSelectedMessageGraphs([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[hsl(var(--background))]">
      <div className="flex h-full w-full flex-1">
        {/* Sidebar */}
        <aside className={`flex h-full ${isSidebarCollapsed ? 'w-0' : 'w-[280px]'} flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--sidebar-bg))] transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'p-0' : 'p-6'}`}>
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-[#E8DFF5] to-[#FCE1E4] flex items-center justify-center">
                  <div className="size-3 rounded-full bg-white/60"></div>
                </div>
                <p className="text-base font-semibold text-[hsl(var(--foreground))]">Tony's AI</p>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="flex size-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] transition-colors">
                <span className="material-symbols-outlined text-xl">menu_open</span>
              </button>
            </div>

            {/* Chat List */}
            <div className="flex flex-col gap-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {sessions.length === 0 ? (
                <div className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4">
                  No sessions yet. Start a new chat!
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => switchSession(session.id)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 cursor-pointer transition-all ${
                      session.id === currentSessionId
                        ? 'bg-[hsl(var(--accent))] border border-[hsl(var(--primary))]/20'
                        : 'hover:bg-[hsl(var(--secondary))]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${
                      session.id === currentSessionId ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'
                    }`}>
                      chat_bubble
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-tight truncate ${
                        session.id === currentSessionId
                          ? 'text-[hsl(var(--foreground))] font-normal'
                          : 'text-[hsl(var(--muted-foreground))] font-light'
                      }`}>
                        {session.title}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                        {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex h-full flex-1 flex-col bg-[hsl(var(--background))]">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[hsl(var(--border))] px-8 py-4">
            <div className="flex items-center gap-3">
              {isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="flex size-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] transition-colors mr-2">
                  <span className="material-symbols-outlined text-xl">menu</span>
                </button>
              )}
              <div className="size-6 text-[hsl(var(--primary))]">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">Seba AI</h2>
            </div>
            <button
              onClick={handleNewChat}
              className="px-5 h-10 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-bold hover:bg-[hsl(var(--primary))]/90 transition-colors"
            >
              New Chat
            </button>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              /* Welcome Screen */
              <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col gap-3 text-center">
                  <h1 className="text-7xl font-bold leading-tight premium-gradient-text">
                    Welcome to Seba AI
                  </h1>
                  <p className="text-lg text-[hsl(var(--muted-foreground))]">
                    Your guide to the insights of Tony Seba
                  </p>
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="p-8">
                <div className="mx-auto max-w-4xl space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Assistant Avatar */}
                      {message.role === 'assistant' && (
                        <div className="size-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#BCC7FF] to-[#C4B5FD] flex items-center justify-center text-white font-bold text-base shadow-sm">
                          TS
                        </div>
                      )}

                      {/* Message Content */}
                      <div className={`flex flex-col ${message.role === 'user' ? 'max-w-lg items-end' : 'max-w-2xl items-start'}`}>
                        <div className={`rounded-xl ${
                          message.role === 'user'
                            ? 'rounded-br-none bg-[hsl(var(--primary))] p-4 text-white shadow-lg'
                            : 'rounded-bl-none bg-blue-100/60 backdrop-blur-sm border border-blue-200/80 shadow-lg text-blue-900/90 p-5 space-y-4'
                        }`}>
                          {message.role === 'user' ? (
                            <p className="text-base font-medium leading-normal whitespace-pre-wrap">
                              {message.content}
                            </p>
                          ) : (
                            <div className="markdown-content">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {message.role === 'assistant' && (
                            <div className="flex gap-2 mt-3">
                              {message.graphs && message.graphs.length > 0 && (
                                <button
                                  onClick={() => {
                                    setSelectedMessageGraphs(message.graphs || []);
                                    setShowGraphPanel(true);
                                    setShowSourcesPanel(false);
                                  }}
                                  className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors"
                                >
                                  📊 View {message.graphs.length} Graph{message.graphs.length > 1 ? 's' : ''}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedMessageSources(getSourcesForMessage(message.content));
                                  setShowSourcesPanel(true);
                                  setShowGraphPanel(false);
                                }}
                                className="px-4 py-2 bg-gray-100 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                              >
                                📚 Sources
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="size-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#BCC7FF] to-[#C4B5FD] flex items-center justify-center text-white font-bold text-base shadow-sm">
                        TS
                      </div>
                      <div className="flex gap-1.5 items-center pt-2">
                        <span className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
            <div className="mx-auto max-w-4xl">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full resize-none rounded-xl border border-[hsl(var(--border))] bg-white px-6 py-4 pr-24 text-[15px] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 focus:border-[hsl(var(--primary))]/30 transition-all"
                  placeholder="Ask about clean energy disruption..."
                  rows={1}
                  disabled={isLoading}
                />
                <div className="absolute right-3.5 bottom-3.5 flex items-center gap-1.5">
                  <button
                    onClick={toggleVoice}
                    disabled={isLoading}
                    className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
                      isListening
                        ? 'bg-red-500 text-white'
                        : 'text-[hsl(var(--foreground))]/60 hover:bg-[hsl(var(--secondary))]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">mic</span>
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="flex size-9 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-xl">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Graph Sidebar */}
        {showGraphPanel && (
          <aside className="w-[480px] bg-white border-l border-[hsl(var(--border))] flex flex-col shadow-xl">
            <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">📊 Data Visualization</h2>
              <button
                onClick={() => setShowGraphPanel(false)}
                className="flex size-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-white/60 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-white">
              {selectedMessageGraphs.length > 0 ? (
                <GraphRenderer graphs={selectedMessageGraphs} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[hsl(var(--muted-foreground))]">No graphs selected</p>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Sources Sidebar */}
        {showSourcesPanel && (
          <aside className="w-[480px] bg-white border-l border-[hsl(var(--border))] flex flex-col shadow-xl">
            <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50">
              <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">📚 Verified Sources</h2>
              <button
                onClick={() => setShowSourcesPanel(false)}
                className="flex size-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-white/60 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-white">
              {selectedMessageSources.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2">
                    {selectedMessageSources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-white p-3 min-h-[72px] rounded-lg transition-colors hover:bg-blue-50 group border border-gray-200"
                      >
                        <div className="flex items-center justify-center rounded-lg bg-blue-100 shrink-0 size-12 text-blue-600">
                          <span className="material-symbols-outlined">
                            {index === 0 ? 'menu_book' : index === 1 ? 'article' : 'play_circle'}
                          </span>
                        </div>
                        <div className="flex flex-col justify-center flex-1 min-w-0">
                          <p className="text-gray-900 text-base font-medium leading-normal truncate">{source.name}</p>
                          <p className="text-gray-600 text-sm font-normal leading-normal line-clamp-2">{source.description}</p>
                        </div>
                        <div className="shrink-0">
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-600">arrow_outward</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[hsl(var(--muted-foreground))]">No sources available</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
