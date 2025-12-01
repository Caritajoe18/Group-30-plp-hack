import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  message: string;
  sender_id: string;
  sender_name: string;
  created_at: string;
  delivery_status: 'sending' | 'sent' | 'delivered' | 'failed';
}

const Chat = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, authLoading, navigate]);

  // Mock initial messages for demo purposes
  useEffect(() => {
    if (user) {
      const initialMessages: ChatMessage[] = [
        {
          id: '1',
          message: 'Hello! How can I help you today?',
          sender_id: 'support',
          sender_name: 'Support Team',
          created_at: new Date().toISOString(),
          delivery_status: 'delivered'
        }
      ];
      setMessages(initialMessages);
    }
  }, [user]);

  // Handle sending a new message
  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      sender_id: 'user',
      sender_name: 'You',
      created_at: new Date().toISOString(),
      delivery_status: 'sending'
    };

    // Optimistically add the message
    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, delivery_status: 'delivered' }
            : msg
        )
      );
    }, 1000);
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="font-semibold">Chat</h1>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender_id === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-none'
                : 'bg-muted rounded-bl-none'
                }`}
            >
              {msg.sender_id !== 'user' && (
                <div className="font-semibold text-xs mb-1">
                  {msg.sender_name}
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.message}</div>
              <div className="flex justify-end items-center mt-1 space-x-1">
                <span className="text-xs opacity-70">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.sender_id === 'user' && (
                  <span className="text-xs">
                    {msg.delivery_status === 'sending' && '🕒'}
                    {msg.delivery_status === 'delivered' && '✓✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="relative flex items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 pr-12"
          />
          <Button
            onClick={sendMessage}
            disabled={!message.trim()}
            size="icon"
            className="absolute right-2 h-8 w-8 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Character count indicator */}
        {message.length > 1800 && (
          <div className="text-xs text-muted-foreground text-right mt-1">
            {message.length}/2000 characters
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;