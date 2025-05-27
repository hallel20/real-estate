import React, { useState, useEffect, Suspense } from "react";
import { Property } from "../../../types";
import { useInquiryStore } from "../../../store/inquiryStore"; // Corrected store name and path
import { useChatStore } from "../../../store/chatStore";
import Spinner from "../../../components/Loading"; // Or your preferred loading component

// Lazy load tab content components
const MyInquiriesList = React.lazy(() => import("./MyInquiriesList"));
const MyChatsList = React.lazy(() => import("./MyChatsList"));

interface InquiriesTabProps {
  properties: Property[];
  currentUserId: string; // Expect currentUserId to be passed as a prop
}

const InquiriesTab: React.FC<InquiriesTabProps> = ({
  properties,
  currentUserId,
}) => {
  const [activeTab, setActiveTab] = useState<"inquiries" | "chats">(
    "inquiries"
  );

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
  } = useChatStore();

  useEffect(() => {
    if (currentUserId) {
      fetchUserInquiries(currentUserId);
    }
    // fetchUserChats typically doesn't need a userId if it fetches chats for the authenticated user
    fetchUserChats();
  }, [fetchUserInquiries, fetchUserChats, currentUserId]);

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "inquiries"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("inquiries")}
        >
          My Inquiries ({userInquiries.length})
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "chats"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("chats")}
        >
          My Chats ({userChats?.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "inquiries" && (
        <Suspense fallback={<Spinner />}>
          <MyInquiriesList
            userInquiries={userInquiries}
            properties={properties}
            isLoading={isLoadingInquiries}
            error={errorInquiries}
          />
        </Suspense>
      )}

      {activeTab === "chats" && (
        <Suspense fallback={<Spinner />}>
          <MyChatsList
            userChats={userChats}
            properties={properties}
            isLoading={isLoadingChats}
            error={errorChats}
            // currentUserId={currentUserId} // Pass if needed by MyChatsList
          />
        </Suspense>
      )}
    </div>
  );
};

export default InquiriesTab;
