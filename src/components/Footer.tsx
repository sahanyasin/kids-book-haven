import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto py-6 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Kids Book Haven. All rights reserved.
          </div>
          <nav className="flex space-x-6">
            <Link to="/submit-book" className="text-sm text-gray-600 hover:text-gray-900">
              Submit a Book
            </Link>
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link to="/sitemap.xml" className="text-sm text-gray-600 hover:text-gray-900">
              Sitemap
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;