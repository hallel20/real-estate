import React, { useState, useEffect, Suspense } from "react";
import { Property, User as UserType, Chat } from "../../../types";
import { useInquiryStore } from "../../../store/inquiryStore"; // Corrected store name and path
import { useChatStore } from "../../../store/chatStore";
import Spinner from "../../../components/Loading"; // Or your preferred loading component
import { useAuthStore } from "../../../store/authStore";

// Lazy load tab content components
const MyInquiriesList = React.lazy(() => import("./MyInquiriesList"));
const MyChatsList = React.lazy(() => import("./MyChatsList"));
const ChatInterface = React.lazy(() => import("./ChatInterface"));

interface InquiriesTabProps {
  properties: Property[];
  currentUserId: string; // Expect currentUserId to be passed as a prop
}

const InquiriesTab: React.FC<InquiriesTabProps> = ({ currentUserId }) => {
  const [activeTab, setActiveTab] = useState<
    "sent-inquiries" | "received-inquiries" | "chats"
  >("sent-inquiries");

  const {
    userInquiries,
    fetchUserInquiries,
    isLoading: isLoadingInquiries,
    error: errorInquiries,
  } = useInquiryStore();

  const {
    userChats,
    fetchUserChats,
    isLoading: isLoadingChats,
    error: errorChats,
    activeChatId,
    setActiveChat,
    activeChatMessages,
    activeChatDetail,
    isLoadingMessages,
    error: errorMessages, // This might be the same as errorChats, consider specific error for messages
  } = useChatStore();
  const { user: currentUser } = useAuthStore();

  // Helper to get other participant details for the ChatInterface header
  const getOtherParticipantDetailsFromChat = (
    chat: Chat | null,
    currentUserId: string
  ): Partial<UserType> & { propertyTitle?: string } => {
    if (!chat || !currentUserId)
      return { username: "Loading...", propertyTitle: "a property" };
    const otherUser =
      String(chat.sender_id) === currentUserId ? chat.receiver : chat.sender;
    return {
      ...otherUser,
      username: otherUser?.username || `User ${otherUser?.id}`,
      propertyTitle: chat.property?.title || "a property",
    };
  };

  useEffect(() => {
    if (currentUserId) {
      fetchUserInquiries(currentUserId);
    }
    // fetchUserChats typically doesn't need a userId if it fetches chats for the authenticated user
    fetchUserChats();
  }, [fetchUserInquiries, fetchUserChats, currentUserId]);

  // Effect to clear active chat when switching main tabs in InquiriesTab
  useEffect(() => {
    return () => {
      setActiveChat(null); // Clear active chat when component unmounts or activeTab changes
    };
  }, [activeTab, setActiveChat]);

  const sentInquiries = userInquiries.filter(
    (inq) => inq.user_id === currentUserId
  );
  const receivedInquiries = userInquiries.filter(
    (inq) => inq.user_id !== currentUserId
  );

  return (
    <div>
      {/* Sub-Tab Navigation for Inquiries/Chats */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "sent-inquiries"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => {
            setActiveTab("sent-inquiries");
            setActiveChat(null); // Clear active chat when switching sub-tabs
          }}
        >
          Sent Inquiries ({sentInquiries.length})
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "received-inquiries"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => {
            setActiveTab("received-inquiries");
            setActiveChat(null);
          }}
        >
          Received Inquiries ({receivedInquiries.length})
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "chats"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => {
            setActiveTab("chats");
            // Don't clear active chat here, as this is the chats tab itself
          }}
        >
          My Chats ({userChats?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "sent-inquiries" && (
        <Suspense fallback={<Spinner />}>
          <MyInquiriesList
            userInquiries={sentInquiries}
            isLoading={isLoadingInquiries}
            isSent={true}
            error={errorInquiries}
          />
        </Suspense>
      )}

      {activeTab === "received-inquiries" && (
        <Suspense fallback={<Spinner />}>
          <MyInquiriesList
            userInquiries={receivedInquiries}
            isLoading={isLoadingInquiries}
            error={errorInquiries}
          />
        </Suspense>
      )}

      {activeTab === "chats" && (
        <div className="h-[calc(100vh-var(--navbar-height,64px)-var(--dashboard-header-height,150px)-var(--tab-nav-height,50px))] overflow-y-auto">
          {" "}
          {/* Adjust heights as needed */}
          <Suspense fallback={<Spinner />}>
            {activeChatId && activeChatDetail && currentUser?.id ? (
              <ChatInterface
                chat={activeChatDetail}
                messages={activeChatMessages}
                currentUserId={String(currentUser.id)}
                isLoadingMessages={isLoadingMessages}
                errorMessages={errorMessages}
                onGoBack={() => {
                  setActiveChat(null)
                  fetchUserChats()
                }}
                otherParticipant={getOtherParticipantDetailsFromChat(
                  activeChatDetail,
                  String(currentUser.id)
                )}
              />
            ) : (
              <MyChatsList
                userChats={userChats}
                // properties={properties} // MyChatsList doesn't seem to use this directly anymore
                isLoading={isLoadingChats}
                error={errorChats}
                currentUserId={currentUserId}
                onChatSelect={(chatId) => setActiveChat(chatId)}
              />
            )}
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default InquiriesTab;
