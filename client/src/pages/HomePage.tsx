import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Building, MapPin } from 'lucide-react';
import { usePropertyStore } from '../store/propertyStore';
import PropertyCard from '../components/property/PropertyCard';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const { featuredProperties, fetchFeaturedProperties, isLoading } = usePropertyStore();

  useEffect(() => {
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
            alt="Modern home exterior"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Dream Home</h1>
            <p className="text-xl mb-8">
              Discover the perfect property from our extensive collection of homes, apartments, and commercial spaces.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Enter location, property type, or keywords..."
                  className="w-full px-4 py-3 rounded-md focus:outline-none text-gray-700"
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Link to="/properties" className="mt-2 md:mt-0 md:ml-2">
                <Button className="w-full md:w-auto">
                  <Search className="h-5 w-5 mr-2" />
                  Search Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties that offer exceptional value and amenities.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/properties">
              <Button variant="outline" size="lg">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Property Type</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're looking for a cozy apartment, spacious house, or commercial space, we have options for every need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Houses */}
            <Link to="/properties?type=house" className="group">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
                    alt="Houses"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 text-center">
                  <Home className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Houses</h3>
                  <p className="text-gray-600">Find your perfect family home</p>
                </div>
              </div>
            </Link>

            {/* Apartments */}
            <Link to="/properties?type=apartment" className="group">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                    alt="Apartments"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 text-center">
                  <Building className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Apartments</h3>
                  <p className="text-gray-600">Modern urban living spaces</p>
                </div>
              </div>
            </Link>

            {/* Commercial */}
            <Link to="/properties?type=commercial" className="group">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg"
                    alt="Commercial"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 text-center">
                  <Building className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Commercial</h3>
                  <p className="text-gray-600">Prime business locations</p>
                </div>
              </div>
            </Link>

            {/* Land */}
            <Link to="/properties?type=land" className="group">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg"
                    alt="Land"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Land</h3>
                  <p className="text-gray-600">Build your dream from scratch</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Property?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream properties with us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/properties">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Browse Properties
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;