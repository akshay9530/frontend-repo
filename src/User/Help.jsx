import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import Header from '../components/Header';
import { FiHelpCircle, FiTruck, FiPackage, FiRefreshCw, FiPhone, FiMail, FiMessageSquare, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

const Help = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      id: 'shipping',
      title: 'Shipping & Delivery',
      icon: <FiTruck />,
      faqs: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. International shipping takes 10-14 business days.'
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Yes! We offer free standard shipping on all orders over $50 within the continental United States.'
        },
        {
          question: 'How can I track my order?',
          answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order from your account dashboard.'
        }
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Exchanges',
      icon: <FiRefreshCw />,
      faqs: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some items like cosmetics may have different return policies.'
        },
        {
          question: 'How do I return an item?',
          answer: 'You can initiate a return from your account dashboard. Print the return label, pack the item securely, and drop it off at any authorized shipping location.'
        },
        {
          question: 'How long do refunds take?',
          answer: 'Once we receive your return, refunds are processed within 5-7 business days. The time it takes for the refund to appear in your account depends on your bank.'
        }
      ]
    },
    {
      id: 'products',
      title: 'Products & Orders',
      icon: <FiPackage />,
      faqs: [
        {
          question: 'How do I place an order?',
          answer: 'Browse our products, add items to your cart, and proceed to checkout. You can checkout as a guest or create an account for faster future purchases.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 1 hour of placing it. After that, please contact customer service immediately.'
        },
        {
          question: 'Are your products authentic?',
          answer: 'Yes! We are an authorized retailer for all brands we carry. All products are 100% authentic and come with manufacturer warranties.'
        }
      ]
    }
  ];

  const supportMethods = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: <FiMessageSquare className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      action: 'Start Chat',
      available: '24/7',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Phone Support',
      description: 'Call our customer service',
      icon: <FiPhone className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      action: '1-800-123-4567',
      available: 'Mon-Fri, 9AM-6PM EST',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Email Support',
      description: 'Send us an email',
      icon: <FiMail className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      action: 'support@example.com',
      available: 'Response within 24 hours',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const toggleFaq = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setActiveFaq(activeFaq === key ? null : key);
  };

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="grow py-4 sm:py-6 md:py-8 lg:py-12 xl:py-16">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 mb-3 sm:mb-4 md:mb-5 rounded-full bg-green-100">
              <FiHelpCircle className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-green-600" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
              How can we help you?
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 px-4">
              Find answers to common questions or contact our support team
            </p>

            {/* Search Bar */}
            <div className="max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-6">
              <div className="relative">
                <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help topics..."
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-lg transition-all duration-300 text-sm sm:text-base md:text-lg"
                />
              </div>
            </div>
          </div>

          {/* Support Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 px-4 sm:px-0">
            {supportMethods.map((method, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-5 md:p-6 text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-3 sm:mb-4 rounded-full bg-linear-to-r ${method.color} text-white`}>
                  {method.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg md:text-xl lg:text-xl text-gray-900 mb-1 sm:mb-2">{method.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3">{method.description}</p>
                <p className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 mb-1 sm:mb-2 wrap-break-word">{method.action}</p>
                <p className="text-xs sm:text-sm text-gray-500">{method.available}</p>
              </div>
            ))}
          </div>

          {/* FAQ Categories */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 px-4 sm:px-0">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={category.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                {/* Category Header */}
                <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
                  <div className="flex items-center">
                    <div className="text-green-600 mr-2 sm:mr-3 md:mr-4">
                      <span className="text-lg sm:text-xl md:text-2xl">
                        {category.icon}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{category.title}</h2>
                  </div>
                </div>

                {/* FAQs */}
                <div className="divide-y divide-gray-200">
                  {category.faqs.map((faq, faqIndex) => {
                    const isActive = activeFaq === `${categoryIndex}-${faqIndex}`;
                    return (
                      <div key={faqIndex} className="px-4 sm:px-6 md:px-8">
                        <button
                          onClick={() => toggleFaq(categoryIndex, faqIndex)}
                          className="w-full py-3 sm:py-4 md:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                        >
                          <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 pr-2 sm:pr-4 md:pr-8 grow">
                            {faq.question}
                          </span>
                          {isActive ? (
                            <FiChevronUp className="shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          ) : (
                            <FiChevronDown className="shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          )}
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-96 pb-3 sm:pb-4 md:pb-5' : 'max-h-0'}`}>
                          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed pr-2 sm:pr-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Help Section */}
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 bg-linear-to-r from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 text-white mx-4 sm:mx-0">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                Still need help?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5 md:mb-6 lg:mb-7 opacity-90 px-2 sm:px-0">
                Our customer support team is here to assist you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="bg-white text-green-600 hover:bg-gray-100 px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto">
                  Contact Support
                </button>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                  Browse More Topics
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 px-4 sm:px-0">
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-center">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {['Track Order', 'Order History', 'Payment Methods', 'Size Guide', 'Store Locator', 'Gift Cards', 'About Us', 'Careers'].map((link, index) => (
                <Link
                  key={index}
                  to="#"
                  className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 text-center text-xs sm:text-sm md:text-base font-medium text-gray-700 hover:text-green-600 transition-all duration-300 hover:shadow-md"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Help;