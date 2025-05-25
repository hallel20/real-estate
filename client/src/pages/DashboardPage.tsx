import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Home, User, Heart, MessageSquare, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePropertyStore } from '../store/propertyStore';
import { useInquiryStore } from '../store/inquiryStore';
import Button from '../components/ui/Button';
import AddProperty from "../components/property/AddProperty";

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const { userProperties, fetchUserProperties, favoriteProperties, properties, fetchProperties } = usePropertyStore();
  const { userInquiries, fetchUserInquiries } = useInquiryStore();
  
  const [activeTab, setActiveTab] = useState('properties');
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProperties(user.id);
      fetchUserInquiries(user.id);
      fetchProperties();
    }
  }, [isAuthenticated, user, fetchUserProperties, fetchUserInquiries, fetchProperties]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const favoritePropertiesList = properties.filter(p => favoriteProperties.includes(p.id));
  
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
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <nav>
              <button
                onClick={() => setActiveTab("properties")}
                className={`flex items-center w-full px-6 py-3 text-left ${
                  activeTab === "properties"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Home className="h-5 w-5 mr-3" />
                My Properties
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex items-center w-full px-6 py-3 text-left ${
                  activeTab === "favorites"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Heart className="h-5 w-5 mr-3" />
                Favorites
              </button>
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`flex items-center w-full px-6 py-3 text-left ${
                  activeTab === "inquiries"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                Inquiries
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center w-full px-6 py-3 text-left ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                Profile Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* My Properties Tab */}
          {activeTab === "properties" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  My Properties
                </h2>
                <AddProperty />
              </div>

              {userProperties.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No properties yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven't added any properties to your account.
                  </p>
                  <Button>
                    <Plus className="h-5 w-5 mr-1" />
                    Add Your First Property
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userProperties.map((property) => (
                    <div
                      key={property.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-3/4 p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded mb-2 ${
                                  property.status === "for-sale"
                                    ? "bg-blue-600 text-white"
                                    : "bg-green-600 text-white"
                                }`}
                              >
                                {property.status === "for-sale"
                                  ? "For Sale"
                                  : "For Rent"}
                              </span>
                              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {property.title}
                              </h3>
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                              {property.status === "for-rent"
                                ? `$${property.price.toLocaleString()}/mo`
                                : `$${property.price.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {property.description}
                          </p>
                          <div className="flex flex-wrap gap-4">
                            <Link to={`/properties/${property.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Favorite Properties
              </h2>

              {favoritePropertiesList.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven't added any properties to your favorites.
                  </p>
                  <Link to="/properties">
                    <Button>Browse Properties</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {favoritePropertiesList.map((property) => (
                    <div
                      key={property.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-3/4 p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded mb-2 ${
                                  property.status === "for-sale"
                                    ? "bg-blue-600 text-white"
                                    : "bg-green-600 text-white"
                                }`}
                              >
                                {property.status === "for-sale"
                                  ? "For Sale"
                                  : "For Rent"}
                              </span>
                              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {property.title}
                              </h3>
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                              {property.status === "for-rent"
                                ? `$${property.price.toLocaleString()}/mo`
                                : `$${property.price.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {property.description}
                          </p>
                          <div className="flex flex-wrap gap-4">
                            <Link to={`/properties/${property.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() =>
                                usePropertyStore
                                  .getState()
                                  .toggleFavorite(property.id)
                              }
                            >
                              <Heart className="h-4 w-4 mr-1 fill-red-500" />
                              Remove from Favorites
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === "inquiries" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                My Inquiries
              </h2>

              {userInquiries.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No inquiries yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven't sent any inquiries about properties.
                  </p>
                  <Link to="/properties">
                    <Button>Browse Properties</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userInquiries.map((inquiry) => {
                    const property = properties.find(
                      (p) => p.id === inquiry.propertyId
                    );
                    return (
                      <div
                        key={inquiry.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row">
                          {property && (
                            <div className="md:w-1/4 h-48 md:h-auto">
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="md:w-3/4 p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold text-gray-800">
                                {property ? property.title : "Property"}
                              </h3>
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                                  inquiry.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : inquiry.status === "responded"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {inquiry.status.charAt(0).toUpperCase() +
                                  inquiry.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">
                              {inquiry.message}
                            </p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span>
                                Sent on:{" "}
                                {new Date(
                                  inquiry.createdAt
                                ).toLocaleDateString()}
                              </span>
                              <Link to={`/properties/${inquiry.propertyId}`}>
                                <Button variant="outline" size="sm">
                                  View Property
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Profile Settings Tab */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Profile Settings
              </h2>

              <div className="bg-white rounded-lg shadow-md p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        defaultValue={user?.username}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        defaultValue={user?.email}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="profileImage"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      id="profileImage"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      defaultValue={user?.profileImage}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;