import React from "react";
import { Target, Eye, Users } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
            alt="Beautiful modern house"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Us
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Connecting You to Your Perfect Property.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Welcome to Real Estate App
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Real Estate App, we believe that finding the perfect property should be an exciting and seamless experience. Our platform is built on the foundation of trust, innovation, and a deep understanding of the real estate market. We are dedicated to empowering you with the best tools and insights to make informed decisions, whether you're buying, selling, or renting.
            </p>
          </div>

          {/* Mission and Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center text-blue-600 mb-3">
                <Target size={32} className="mr-3" />
                <h3 className="text-2xl font-semibold">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To simplify the real estate process by providing a comprehensive, user-friendly platform that connects individuals with their ideal properties and offers unparalleled support throughout their journey.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center text-green-600 mb-3">
                <Eye size={32} className="mr-3" />
                <h3 className="text-2xl font-semibold">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted and innovative real estate platform, recognized for our commitment to customer satisfaction, technological advancement, and positive community impact.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Why Choose Us?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Search className="h-8 w-8 text-indigo-500" />, title: "Extensive Listings", description: "Access a vast database of properties, updated regularly." },
                { icon: <Filter className="h-8 w-8 text-indigo-500" />, title: "Advanced Filters", description: "Narrow down your search with precise and easy-to-use filters." },
                { icon: <Users className="h-8 w-8 text-indigo-500" />, title: "Expert Support", description: "Our dedicated team is here to assist you every step of the way." },
                { icon: <ShieldCheck className="h-8 w-8 text-indigo-500" />, title: "Secure & Trusted", description: "We prioritize your security and data privacy." },
                { icon: <Smartphone className="h-8 w-8 text-indigo-500" />, title: "Mobile Friendly", description: "Access our platform anytime, anywhere, on any device." },
                { icon: <TrendingUp className="h-8 w-8 text-indigo-500" />, title: "Market Insights", description: "Stay informed with the latest market trends and data." },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                  <div className="p-3 bg-indigo-100 rounded-full mb-3">
                    {React.cloneElement(item.icon, { className: "h-8 w-8 text-indigo-600" })}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action or Final Message */}
          <div className="text-center">
            <p className="text-lg text-gray-700">
              Thank you for choosing us for your real estate journey. We're
              constantly working to improve our services and provide the best
              possible experience for our users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

// Helper icons if not already imported elsewhere, or ensure they are imported
const Search = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const Filter = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;
const ShieldCheck = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 12 15 22 5"></polyline></svg>;
const Smartphone = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const TrendingUp = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
