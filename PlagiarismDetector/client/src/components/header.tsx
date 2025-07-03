import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <div className="flex items-center">
            <Search className="text-primary text-2xl mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">PlagiarismCheck Pro</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
