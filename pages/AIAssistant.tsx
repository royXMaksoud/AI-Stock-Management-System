import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, BrainCircuit, Loader2, X, Bot, User } from 'lucide-react';
import { generateResponse } from '../services/geminiService';
import { Message } from '../types';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am your Nexus AI Warehouse Assistant. I can help you identify products from images, analyze stock levels, or answer complex logistical questions. How can I assist you today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [useThinking, setUseThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Keep image in local state for the API call, then clear it from UI input area
    const imageToSend = selectedImage;
    handleClearImage();

    try {
      const prompt = userMessage.text || (imageToSend ? "Analyze this image." : "");
      const responseText = await generateResponse(prompt, imageToSend, useThinking);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        isThinking: useThinking
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error processing your request. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Nexus AI Assistant</h2>
            <p className="text-xs text-slate-500">Powered by Gemini 3 Pro Preview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <label className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all ${useThinking ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-500 ring-offset-1' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <input 
              type="checkbox" 
              checked={useThinking} 
              onChange={(e) => setUseThinking(e.target.checked)}
              className="hidden"
            />
            <BrainCircuit size={16} />
            <span>Thinking Mode</span>
          </label>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`space-y-2`}>
                 {msg.image && (
                  <img src={msg.image} alt="Uploaded" className="max-w-xs rounded-lg border border-slate-200 shadow-sm" />
                )}
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                {msg.role === 'model' && msg.isThinking && (
                    <div className="flex items-center gap-1 text-xs text-violet-600 font-medium px-2">
                        <BrainCircuit size={12} />
                        <span>Thought deeply about this</span>
                    </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[70%]">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                <Loader2 className="animate-spin text-indigo-600" size={20} />
                <span className="text-sm text-slate-500">
                    {useThinking ? "Reasoning deeply (this may take a moment)..." : "Analyzing..."}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {selectedImage && (
          <div className="mb-4 flex items-start gap-4 animate-fade-in">
            <div className="relative group">
              <img src={selectedImage} alt="Preview" className="h-20 rounded-lg border border-slate-200" />
              <button 
                onClick={handleClearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
            <div className="text-sm text-slate-500 pt-2">
              Image attached. Add a prompt to analyze it.
            </div>
          </div>
        )}
        
        <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Upload Image"
          >
            <ImageIcon size={20} />
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={useThinking ? "Ask a complex question requiring deep reasoning..." : "Ask about stock, or analyze an image..."}
            className="flex-1 bg-transparent border-none resize-none focus:ring-0 py-2 max-h-32 text-slate-900 placeholder:text-slate-400 text-sm"
            rows={1}
            style={{ minHeight: '40px' }}
          />
          
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-center">
            <p className="text-[10px] text-slate-400">
                Nexus AI can make mistakes. Check important inventory data.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
