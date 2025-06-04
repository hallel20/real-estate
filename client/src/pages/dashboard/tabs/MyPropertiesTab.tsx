import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react"; // Import Star icon
import { Property } from "../../../types";
import Button from "../../../components/ui/Button";
import AddProperty from "../../../components/property/AddProperty";
import EditProperty from "../../../components/property/EditProperty";
import Spinner from "../../../components/Loading";
import DeleteProperty from "../../../components/property/DeleteProperty";
import { useAuthStore } from "../../../store/authStore"; // To get user role
import { usePropertyStore } from "../../../store/propertyStore";

interface MyPropertiesTabProps {
  userProperties: Property[];
  isLoading?: boolean;
}

const MyPropertiesTab: React.FC<MyPropertiesTabProps> = ({
  userProperties,
  isLoading,
}) => {
  const { user } = useAuthStore(); // Get the authenticated user
  const { toggleFeatureProperty } = usePropertyStore();

  const handleFeatureProperty = (propertyId: string) => {
    toggleFeatureProperty(propertyId);
    console.log(`Toggle feature for property ID: ${propertyId}`);
    // Example: await propertyStore.toggleFeatureProperty(propertyId);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">My Properties</h2>
        <AddProperty />
      </div>

      {isLoading ? (
        <Spinner />
      ) : userProperties.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No properties yet
          </h3>
          <p className="text-gray-600 mb-4">
            You haven't added any properties to your account.
          </p>
          <AddProperty title="Add Your First Property" />
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
                        ? `₦${property.price.toLocaleString()}/yr`
                        : `₦${property.price.toLocaleString()}`}
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
                    <EditProperty property={property} />
                    <DeleteProperty property={property} />
                    {user?.role === "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFeatureProperty(property.id)}
                        className={`flex items-center ${
                          property.is_featured // Assuming property has an is_featured flag
                            ? "text-yellow-500 border-yellow-300 hover:bg-yellow-50"
                            : "text-gray-600 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 mr-1 ${
                            property.is_featured ? "fill-yellow-400" : ""
                          }`}
                        />
                        {property.is_featured ? "Unfeature" : "Feature"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesTab;
