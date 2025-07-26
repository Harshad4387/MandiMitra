import React, { useState } from "react";

const SearchProduct = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: integrate API call
    alert(`Searching for: ${query}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Search Products</h1>
      <form onSubmit={handleSearch} className="flex gap-4">
        <input
          type="text"
          placeholder="Enter product name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchProduct;
