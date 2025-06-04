import React, { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../../../store/chatStore';
import { Chat, Message, User as UserType } from '../../../types';
import Spinner from '../../../components/Loading';
import { ArrowLeft, Send } from 'lucide-react';
import moment from 'moment';

interface ChatMessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  senderImage?: string;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isOwnMessage, senderImage }) => {
  return (
    <div className={`flex my-2 items-end ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <img
          src={senderImage || `https://ui-avatars.com/api/?name=${message.sender_id.toString().charAt(0)}&background=random&size=32`}
          alt="Sender"
          className="w-8 h-8 rounded-full mr-2 mb-1"
        />
      )}
      <div
        className={`max-w-[70%] px-3 py-2 rounded-xl shadow ${
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm break-words">{message.message}</p>
        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-200' : 'text-gray-500'} text-right`}>
          {moment(message.created_at).format('LT')}
        </p>
      </div>
    </div>
  );
};

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  otherParticipantDetails?: Partial<UserType>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, otherParticipantDetails }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-gray-50">
      {messages.map((msg) => (
        <ChatMessageItem
          key={msg.id}
          message={msg}
          isOwnMessage={String(msg.sender_id) === currentUserId}
          senderImage={otherParticipantDetails?.profileImage}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

interface MessageInputProps {
  chatId: number;
  onMessageSent: () => void; // Callback after message is sent
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId, onMessageSent }) => {
  const [newMessage, setNewMessage] = useState('');
  const { sendMessage, isLoading: isSendingMessage } = useChatStore(state => ({ // Renamed to avoid conflict
    sendMessage: state.sendMessage,
    isLoading: state.isLoadingMessages, // Assuming this reflects sending status or add a specific one
  }));

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    try {
      await sendMessage(chatId, newMessage.trim());
      setNewMessage('');
      onMessageSent(); // Call the callback
    } catch (error) {
      console.error('Failed to send message:', error);
      // TODO: Show error to user
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 outline-none px-4"
          disabled={isSendingMessage}
        />
        <button
          type="submit"
          className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center"
          disabled={isSendingMessage || newMessage.trim() === ''}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

interface ChatInterfaceProps {
  chat: Chat;
  messages: Message[];
  currentUserId: string;
  isLoadingMessages: boolean;
  errorMessages: string | null;
  onGoBack: () => void;
  otherParticipant: Partial<UserType> & { propertyTitle?: string };
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chat, messages, currentUserId, isLoadingMessages, errorMessages, onGoBack, otherParticipant
}) => {
  const { setActiveChat } = useChatStore(); // To reload messages if needed after sending

  return (
    <div className="flex flex-col h-full"> {/* Ensure it takes full height of its container */}
      <header className="flex items-center p-3 border-b bg-gray-50 sticky top-0 z-10">
        <button onClick={onGoBack} className="p-2 rounded-full hover:bg-gray-200 mr-2">
          <ArrowLeft size={20} />
        </button>
        <img
          src={otherParticipant?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant?.username?.charAt(0) || 'U')}&background=random&size=40`}
          alt={otherParticipant?.username}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <h2 className="font-semibold text-gray-800">{otherParticipant?.username}</h2>
          <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-xs md:max-w-sm">
            Chat about: {otherParticipant.propertyTitle}
          </p>
        </div>
      </header>

      {isLoadingMessages && !messages.length ? (
        <div className="flex-1 flex items-center justify-center"><Spinner /></div>
      ) : errorMessages ? (
        <div className="flex-1 flex items-center justify-center text-red-500 p-4">Error: {errorMessages}</div>
      ) : (
        <MessageList messages={messages} currentUserId={currentUserId} otherParticipantDetails={otherParticipant} />
      )}

      <MessageInput chatId={chat.id} onMessageSent={() => setActiveChat(chat.id)} />
    </div>
  );
};

export default ChatInterface;