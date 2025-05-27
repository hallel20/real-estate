import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';

const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Form submitted (this is a placeholder)!');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 to-cyan-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // A generic contact/office image
            alt="People working in an office"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              We're here to help and answer any question you might have. We look forward to hearing from you!
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    label="Full Name"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    fullWidth
                  />
                </div>
                <div>
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    fullWidth
                  />
                </div>
                <div>
                  <Input
                    label="Subject"
                    name="subject"
                    type="text"
                    placeholder="Inquiry about..."
                    required
                    fullWidth
                  />
                </div>
                <div>
                  <Textarea
                    label="Your Message"
                    name="message"
                    rows={5}
                    placeholder="Write your message here..."
                    required
                    fullWidth
                  />
                </div>
                <Button type="submit" className="w-full flex items-center justify-center">
                  <Send size={18} className="mr-2" /> Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start">
                    <MapPin size={20} className="text-teal-600 mr-3 mt-1 flex-shrink-0" />
                    <span>123 Real Estate Ave, Suite 400, Property City, ST 54321</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={20} className="text-teal-600 mr-3 flex-shrink-0" />
                    <span>(123) 456-7890</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={20} className="text-teal-600 mr-3 flex-shrink-0" />
                    <span>contact@realestateapp.com</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 aspect-video">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Location</h2>
                {/* In a real app, this would be an embedded map component */}
                <div className="w-full h-4/5 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  <MapPin size={40} className="mr-2" /> Map Placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;