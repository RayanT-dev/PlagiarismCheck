import { Search } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Search className="text-primary text-xl mr-2" />
              <span className="font-semibold text-gray-900">PlagiarismCheck Pro</span>
            </div>
            <p className="text-sm text-gray-600">
              Advanced plagiarism detection for academic institutions and professionals worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary">Document Analysis</a></li>
              <li><a href="#" className="hover:text-primary">Real-time Checking</a></li>
              <li><a href="#" className="hover:text-primary">Citation Generator</a></li>
              <li><a href="#" className="hover:text-primary">Grammar Check</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">API Documentation</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>support@plagiarismcheck.pro</li>
              <li>+1 (555) 123-4567</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 PlagiarismCheck Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
