import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, Loader2, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import ReactMarkdown from 'react-markdown';

function ChatCopilot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true); // Track initial loading state
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // 1. FETCH PERSISTED CHAT HISTORY ON MOUNT
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${BASE_URL}/copilot/history`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (data.success && data.history.length > 0) {
          // Transform database fields (role/content) into frontend states (sender/text)
          const formattedMessages = data.history.map(msg => ({
            id: msg._id,
            sender: msg.role === 'user' ? 'user' : 'ai',
            text: msg.content,
            time: new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(formattedMessages);
        } else {
          // Fallback welcome message if database history is empty
          setMessages([
            {
              id: 'welcome',
              sender: 'ai',
              text: "Hi! I'm your Financial Copilot. I'm now connected to your live database. Ask me to summarize your spending, find specific expenses, or analyze your habits!",
              time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      } catch (error) {
        console.error("Error loading chat context history:", error);
        toast.error("Failed to recover previous chat session.");
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchChatHistory();
  }, []);

  // Scroll viewport down when messages update or typing flags toggle
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: "Summarize my spending", query: "Can you give me a summary of my spending this month?" },
    { label: "Where did I spend the most?", query: "Which category did I spend the most money on recently?" },
    { label: "Find specific transactions", query: "Show me all my food transactions." }
  ];

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // Optimistically add user text to view canvas immediately
    const userMsg = { id: Date.now(), sender: 'user', text: textToSend, time: currentTime };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${BASE_URL}/copilot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();

      if (data.success) {
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.reply,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        // If back-end sends an error payload (e.g., 429 Rate limited), display the string safely
        if (data.reply) {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: 'ai',
            text: data.reply,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          }]);
        } else {
          toast.error("Copilot encountered an error processing that statement.");
        }
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Failed to connect to AI server.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[900px] md:h-[calc(100vh-120px)] transition-colors duration-200">

      {/* CHAT VIEWPORT */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col overflow-hidden h-full transition-colors duration-200">

        {/* HEADER */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                Financial Copilot
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Sparkles size={10} className="fill-emerald-100 dark:fill-emerald-900" /> Live LLM
                </span>
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Connected via Gemini API</p>
            </div>
          </div>
        </div>

        {/* MESSAGES SCROLLER */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/50 flex flex-col">
          {isLoadingHistory ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400 font-semibold text-sm">
              <Loader2 className="animate-spin text-indigo-500" size={24} />
              <span>Retrieving chat session records...</span>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse ml-auto'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-xs
                      ${isAI ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20' : 'bg-slate-900 dark:bg-slate-700 text-white'}`}
                    >
                      {isAI ? <Bot size={16} /> : <User size={16} />}
                    </div>

                    <div className="space-y-1">
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm border whitespace-pre-wrap
                        ${isAI
                          ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200/60 dark:border-slate-700 rounded-tl-none'
                          : 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:bg-indigo-500 rounded-tr-none'}`}
                      >
                        <ReactMarkdown
                          components={{
                            // Re-add bullet points and spacing for lists
                            ul: ({ node, ...props }) => <ul className="list-disc ml-4 space-y-1 mb-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal ml-4 space-y-1 mb-2" {...props} />,
                            // Make bold text actually bold
                            strong: ({ node, ...props }) => <span className="font-bold" {...props} />,
                            // Add a little space between paragraphs
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {isTyping && (
            <div className="flex gap-3 max-w-[80%] self-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center shadow-xs">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 p-3.5 rounded-2xl rounded-tl-none text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-2 shadow-sm">
                Generating response...
              </div>
            </div>
          )}
        </div>

        {/* INPUT FORM */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-500/20 rounded-xl p-1.5 transition-all"
          >
            <input
              type="text"
              placeholder="Ask Copilot about your finances..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping || isLoadingHistory}
              className="flex-1 bg-transparent border-none outline-none text-sm px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping || isLoadingHistory}
              className="p-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-indigo-600 dark:disabled:hover:bg-indigo-500 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm h-fit space-y-5 transition-colors duration-200">
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
          <HelpCircle size={14} /> Try These Prompts
        </div>

        <div className="flex flex-col gap-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(prompt.query)}
              disabled={isTyping || isLoadingHistory}
              className="text-left w-full p-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:border-indigo-100/60 dark:hover:border-indigo-500/30 transition-all flex items-start gap-2 group disabled:opacity-50 disabled:hover:bg-slate-50 dark:disabled:hover:bg-slate-800 disabled:hover:text-slate-600 dark:disabled:hover:text-slate-300 disabled:hover:border-slate-100 dark:disabled:hover:border-slate-700 cursor-pointer"
            >
              <MessageSquare size={14} className="shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 mt-0.5" />
              <span>{prompt.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ChatCopilot;