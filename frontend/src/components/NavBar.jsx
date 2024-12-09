import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-900">
          Auth App
        </Link>
        <div className="space-x-4 text-gray-700">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <Link to="/" className="hover:text-gray-900">Login</Link>
          <Link to="/register" className="hover:text-gray-900">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
