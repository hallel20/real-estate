import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePropertyStore } from '../store/propertyStore';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilter from '../components/property/PropertyFilter';
import { PropertyFilter as FilterType } from '../types';
import { Grid, List } from 'lucide-react';

const PropertiesPage: React.FC = () => {
  const { properties, isLoading, error, setFilters } = usePropertyStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Extract filters from URL params
    const urlFilters: FilterType = {};
    
    const type = searchParams.get('type');
    if (type) urlFilters.propertyType = type as any;
    
    const status = searchParams.get('status');
    if (status) urlFilters.status = status as any;
    
    const minPrice = searchParams.get('minPrice');
    if (minPrice) urlFilters.minPrice = Number(minPrice);
    
    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) urlFilters.maxPrice = Number(maxPrice);
    
    const location = searchParams.get('location');
    if (location) urlFilters.location = location;
    
    const minBedrooms = searchParams.get('minBedrooms');
    if (minBedrooms) urlFilters.minBedrooms = Number(minBedrooms);
    
    const minBathrooms = searchParams.get('minBathrooms');
    if (minBathrooms) urlFilters.minBathrooms = Number(minBathrooms);
    
    const minArea = searchParams.get('minArea');
    if (minArea) urlFilters.minArea = Number(minArea);
    
    const keywords = searchParams.get('keywords');
    if (keywords) urlFilters.keywords = keywords;
    
    // Apply filters
    setFilters(urlFilters);
  }, [searchParams, setFilters]);

  const handleFilter = (filters: FilterType) => {
    // Update URL params
    const params = new URLSearchParams();
    
    if (filters.propertyType) params.set('type', filters.propertyType);
    if (filters.status) params.set('status', filters.status);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.location) params.set('location', filters.location);
    if (filters.minBedrooms) params.set('minBedrooms', filters.minBedrooms.toString());
    if (filters.minBathrooms) params.set('minBathrooms', filters.minBathrooms.toString());
    if (filters.minArea) params.set('minArea', filters.minArea.toString());
    if (filters.keywords) params.set('keywords', filters.keywords);
    
    setSearchParams(params);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
        <p className="text-gray-600">
          Browse our extensive collection of properties to find your perfect match.
        </p>
      </div>

      {/* Filters */}
      <PropertyFilter onFilter={handleFilter} />

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">
            {isLoading ? 'Loading properties...' : `${properties.length} properties found`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleViewMode}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            aria-label="Grid view"
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={toggleViewMode}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Properties Grid/List */}
      {!isLoading && properties.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters to see more results.
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          : "space-y-6"
        }>
          {properties.map((property) => (
            <div key={property.id} className={viewMode === 'list' ? "bg-white rounded-lg shadow-md overflow-hidden" : ""}>
              {viewMode === 'grid' ? (
                <PropertyCard property={property} />
              ) : (
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded mb-2 ${
                          property.status === 'for-sale' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                        }`}>
                          {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h3>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {property.status === 'for-rent' 
                          ? `$${property.price.toLocaleString()}/mo` 
                          : `$${property.price.toLocaleString()}`
                        }
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location.address}, {property.location.city}, {property.location.state}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>{property.features.bedrooms} Beds</span>
                        <span>{property.features.bathrooms} Baths</span>
                        <span>{property.features.area.toLocaleString()} sqft</span>
                      </div>
                      <button
                        onClick={() => window.location.href = `/properties/${property.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;