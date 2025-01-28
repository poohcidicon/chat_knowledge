'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button'
import './style.scss'
import { useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

export default function Home () {
  const [chats, setChats] = useState<Chat[]>([{
    id: '1',
    title: 'New Chat',
    messages: [
      {
        id: '1',
        content: 'Hello, how can I help you today?',
        role: 'assistant',
        timestamp: new Date(),
      },
      {
        id: '2',
        content: 'I have a question about your products.',
        role: 'user',
        timestamp: new Date(),
      },
      {
        id: '3',
        content: 'Sure, I can help you with that. What would you like to know?',
        role: 'assistant',
        timestamp: new Date(),
      }
    ],
    timestamp: new Date(),
  }]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentChat = chats.find((chat) => chat.id === activeChat);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Math.random().toString(36).substring(7),
      title: 'New Chat',
      messages: [],
      timestamp: new Date(),
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
    setInput('');
  };

  const deleteChat = (chatId: string) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
    if (activeChat === chatId) {
      setActiveChat(null);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;

    const currentChat = chats.find((chat) => chat.id === activeChat);
    if (!currentChat) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    const updatedChatWithUserMessage = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      title: currentChat.messages.length === 0 ? input.slice(0, 30) : currentChat.title,
    };

    setChats(
      chats.map((chat) => (chat.id === activeChat ? updatedChatWithUserMessage : chat))
    );
    setInput('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const assistantMessage: Message = {
      id: Math.random().toString(36).substring(7),
      content: 'This is the response from the assistant.',
      role: 'assistant',
      timestamp: new Date(),
    };

    const updatedChatWithResponse = {
      ...updatedChatWithUserMessage,
      messages: [...updatedChatWithUserMessage.messages, assistantMessage],
    };

    setChats(
      chats.map((chat) => (chat.id === activeChat ? updatedChatWithResponse : chat))
    );
    setIsTyping(false);
  };

  const groupMessagesByRole = (messages: Message[]) => {
    const groups: Message[][] = [];
    let currentGroup: Message[] = [];
    
    messages?.forEach((message, index) => {
      if (index === 0 || message.role !== messages[index - 1].role) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    return groups;
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chats, isTyping]);

  return (
    <div className="chat-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Button
            onClick={createNewChat}
            className="w-full"
            variant="outline"
          >
            New Chat
          </Button>
        </div>
        <div className="chat-history">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
              onClick={() => setActiveChat(chat.id)}
            >
              <MessageSquare className="chat-item-icon h-4 w-4" />
              <span className="truncate flex-1">{chat.title}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </aside>
      <main className="main-content">
        {activeChat ? (
          <>
            <div className="main-header">
              <h1 className="text-lg font-semibold">{currentChat?.title}</h1>
            </div>
            <div className="messages-container">
              {groupMessagesByRole(currentChat?.messages || []).map((group, index) => (
                <div
                  key={index}
                  className={`message-group ${group[0].role}`}
                >
                  {group.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${
                        message.role === 'user' ? 'user-message' : 'assistant-message'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
              ))}
              {isTyping && (
                <div className="message-group assistant">
                  <div className="message assistant-message">
                    <div className="typing-indicator">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
              <div className="input-wrapper">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault(); // Prevents new line on Enter
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  disabled={!activeChat || isTyping}

                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!activeChat || !input.trim() || isTyping}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a chat or start a new conversation
          </div>
        )}
      </main>
    </div>
  )
}

