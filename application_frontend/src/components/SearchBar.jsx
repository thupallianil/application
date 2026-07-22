import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative w-full md:w-96">

      <Search
        size={18}
        className="absolute left-3 top-3 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  );
};

export default SearchBar;