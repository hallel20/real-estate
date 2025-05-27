import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { Property } from "../../types";
import { usePropertyStore } from "../../store/propertyStore";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { favoriteProperties, toggleFavorite } = usePropertyStore();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favoriteProperties.includes(property.id));
  }, [favoriteProperties, property]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const formatPrice = (price: number) => {
    if (property.status === "for-rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <Link to={`/properties/${property.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                property.status === "for-sale"
                  ? "bg-blue-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {property.status === "for-sale" ? "For Sale" : "For Rent"}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md transition-colors duration-300 hover:bg-gray-100"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-start space-x-1 text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm line-clamp-1">
              {property.location.address}, {property.location.city},{" "}
              {property.location.state}
            </span>
          </div>

          {/* Features */}
          <div className="flex items-center justify-between text-gray-600 border-t border-gray-100 pt-3">
            <div className="flex items-center space-x-1">
              <Bed className="h-4 w-4" />
              <span className="text-sm">{property.features.bedrooms} Beds</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="h-4 w-4" />
              <span className="text-sm">
                {property.features.bathrooms} Baths
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Square className="h-4 w-4" />
              <span className="text-sm">
                {property.features.area.toLocaleString()} sqft
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
