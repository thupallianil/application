import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Reset Link Sent");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Enter your email address
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <div className="relative">

              <Mail
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                type="email"
                placeholder="Enter Email"
                className="w-full border rounded-lg py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
            Send Reset Link
          </button>

        </form>

        <div className="text-center mt-6">

          <Link
            to="/"
            className="text-blue-600"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;