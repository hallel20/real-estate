import React from 'react';
import { Link } from 'react-router-dom';
import { Property, Chat } from '../../../types';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/Loading'; // Assuming you have a Spinner component

interface MyChatsListProps {
  userChats: Chat[];
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  // currentUserId?: string; // If needed for findOtherUserInChat
}

const MyChatsList: React.FC<MyChatsListProps> = ({
  userChats,
  properties,
  isLoading,
  error,
  // currentUserId,
}) => {
  const findProperty = (propertyId: string | number) =>
    properties.find((p) => p.id === propertyId);

  // Placeholder for finding other user details if needed for chat display
  // const findOtherUserInChat = (chat: Chat) => {
  //   if (!currentUserId) return null;
  //   const otherUserId = chat.sender_id === currentUserId ? chat.reciever_id : chat.sender_id;
  //   return { id: otherUserId, username: `User ${String(otherUserId).substring(0, 5)}` };
  // };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 sr-only">
        My Chats
      </h2>
      {userChats.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No chats yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't started any chats. Chats are typically initiated when a property owner responds to your inquiry or you respond to theirs.
          </p>
          <Link to="/properties"><Button>Browse Properties</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userChats.map((chat) => {
            const property = findProperty(chat.property_id);
            // const otherUser = findOtherUserInChat(chat);
            return (
              <div key={chat.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Chat about: {property ? property.title : "Property Not Found"}</h3>
                  {/* {otherUser && <span className="text-sm text-gray-600">With: {otherUser.username}</span>} */}
                </div>
                <p className="text-gray-600 text-sm mb-4">Last activity: {new Date(chat.updated_at).toLocaleString()}</p>
                <Link to={`/dashboard/chat/${chat.id}`}><Button variant="outline" size="sm">Open Chat</Button></Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyChatsList;