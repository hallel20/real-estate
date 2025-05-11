import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { PropertyFilter as FilterType } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface PropertyFilterProps {
  onFilter: (filters: FilterType) => void;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<FilterType>({});
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (['minPrice', 'maxPrice', 'minBedrooms', 'minBathrooms', 'minArea'].includes(name)) {
      const numValue = value ? Number(value) : undefined;
      setFilters(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value || undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilter({});
  };

  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        {/* Basic Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow">
            <div className="relative">
              <Input
                name="keywords"
                placeholder="Search by keywords, location, etc."
                value={filters.keywords || ''}
                onChange={handleInputChange}
                fullWidth
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="whitespace-nowrap">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={toggleAdvanced}
              className="whitespace-nowrap"
            >
              {isAdvancedOpen ? 'Less Filters' : 'More Filters'}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select
                name="propertyType"
                label="Property Type"
                value={filters.propertyType || ''}
                onChange={handleInputChange}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'house', label: 'House' },
                  { value: 'apartment', label: 'Apartment' },
                  { value: 'land', label: 'Land' },
                  { value: 'commercial', label: 'Commercial' },
                ]}
                fullWidth
              />
              
              <Select
                name="status"
                label="Status"
                value={filters.status || ''}
                onChange={handleInputChange}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'for-sale', label: 'For Sale' },
                  { value: 'for-rent', label: 'For Rent' },
                ]}
                fullWidth
              />
              
              <div>
                <Input
                  name="minPrice"
                  label="Min Price"
                  type="number"
                  placeholder="Min $"
                  value={filters.minPrice || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>
              
              <div>
                <Input
                  name="maxPrice"
                  label="Max Price"
                  type="number"
                  placeholder="Max $"
                  value={filters.maxPrice || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>
              
              <div>
                <Input
                  name="minBedrooms"
                  label="Bedrooms"
                  type="number"
                  placeholder="Min bedrooms"
                  value={filters.minBedrooms || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>
              
              <div>
                <Input
                  name="minBathrooms"
                  label="Bathrooms"
                  type="number"
                  placeholder="Min bathrooms"
                  value={filters.minBathrooms || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>
              
              <div>
                <Input
                  name="minArea"
                  label="Area (sqft)"
                  type="number"
                  placeholder="Min area"
                  value={filters.minArea || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>
              
              <div>
                <Input
                  name="location"
                  label="Location"
                  placeholder="City, State, Zip"
                  value={filters.location || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PropertyFilter;