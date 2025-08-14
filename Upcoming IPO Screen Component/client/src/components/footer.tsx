import bluestockLogo from "@/assets/bluestock-logo.png";
import { Twitter, Facebook, Youtube, Linkedin, Instagram, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Trading View</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">NSE Holidays</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">e-Voting CDSL</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">e-Voting NSDL</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Market Timings</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Blogs</a></li>
            </ul>
          </div>

          {/* Offerings */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Offerings</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Company Broker</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">FD Calculators</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">IPO</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">All Brokers</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Products</a></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Share Investor</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Mutual Funds</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Sitemap</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Indian Indices</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Bug Bounty Program</a></li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Policy</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Disclaimer</a></li>
              <li><a href="#" className="hover:text-bluestock-500 transition-colors">Trust & Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            {/* Left Side - Logo and Company Info */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 mb-8 lg:mb-0">
              {/* Bluestock Logo and Info */}
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center mb-4">
                  <img 
                    src={bluestockLogo} 
                    alt="Bluestock" 
                    className="h-8 w-auto"
                  />
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Bluestock Fintech</p>
                  <p>Pune, Maharashtra</p>
                  <p>MMSE Registration No.</p>
                  <p>UDYAM-MH-08-0180801</p>
                </div>
              </div>

              {/* Startup India */}
              <div className="mb-6 lg:mb-0">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  #startupindia
                </div>
              </div>
            </div>

            {/* Right Side - Disclaimers */}
            <div className="lg:max-w-lg text-xs text-gray-500 space-y-4">
              <p>
                Investment in securities markets are subject to market risks, read all the related documents carefully before investing as 
                prescribed by SEBI. Issued in the interest of the investors.
              </p>
              <p>
                The users can write to <a href="mailto:help@bluestock.in" className="text-blue-500 hover:underline">help@bluestock.in</a> for any app, website related queries. Also you can send if / tech related feedbacks to <a href="mailto:info@bluestock.in" className="text-blue-500 hover:underline">info@bluestock.in</a>
              </p>
              <p>
                Disclaimer: We are not a SEBI registered research analyst company. We do not provide any kind of stock recommendations, buy / 
                sell stock tips, or investment and trading advices. All the stock scripts shown in the Bluestock app, website, all social media handles 
                are for educational purposes only.
              </p>
              <p>
                Before making any investment in the financial market, it is advisable to consult with your financial advisor. Remember that stock 
                markets are subject to market risks.
              </p>
            </div>
          </div>

          {/* Social Media and Bottom Text */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col lg:flex-row justify-between items-center">
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-4 lg:mb-0">
              <a href="#" className="text-blue-500 hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-red-500 hover:text-red-600">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-blue-700 hover:text-blue-800">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-pink-500 hover:text-pink-600">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-green-500 hover:text-green-600">
                <Phone size={20} />
              </a>
            </div>

            {/* Copyright and Made with Love */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 text-xs text-gray-500 text-center lg:text-left">
              <p>Bluestock Fintech. All Rights Reserved.</p>
              <p className="flex items-center justify-center lg:justify-start mt-2 lg:mt-0">
                Made with <span className="text-red-500 mx-1">❤️</span> in Pune, Maharashtra
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
