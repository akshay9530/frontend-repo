import React from "react";
import myLogo from "../assets/My_QR_Code_2-1024.svg";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  MapPin,
  CreditCard,
  ShoppingBag,
  MessageCircle,
  Download,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-linear-to-b from-gray-50 to-white text-gray-800 py-12 border-t border-gray-200 animate-[fadeIn_1s_ease-in]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-center sm:text-left">

          {/* Orders Section */}
          <div className="transform transition duration-500 hover:scale-[1.03] hover:shadow-lg animate-[slideUp_0.6s_ease-out]">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-lg">Orders</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4 sm:pr-6">
              Find out when your purchase will arrive or schedule a delivery.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <button className="text-sm font-semibold text-green-600 hover:underline hover:text-green-700 transition-all">
                Track Order
              </button>
              <button className="text-sm font-semibold text-green-600 hover:underline hover:text-green-700 transition-all">
                Schedule Delivery
              </button>
            </div>
          </div>

          {/* Contact Section */}
          <div className="transform transition duration-500 hover:scale-[1.03] hover:shadow-lg animate-[slideUp_0.6s_ease-out] delay-100">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-bold text-lg">Contact Us</h4>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <Phone className="w-4 h-4 text-green-600" />
              <p className="text-sm text-gray-600">
                Text Us: <span className="font-semibold text-green-700">(312) 779-1979</span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <button className="text-sm font-semibold text-green-600 hover:underline hover:text-green-700 transition-all">
                Chat With Us
              </button>
              <button className="text-sm font-semibold text-green-600 hover:underline hover:text-green-700 transition-all">
                Leave Feedback
              </button>
              <button className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:underline hover:text-green-700 transition-all">
                <MapPin className="w-4 h-4" />
                Find a Store
              </button>
            </div>
          </div>

          {/* Credit Card Section */}
          <div className="transform transition duration-500 hover:scale-[1.03] hover:shadow-lg animate-[slideUp_0.6s_ease-out] delay-200">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-lg">Membership Card</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4 sm:pr-6">
              Earn reward dollars every time you shop — plus exclusive offers.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <button className="text-sm font-semibold text-green-600 hover:underline hover:text-green-700 transition-all">
                Apply Now
              </button>
              <button className="text-sm font-semibold text-green-600 hover:underline hover:text-green-700 transition-all">
                Manage Account
              </button>
            </div>
          </div>

          {/* App Section */}
          <div className="transform transition duration-500 hover:scale-[1.03] hover:shadow-lg animate-[slideUp_0.6s_ease-out] delay-300">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <Download className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-lg">Get our App</h4>
            </div>

            <p className="text-sm text-gray-600 mb-4 sm:pr-6 text-center sm:text-left">
              Scan to install app & explore exclusive deals.
            </p>

            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-5">
              <div className="w-32 h-32 border-2 border-indigo-300 rounded-lg p-2 bg-white hover:rotate-6 hover:scale-110 transition-all duration-500 cursor-pointer shadow-md">
                <img src={myLogo} alt="Logo" className="w-full h-full" />
              </div>

              <div className="w-32 h-10 bg-black text-white flex items-center justify-center text-xs rounded-lg hover:scale-105 cursor-pointer transition-all duration-300">
                App Store
              </div>
            </div>
          </div>
        </div>

        {/* Main Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-center sm:text-left animate-[fadeIn_1s_ease-in]">
          <div>
            <h5 className="font-semibold mb-4">Help</h5>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-green-600 hover:underline transition-all" href="#">Customer Service</a></li>
              <li><a className="hover:text-green-600 hover:underline transition-all" href="#">Account</a></li>
              <li><a className="hover:text-green-600 hover:underline transition-all" href="#">Returns</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-green-600 hover:underline transition-all" href="#">Gift Cards</a></li>
              <li><a className="hover:text-green-600 hover:underline transition-all" href="#">Wedding Registry</a></li>
              <li><a className="hover:text-green-600 hover:underline transition-all" href="#">Free Design Services</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-green-600 hover:underline transition-all" href="#">About Us</a></li>
              <li><a className="hover:text-green-600 hover:underline transition-all" href="#">Careers</a></li>
              <li><a className="hover:text-green-600 hover:underline transition-all" href="#">Policies</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Social Media</h5>
            <div className="flex justify-center sm:justify-start gap-4">
              <Facebook className="hover:text-blue-600 hover:scale-110 transition-all cursor-pointer" />
              <Instagram className="hover:text-pink-500 hover:scale-110 transition-all cursor-pointer" />
              <Twitter className="hover:text-blue-900 hover:scale-110 transition-all cursor-pointer" />
              <Youtube className="hover:text-red-600 hover:scale-110 transition-all cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-300 pt-6 text-sm text-gray-600 text-center sm:text-left animate-[fadeIn_1s_ease-in]">
          ©2026 All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
