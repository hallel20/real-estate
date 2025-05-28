import React, { useEffect, Suspense, lazy } from "react";
import { Navigate, Routes, Route, NavLink, Link } from "react-router-dom";
import { Home, User, Heart, MessageSquare, Edit } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { usePropertyStore } from "../../store/propertyStore";
import { useInquiryStore } from "../../store/inquiryStore";
import Button from "../../components/ui/Button";
import Spinner from "../../components/Loading";

// Dynamically import tab components
const MyPropertiesTab = lazy(() => import("./tabs/MyPropertiesTab"));
const FavoritesTab = lazy(() => import("./tabs/FavoritesTab"));
const InquiriesTab = lazy(() => import("./tabs/InquiriesTab"));
const ProfileSettingsTab = lazy(() => import("./tabs/ProfileSettingsTab"));

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const {
    userProperties,
    fetchUserProperties,
    fetchFavoriteProperties,
    favoriteProperties,
    properties,
    fetchProperties,
    isLoading: isPropertiesLoading,
  } = usePropertyStore();
  const { fetchUserInquiries } = useInquiryStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProperties();
      fetchFavoriteProperties();
      fetchUserInquiries(user.id);
      fetchProperties(); // Fetch all properties to resolve favorite details and inquiry property details
    }
  }, [
    isAuthenticated,
    user,
    fetchUserProperties,
    fetchUserInquiries,
    fetchFavoriteProperties,
    fetchProperties,
  ]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const favoritePropertiesList = properties.filter((p) =>
    favoriteProperties.includes(p.id)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* User Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <img
                  src={
                    user?.profileImage ||
                    "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg"
                  }
                  alt={user?.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {user?.username}
              </h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <Link to="profile" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <nav>
              <NavLink
                to="properties"
                className={({ isActive }) =>
                  `flex items-center w-full px-6 py-3 text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <Home className="h-5 w-5 mr-3" />
                My Properties
              </NavLink>
              <NavLink
                to="favorites"
                className={({ isActive }) =>
                  `flex items-center w-full px-6 py-3 text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <Heart className="h-5 w-5 mr-3" />
                Favorites
              </NavLink>
              <NavLink
                to="inquiries"
                className={({ isActive }) =>
                  `flex items-center w-full px-6 py-3 text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                Inquiries
              </NavLink>
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  `flex items-center w-full px-6 py-3 text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <User className="h-5 w-5 mr-3" />
                Profile Settings
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route index element={<Navigate to="properties" replace />} />
              <Route
                path="properties"
                element={
                  <MyPropertiesTab
                    isLoading={isPropertiesLoading}
                    userProperties={userProperties}
                  />
                }
              />
              <Route
                path="favorites"
                element={
                  <FavoritesTab
                    favoritePropertiesList={favoritePropertiesList}
                  />
                }
              />
              <Route
                path="inquiries"
                element={
                  <InquiriesTab
                    currentUserId={user?.id}
                    properties={properties}
                  />
                }
              />
              <Route
                path="profile"
                element={
                  user ? (
                    <ProfileSettingsTab user={user} />
                  ) : (
                    <Navigate to="properties" replace />
                  )
                }
              />
              <Route path="*" element={<Navigate to="properties" replace />} />{" "}
              {/* Fallback for unknown sub-routes */}
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
