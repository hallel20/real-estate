import React from 'react';
import { Link } from 'react-router-dom';
import { Property, Inquiry } from '../../../types';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/Loading'; // Assuming you have a Spinner component

interface MyInquiriesListProps {
  userInquiries: Inquiry[];
  properties: Property[];
  isLoading: boolean;
  error: string | null;
}

const MyInquiriesList: React.FC<MyInquiriesListProps> = ({
  userInquiries,
  properties,
  isLoading,
  error,
}) => {
  const findProperty = (propertyId: string | number) =>
    properties.find((p) => p.id === propertyId);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 sr-only">
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
            const property = findProperty(inquiry.property_id);
            return (
              <div
                key={inquiry.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {property?.images?.[0] && (
                    <div className="md:w-1/4 h-48 md:h-auto">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`p-6 ${property?.images?.[0] ? "md:w-3/4" : "w-full"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {property ? property.title : "Property Not Found"}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${inquiry.status === "pending" ? "bg-yellow-100 text-yellow-800" : inquiry.status === "responded" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{inquiry.message}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Sent on: {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      {property && <Link to={`/properties/${inquiry.property_id}`}><Button variant="outline" size="sm">View Property</Button></Link>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyInquiriesList;