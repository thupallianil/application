import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">

      <div className="text-center">

        <SearchX
          size={90}
          className="mx-auto text-blue-600"
        />

        <h1 className="text-7xl font-bold mt-6">
          404
        </h1>

        <h2 className="text-3xl font-semibold mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-4">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          <Home size={20} />
          Go Dashboard
        </Link>

      </div>

    </div>
  );
}