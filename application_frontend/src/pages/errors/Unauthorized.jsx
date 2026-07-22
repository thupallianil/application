import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {

  return (
    <div className="min-h-[80vh] flex items-center justify-center">

      <div className="text-center">

        <ShieldAlert
          size={90}
          className="mx-auto text-red-500"
        />

        <h1 className="text-6xl font-bold mt-6">
          403
        </h1>

        <h2 className="text-3xl font-semibold mt-4">
          Access Denied
        </h2>

        <p className="text-gray-500 mt-4">
          You don't have permission to access this page.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-8 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
        >
          Return Dashboard
        </Link>

      </div>

    </div>
  );
}
