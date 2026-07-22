const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between">

        {/* Left */}

        <div className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Invoice Management System.
          All Rights Reserved.
        </div>

        {/* Center */}

        <div className="flex items-center gap-6 mt-3 md:mt-0">

          <a
            href="#"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Privacy Policy
          </a>

          <a
            href="#"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Terms & Conditions
          </a>

          <a
            href="#"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Help
          </a>

        </div>

        {/* Right */}

        <div className="text-sm text-gray-500 mt-3 md:mt-0">
          Version 1.0.0
        </div>

      </div>
    </footer>
  );
};

export default Footer;