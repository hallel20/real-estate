import React from "react";
import { Chat, User } from "../../../types"; // Assuming User type is available
import Spinner from "../../../components/Loading"; // Assuming you have a Spinner component
import moment from "moment";
import md5 from "js-md5";

interface MyChatsListProps {
  userChats: Chat[];
  isLoading: boolean;
  error: string | null;
  currentUserId: string; // Make currentUserId required
  onChatSelect: (chatId: number) => void; // Callback to select a chat
}

const getIsRead = (chat: Chat, currentUserId: string): boolean => {
  if (!chat.is_read) {
    if (String(chat.last_message?.sender_id) === String(currentUserId)) {
      return true;
    }
    return false;
  }
  return true;
};

// Helper to determine the other participant in the chat
// This is a simplified version. Ideally, backend provides rich sender/receiver objects with chat.
const getOtherParticipant = (
  chat: Chat,
  currentUserId: string
): Partial<User> & { isPropertyOwner?: boolean } => {
  let otherParticipantId: string | number | undefined;
  let isPropertyOwner = false;
  let participantDetails: Partial<User> = {};

  // Determine the ID of the other participant
  if (String(chat.sender_id) === String(currentUserId)) {
    otherParticipantId = chat.receiver_id;
  } else if (String(chat.receiver_id) === String(currentUserId)) {
    otherParticipantId = chat.sender_id;
  } else {
    // This case should ideally not happen if currentUserId is always one of the participants
    console.warn(
      "Current user is not part of this chat:",
      chat.id,
      currentUserId
    );
    return { username: "Error: User not in chat", isPropertyOwner };
  }

  // Now, try to get the details for otherParticipantId
  // Prioritize direct sender/receiver objects if backend provides them and matches otherParticipantId
  if (chat.sender && String(chat.sender.id) === String(otherParticipantId)) {
    participantDetails = chat.sender;
  } else if (
    chat.receiver &&
    String(chat.receiver.id) === String(otherParticipantId)
  ) {
    participantDetails = chat.receiver;
  }
  // Fallback to property owner if applicable and matches otherParticipantId
  else if (
    chat.property?.user &&
    String(chat.property.user_id) === String(otherParticipantId)
  ) {
    participantDetails = chat.property.user;
    isPropertyOwner = true;
  }
  // Generic fallback if no specific user object is found for otherParticipantId
  else if (otherParticipantId !== undefined) {
    participantDetails = {
      id: String(otherParticipantId), // Store the ID
      username: `User ${String(otherParticipantId).slice(0, 5)}`, // Placeholder username
    };
  }

  // Ensure a username exists
  if (!participantDetails.username) {
    participantDetails.username = participantDetails.id
      ? `User ${String(participantDetails.id).slice(0, 5)}`
      : "Chat Participant";
  }

  return { ...participantDetails, isPropertyOwner };
};

const getProfileImageUrl = (user: any) => {
  if (user?.profile_image) {
    return user.profile_image;
  }
  if (user?.email) {
    const emailHash = md5.md5(user.email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${emailHash}?d=404`; // 404 will allow fallback
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.username?.charAt(0) || "U"
  )}&background=random`;
};

const MyChatsList: React.FC<MyChatsListProps> = ({
  userChats,
  isLoading,
  error,
  currentUserId,
  onChatSelect,
}) => {
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No chats yet
          </h3>
          <p className="text-gray-600 mb-4">
            You haven't started any chats. Chats are typically initiated when a
            property owner responds to your inquiry or you respond to theirs.
          </p>
          {/* Optional: Link to browse properties if desired */}
          {/* <Link to="/properties"><Button>Browse Properties</Button></Link> */}
        </div>
      ) : (
        <div className="space-y-3">
          {userChats.map((chat) => {
            const property = chat.property;
            const currentChatOtherParticipant = getOtherParticipant(
              chat,
              currentUserId
            );
            const isUnread =
              !getIsRead(chat, currentUserId) &&
              String(chat.last_message_sender_id) !== currentUserId &&
              chat.last_message_sender_id != null;

            return (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className="block p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                role="button" // for accessibility
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={getProfileImageUrl(currentChatOtherParticipant)}
                      alt={currentChatOtherParticipant?.username || "User"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p
                        className={`text-md font-semibold text-gray-800 truncate ${
                          isUnread ? "font-bold" : ""
                        }`}
                      >
                        {currentChatOtherParticipant?.username || "Chat User"}
                      </p>
                      <p
                        className={`text-xs ${
                          isUnread
                            ? "text-blue-600 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {moment(chat.updated_at).fromNow()}
                      </p>
                    </div>
                    {/* Display last message snippet */}
                    <p
                      className={`text-sm text-gray-600 truncate ${
                        isUnread ? "font-semibold text-gray-800" : ""
                      }`}
                    >
                      {chat.last_message?.message ||
                        (property
                          ? `Chat about: ${property.title}`
                          : "Start chatting...")}
                    </p>
                    {/* Optional: Display property title below snippet if needed */}
                    {/* <p className="text-xs text-gray-500 truncate">{property ? property.title : ""}</p> */}
                  </div>
                  {isUnread && (
                    <span
                      className="ml-auto flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"
                      aria-label="Unread message"
                    ></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyChatsList;
