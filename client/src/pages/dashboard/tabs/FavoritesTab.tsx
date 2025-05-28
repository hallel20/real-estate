import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Property } from '../../../types';
import Button from '../../../components/ui/Button';
import { usePropertyStore } from '../../../store/propertyStore';

interface FavoritesTabProps {
  favoritePropertiesList: Property[];
}

const FavoritesTab: React.FC<FavoritesTabProps> = ({ favoritePropertiesList }) => {
  return (
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
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() =>
                        usePropertyStore.getState().toggleFavorite(property.id)
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
  );
};

export default FavoritesTab;