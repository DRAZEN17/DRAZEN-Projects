import React from "react";

export default function Footer({ setSelectedCategory, CATEGORIES }) {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">G</div>
              <span className="text-xl font-bold">DRAZEN Store</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">Experience the future of shopping with our curated collection. Quality meets modern design in every product we offer.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Shop Categories</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button onClick={() => { setSelectedCategory(c.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-blue-600 transition-colors">
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Shipping Information</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2024 DRAZEN Store Demo. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <a href="#" className="hover:text-black">Terms</a>
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
