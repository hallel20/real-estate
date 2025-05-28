import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Calendar, Heart, Share2 } from 'lucide-react';
import { usePropertyStore } from '../store/propertyStore';
import PropertyGallery from '../components/property/PropertyGallery';
import InquiryForm from '../components/property/InquiryForm';
import Button from '../components/ui/Button';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentProperty, fetchPropertyById, isLoading, error, favoriteProperties, toggleFavorite } = usePropertyStore();
  
  useEffect(() => {
    if (id) {
      fetchPropertyById(id);
    }
  }, [id, fetchPropertyById]);
  
  const isFavorite = id ? favoriteProperties.includes(id) : false;
  
  const handleFavoriteToggle = () => {
    if (id) {
      toggleFavorite(id);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentProperty?.title || 'Property Listing',
        text: currentProperty?.description || 'Check out this property!',
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <Link to="/properties">
          <Button variant="outline">Back to Properties</Button>
        </Link>
      </div>
    );
  }
  
  if (!currentProperty) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
          Property not found
        </div>
        <Link to="/properties">
          <Button variant="outline">Back to Properties</Button>
        </Link>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link to="/properties" className="hover:text-blue-600">
                Properties
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-700">{currentProperty.title}</li>
          </ol>
        </nav>
      </div>

      {/* Property Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <div className="flex items-center mb-2">
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded mr-2 ${
                currentProperty.status === "for-sale"
                  ? "bg-blue-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {currentProperty.status === "for-sale" ? "For Sale" : "For Rent"}
            </span>
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-800`}
            >
              {currentProperty.propertyType.charAt(0).toUpperCase() +
                currentProperty.propertyType.slice(1)}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentProperty.title}
          </h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-1" />
            <span>
              {currentProperty.location.address},{" "}
              {currentProperty.location.city}, {currentProperty.location.state}{" "}
              {currentProperty.location.zipCode}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {currentProperty.status === "for-rent"
              ? `₦${currentProperty.price.toLocaleString()}/yr`
              : `₦${currentProperty.price.toLocaleString()}`}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFavoriteToggle}
              className={`flex items-center ${
                isFavorite ? "text-red-500 border-red-500" : ""
              }`}
            >
              <Heart
                className={`h-4 w-4 mr-1 ${isFavorite ? "fill-red-500" : ""}`}
              />
              {isFavorite ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Property Gallery */}
      <div className="mb-8">
        <PropertyGallery
          images={currentProperty.images}
          title={currentProperty.title}
        />
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Property Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Bed className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Bedrooms</span>
                <span className="text-lg font-semibold">
                  {currentProperty.features.bedrooms}
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Bath className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Bathrooms</span>
                <span className="text-lg font-semibold">
                  {currentProperty.features.bathrooms}
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Square className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Area</span>
                <span className="text-lg font-semibold">
                  {currentProperty.features.area.toLocaleString()} sqft
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Year Built</span>
                <span className="text-lg font-semibold">
                  {currentProperty.features.yearBuilt || "N/A"}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 mb-6 whitespace-pre-line">
                {currentProperty.description}
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Amenities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentProperty.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Location
            </h2>
            <div className="aspect-video bg-gray-200 rounded-lg mb-4">
              {/* In a real app, this would be a map component */}
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Map view would be displayed here
                </span>
              </div>
            </div>
            <p className="text-gray-700">
              {currentProperty.location.address},{" "}
              {currentProperty.location.city}, {currentProperty.location.state}{" "}
              {currentProperty.location.zipCode}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Contact Form */}
          <InquiryForm propertyId={currentProperty.id} />

          {/* Property Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Property Information
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-600">Property ID:</span>
                <span className="font-medium">{currentProperty.id}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Property Type:</span>
                <span className="font-medium">
                  {currentProperty.propertyType.charAt(0).toUpperCase() +
                    currentProperty.propertyType.slice(1)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">
                  {currentProperty.status === "for-sale"
                    ? "For Sale"
                    : "For Rent"}
                </span>
              </li>
              {currentProperty.features.yearBuilt && (
                <li className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-medium">
                    {currentProperty.features.yearBuilt}
                  </span>
                </li>
              )}
              {currentProperty.features.parking !== undefined && (
                <li className="flex justify-between">
                  <span className="text-gray-600">Parking:</span>
                  <span className="font-medium">
                    {currentProperty.features.parking} spaces
                  </span>
                </li>
              )}
              <li className="flex justify-between">
                <span className="text-gray-600">Listed:</span>
                <span className="font-medium">
                  {formatDate(currentProperty.createdAt)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {formatDate(currentProperty.updatedAt)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;