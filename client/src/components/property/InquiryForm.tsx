import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useInquiryStore } from '../../store/inquiryStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

interface InquiryFormProps {
  propertyId: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ propertyId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { createInquiry, isLoading, error } = useInquiryStore();
  
  const [formData, setFormData] = useState({
    message: '',
    contactEmail: user?.email || '',
    contactPhone: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    message: '',
    contactEmail: '',
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { message: '', contactEmail: '' };
    
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
      isValid = false;
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Please enter your email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
      isValid = false;
    }
    
    setFormErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await createInquiry({
        propertyId,
        userId: user?.id || 'anonymous',
        message: formData.message,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      });
      
      setIsSubmitted(true);
      setFormData({
        message: '',
        contactEmail: user?.email || '',
        contactPhone: '',
      });
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Inquiry Sent Successfully!</h3>
        <p className="text-green-700 mb-4">
          Thank you for your interest. The property owner will contact you soon.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
        >
          Send Another Inquiry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Interested in this property?</h3>
      
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-blue-700 text-sm">
            You're sending this inquiry as a guest. <a href="/login" className="font-semibold underline">Login</a> to track your inquiries.
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Textarea
            name="message"
            label="Message"
            placeholder="I'm interested in this property and would like to schedule a viewing..."
            rows={4}
            value={formData.message}
            onChange={handleChange}
            error={formErrors.message}
            fullWidth
          />
          
          <Input
            name="contactEmail"
            label="Email"
            type="email"
            placeholder="Your email address"
            value={formData.contactEmail}
            onChange={handleChange}
            error={formErrors.contactEmail}
            fullWidth
          />
          
          <Input
            name="contactPhone"
            label="Phone (optional)"
            type="tel"
            placeholder="Your phone number"
            value={formData.contactPhone}
            onChange={handleChange}
            fullWidth
          />
          
          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            Send Inquiry
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;