'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
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

export default function TonySebaAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome! I'm your AI expert on Tony Seba's technology disruption framework.

I can help you understand and predict disruptions with professional forecasting graphs for:
• **Energy** - Solar PV cost curves, SWB adoption
• **Transportation** - EV S-curves, autonomous vehicles
• **Food** - Precision fermentation projections
• **Batteries** - Learning curves, cost trajectories

Ask me any question and I'll generate detailed predictions with visualization!`,
      timestamp: new Date(),
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedMessageGraphs, setSelectedMessageGraphs] = useState<GraphData[]>([]);
  const [showGraphPanel, setShowGraphPanel] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
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

        setMessages(prev => {
          const newMessages = [...prev];
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
          return newMessages;
        });
      }

      if (graphs.length > 0) {
        setSelectedMessageGraphs(graphs);
        setShowGraphPanel(true);
      }

    } catch (error) {
      console.error('Error:', error);
      const mockResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Based on Tony Seba's framework, I'll analyze "${input}" using disruption principles.`,
        graphs: graphs,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, mockResponse]);

      if (graphs.length > 0) {
        setSelectedMessageGraphs(graphs);
        setShowGraphPanel(true);
      }
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

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tony Seba AI Expert
              </h1>
              <p className="text-sm text-gray-600">Technology Disruption Forecasting</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                📊 Graphs Enabled
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      TS
                    </div>
                  )}

                  <div className={`flex-1 max-w-2xl ${
                    message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white'
                  } rounded-lg p-4 shadow-md`}>
                    <div className="whitespace-pre-wrap">
                      {message.content}
                    </div>

                    {message.role === 'assistant' && message.graphs && message.graphs.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setSelectedMessageGraphs(message.graphs || []);
                            setShowGraphPanel(true);
                          }}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          View {message.graphs.length} Graphs →
                        </button>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      You
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  TS
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white border-t p-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <button
                onClick={toggleVoice}
                className={`p-3 rounded-lg transition-all ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                disabled={isLoading}
              >
                🎤
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about solar costs, EV adoption, disruption timelines..."
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || isListening}
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                Analyze
              </button>
            </div>

            <div className="flex gap-2 mt-2 flex-wrap">
              {[
                "Show solar PV cost projections",
                "When will EVs hit 95% market share?",
                "Energy disruption timeline",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-xs px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-full"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${showGraphPanel ? 'w-[480px]' : 'w-96'} bg-white border-l shadow-xl flex flex-col`}>
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-lg font-semibold">📊 Prediction Graphs</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {showGraphPanel && selectedMessageGraphs.length > 0 ? (
            <GraphRenderer graphs={selectedMessageGraphs} />
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>Graphs will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
