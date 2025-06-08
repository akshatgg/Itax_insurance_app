import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SecureLife</h3>
            <p className="text-gray-400">
              Your trusted insurance partner for comprehensive coverage solutions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="/quote" className="block text-gray-400 hover:text-white">
                Get Quote
              </a>
              <a href="/claims" className="block text-gray-400 hover:text-white">
                File Claim
              </a>
              <a href="/suggestions" className="block text-gray-400 hover:text-white">
                Suggestions
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <a href="/chat-support" className="block text-gray-400 hover:text-white">
                Live Chat
              </a>
              <a href="tel:1800-123-4567" className="block text-gray-400 hover:text-white">
                1800-123-4567
              </a>
              <a href="mailto:support@securelife.com" className="block text-gray-400 hover:text-white">
                support@securelife.com
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white">
                Facebook
              </a>
              <a href="#" className="block text-gray-400 hover:text-white">
                Twitter
              </a>
              <a href="#" className="block text-gray-400 hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SecureLife Insurance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;