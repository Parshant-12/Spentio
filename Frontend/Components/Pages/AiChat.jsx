import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, Loader2, HelpCircle } from 'lucide-react';

function ChatCopilot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hi Parshant! I'm your Spent.io Copilot. I have indexed your current month's transactions, budget thresholds, and spending velocity. Ask me anything about your data!",
      time: '04:30 PM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll layout to the latest message bubble node
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Suggested quick prompts array for easy UX testing
  const quickPrompts = [
    { label: "Summarize my spending", query: "Can you give me a summary of my spending this month?" },
    { label: "Check budget status", query: "Am I close to breaching any of my budgets?" },
    { label: "Analyze weekend velocity", query: "Why did my spending spike last weekend?" }
  ];

  // Smart Mock Response Rules matching your project's data profile context
  const getAIResponse = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes('summary') || text.includes('spend') || text.includes('total')) {
      return "You have spent a total of ₹39,769.00 this month out of your total available balance of ₹45,231.00. Your highest cost center remains Rent & PG/Hostel (₹15,000.00), followed closely by Food & Groceries (₹12,450.00).";
    }
    if (text.includes('budget') || text.includes('breach') || text.includes('limit')) {
      return "Your 'Rent & PG/Hostel' budget is 100% exhausted at ₹15,000. Additionally, your 'Shopping' allocation is at 85.2% (₹6,820/₹8,000) and 'Food' is at 83%. You are entering a critical zone with a remaining buffer of only ₹10,231.00.";
    }
    if (text.includes('weekend') || text.includes('spike') || text.includes('velocity') || text.includes('swiggy')) {
      return "I detected a 24% frequency acceleration in your food logistics vector over the weekend. You had multiple recurring transactions via Zomato and Swiggy totaling ₹1,240.00, which caused Week 2 to hold your peak velocity.";
    }
    return "I am analyzing your structural data model endpoints. Currently, your account displays stable inbound liquidity (₹85,000.00) and an overall resource exhaustion rate of 79.5%. Is there a specific category transaction layer you want me to audit?";
  };

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    // 1. Append User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: currentTime
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // 2. Trigger AI Processing Animation State
    setIsTyping(true);

    // 3. Simulate processing delay
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: getAIResponse(textToSend),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)]">
      
      {/* LEFT CHAT CORE VIEWPORT CONTAINER */}
      <div className="flex-1 bg-white border border-slate-200/70 rounded-2xl shadow-sm flex flex-col overflow-hidden h-full">
        
        {/* TOP COMPONENT INFO BAR */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                Financial Copilot
                <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Sparkles size={10} className="fill-indigo-100" /> AI Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">Online • Indexing live transaction data fields</p>
            </div>
          </div>
        </div>

        {/* MESSAGES TIMELINE BOX SCROLLER */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse ml-auto'}`}>
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-xs
                  ${isAI ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-900 text-white'}`}
                >
                  {isAI ? <Bot size={16} /> : <User size={16} />}
                </div>

                {/* Message Content Bubble */}
                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm border
                    ${isAI 
                      ? 'bg-white text-slate-800 border-slate-200/60 rounded-tl-none' 
                      : 'bg-indigo-600 text-white border-indigo-600 rounded-tr-none'}`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-slate-400 font-bold block ${!isAI && 'text-right'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Conditional Typing Processing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[80%] self-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="bg-white border border-slate-200/60 p-3.5 rounded-2xl rounded-tl-none text-xs font-semibold text-slate-400 flex items-center gap-2 shadow-sm">
                Copilot is computing ledger matrices...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* CHAT INPUT FORM BOARD CONTAINER */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 rounded-xl p-1.5 transition-all"
          >
            <input
              type="text"
              placeholder="Ask Copilot e.g., 'Am I overspending on food?'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              className="flex-1 bg-transparent border-none outline-none text-sm px-3 py-2 text-slate-900 placeholder-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow-xs shrink-0"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDEBAR PANEL: CONTEXT SHORTCUT TOOLS */}
      <div className="w-full md:w-64 bg-white border border-slate-200/70 rounded-2xl p-5 shadow-sm h-fit space-y-5">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
          <HelpCircle size={14} /> Suggested Audits
        </div>
        
        <div className="flex flex-col gap-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(prompt.query)}
              disabled={isTyping}
              className="text-left w-full p-3 bg-slate-50 hover:bg-indigo-50/50 hover:text-indigo-700 rounded-xl text-xs font-semibold text-slate-600 border border-slate-100 hover:border-indigo-100/60 transition-all flex items-start gap-2 group disabled:opacity-50 disabled:hover:bg-slate-50 disabled:hover:text-slate-600 disabled:hover:border-slate-100"
            >
              <MessageSquare size={14} className="shrink-0 text-slate-400 group-hover:text-indigo-500 mt-0.5" />
              <span>{prompt.label}</span>
            </button>
          ))}
        </div>
        
        <div className="bg-indigo-50/40 border border-indigo-100/40 p-4 rounded-xl text-[11px] leading-relaxed text-slate-500 font-medium">
          <span className="font-bold text-indigo-700 block mb-1">Architecture Note:</span>
          In Phase 2, this input form can connect directly to an Express router endpoint like <code className="bg-white px-1 py-0.5 rounded text-indigo-600 font-bold">POST /api/chat</code> powered by LangChain or the Google Gemini API using Retrieval-Augmented Generation (RAG).
        </div>
      </div>

    </div>
  );
}

export default ChatCopilot;