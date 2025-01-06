"use client";
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { MenuItem } from "@/types";
import { cn } from "@/lib/utils";

interface MenuProps {
  menuItems: MenuItem[];
}

const Menu = ({ menuItems }: MenuProps) => {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPrice, setSelectedPrice] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "name" | "popular"
  >("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Close modal when clicking escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFilterOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isFilterOpen]);

  // Get unique categories
  const categories = [
    "all",
    ...new Set(menuItems.map((item) => item.category.slug)),
  ];

  // Price ranges
  const priceRanges = {
    all: { label: "All Prices", range: [0, Infinity] },
    low: { label: "Under ETB 200", range: [0, 200] },
    medium: { label: "ETB 200 - 500", range: [200, 500] },
    high: { label: "Over ETB 500", range: [500, Infinity] },
  };

  // Filter and sort items
  const filteredItems = React.useMemo(() => {
    let filtered = [...menuItems];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.category.slug === selectedCategory
      );
    }

    // Price filter
    if (selectedPrice !== "all") {
      const range =
        priceRanges[selectedPrice as keyof typeof priceRanges].range;
      filtered = filtered.filter(
        (item) => item.price >= range[0] && item.price < range[1]
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "popular":
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [menuItems, selectedCategory, selectedPrice, searchQuery, sortBy]);

  const handleItemClick = useCallback(
    (item: MenuItem) => {
      setActiveItem(activeItem?.id === item.id ? null : item);
    },
    [activeItem]
  );

  return (
    <div className="space-y-8">
      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for dishes, categories, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[60px] pl-14 pr-6 bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-shadow duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-6 flex items-center"
            >
              <svg
                className="w-5 h-5 text-gray-400 hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className={cn(
            "h-[60px] px-7 rounded-2xl flex items-center gap-3 transition-all duration-200",
            "hover:shadow-[0_3px_16px_-5px_rgba(0,0,0,0.15)] active:scale-[0.98]",
            selectedCategory !== "all" || selectedPrice !== "all" || sortBy !== "default"
              ? "bg-red-500 text-white shadow-[0_2px_8px_-2px_rgba(239,68,68,0.3)]"
              : "bg-white text-gray-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]"
          )}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-[22px] h-[22px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="text-[15px] font-medium">Filters</span>
          </div>
          {(selectedCategory !== "all" || selectedPrice !== "all" || sortBy !== "default") && (
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-white/20 backdrop-blur-sm text-sm font-medium">
              {[
                selectedCategory !== "all",
                selectedPrice !== "all",
                sortBy !== "default"
              ].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 !m-0"
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)] space-y-6">
                {/* Categories */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-500">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                          selectedCategory === category
                            ? "border-red-500 bg-red-50 text-red-500"
                            : "border-gray-200 hover:border-red-500 hover:text-red-500"
                        }`}
                      >
                        {category === "all"
                          ? "All Categories"
                          : menuItems.find(
                              (item) => item.category.slug === category
                            )?.category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-500">
                    Price Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(priceRanges).map(([key, { label }]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPrice(key)}
                        className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                          selectedPrice === key
                            ? "border-red-500 bg-red-50 text-red-500"
                            : "border-gray-200 hover:border-red-500 hover:text-red-500"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-500">
                    Sort By
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "default", label: "Featured" },
                      { value: "popular", label: "Popular Items" },
                      { value: "price-asc", label: "Price: Low to High" },
                      { value: "price-desc", label: "Price: High to Low" },
                      { value: "name", label: "Name: A to Z" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as typeof sortBy)}
                        className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                          sortBy === option.value
                            ? "border-red-500 bg-red-50 text-red-500"
                            : "border-gray-200 hover:border-red-500 hover:text-red-500"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-100 p-6 bg-gray-50/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {filteredItems.length}{" "}
                    {filteredItems.length === 1 ? "item" : "items"} found
                  </div>
                  <div className="flex gap-3">
                    {(selectedCategory !== "all" ||
                      selectedPrice !== "all" ||
                      sortBy !== "default") && (
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedPrice("all");
                          setSortBy("default");
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-6 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-xl">No items found</div>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedPrice("all");
              setSearchQuery("");
              setSortBy("default");
            }}
            className="mt-4 text-red-500 hover:text-red-600 transition-colors duration-300"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500",
                !item.isAvailable && "opacity-60 cursor-not-allowed group"
              )}
            >
              <div className="relative h-64">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {!item.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-4 py-2 bg-black/80 text-white rounded-lg text-sm font-medium">
                      Currently Unavailable
                    </span>
                  </div>
                )}

                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 p-6 text-white transition-transform duration-300",
                    activeItem?.id === item.id ? "translate-y-0" : "translate-y-[10px]"
                  )}
                >
                  <div className={cn("flex flex-col space-y-1")}>
                    <h3 className="text-2xl font-bold tracking-wide">
                      {item.name}
                    </h3>
                    <p className="text-lg font-semibold text-red-400">
                      ETB {item.price.toFixed(2)}
                    </p>
                  </div>

                  {activeItem?.id === item.id && (
                    <p
                      className={`text-sm text-gray-200 line-clamp-3 transition-opacity duration-300 ${
                        activeItem?.id === item.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleItemClick(item)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                <svg
                  className={`w-6 h-6 transition-transform duration-300 ${
                    activeItem?.id === item.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {item.category.name}
                </span>
                {item.isPopular && (
                  <span className="bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white">
                    Popular
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
