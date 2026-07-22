import { ServerCrash } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServerError() {

  return (
    <div className="min-h-[80vh] flex items-center justify-center">

      <div className="text-center">

        <ServerCrash
          size={90}
          className="mx-auto text-orange-500"
        />

        <h1 className="text-6xl font-bold mt-6">
          500
        </h1>

        <h2 className="text-3xl font-semibold mt-4">
          Internal Server Error
        </h2>

        <p className="text-gray-500 mt-4">
          Something went wrong on our server.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-8 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
        >
          Back to Dashboard
        </Link>

      </div>

    </div>
  );
}