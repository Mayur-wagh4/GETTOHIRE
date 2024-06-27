import React from 'react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  return (
    <section id="pricing" className=" mt-10 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold  mb-4">Our Pricing Plans</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose the perfect plan for your needs and start your journey with us today.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <PricingCard 
            title="For Candidates"
            price="99"
            features={[
              "Access to all job listings",
              "Personalized job alerts",
              "Resume building tools",
              "Direct application to employers"
            ]}
            link="/candidate-register"
          />
          <PricingCard 
            title="For Restaurants"
            price="1999"
            features={[
              "Unlimited job postings",
              "Access to candidate database",
              "Advanced filtering options",
              "Dedicated account manager"
            ]}
            link="/restaurant-register"
            featured={true}
          />
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({ title, price, features, link, featured = false }) => {
  return (
    <div className={`w-full max-w-sm rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${featured ? 'bg-gray-800 text-white' : 'bg-white  text-black'}`}>
      <div className="px-6 py-8">
        <h3 className={`text-2xl font-semibold mb-4 ${featured ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
        <div className={`text-5xl font-bold mb-6 ${featured ? 'text-deep-orange-400' : 'text-gray-800'}`}>
          ₹{price}<span className="text-lg font-normal">/-</span>
        </div>
        <ul className="mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center mb-3">
              <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 20 20">
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <Link 
          to={link} 
          className={`block w-full py-3 px-6 text-center rounded-full font-semibold transition-colors duration-300 ${
            featured 
              ? 'bg-white  text-black hover:bg-deep-orange-600' 
              : 'bg-gray-800  text-white hover:bg-deep-orange-600' 
          }`}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default PricingSection;