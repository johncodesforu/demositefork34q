import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, SlidersHorizontal, Search, Grid, List as ListIcon } from "lucide-react";
import { getProducts } from "@/src/services/productService";
import { Product } from "@/src/types";
import ProductCard from "@/src/components/products/ProductCard";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/src/lib/utils";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showFilters, setShowFilters] = React.useState(false);

  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";

  const categories = ["All", "Wearables", "Home Office", "Apparel", "Home Decoration", "Transport"];

  React.useEffect(() => {
    setIsLoading(true);
    getProducts({ category }).then((data) => {
      let sortedData = [...data];
      
      if (sort === "price-low") {
        sortedData.sort((a, b) => a.price - b.price);
      } else if (sort === "price-high") {
        sortedData.sort((a, b) => b.price - a.price);
      } else if (sort === "rating") {
        sortedData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === "newest") {
        // Mock newest by reversing or ID logic if no date
        sortedData.reverse();
      }
      
      setProducts(sortedData);
      setIsLoading(false);
    });
  }, [category, sort]);

  const toggleCategory = (cat: string) => {
    setSearchParams({ category: cat, sort });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters - Sticky */}
        <aside className="w-full md:w-64 space-y-12 shrink-0 h-fit md:sticky md:top-32">
          <div>
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5 text-accent" /> Categories
            </h2>
            <div className="space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-2xl transition-all border",
                    category === cat 
                      ? "bg-accent/10 border-accent text-accent font-bold" 
                      : "border-transparent text-white/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <h1 className="text-4xl font-display font-bold">{category} Collection</h1>
              <p className="text-white/40 text-sm mt-1">{products.length} Items found in the future</p>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
               <div className="relative group">
                 <select 
                   value={sort}
                   onChange={(e) => setSearchParams({ category, sort: e.target.value })}
                   className="flex items-center gap-2 px-6 py-3 glass rounded-2xl hover:border-accent/50 transition-colors bg-black/40 text-sm font-bold appearance-none outline-none cursor-pointer"
                 >
                   <option value="newest">Newest Arrival</option>
                   <option value="price-low">Price: Low to High</option>
                   <option value="price-high">Price: High to Low</option>
                   <option value="rating">Top Rated</option>
                 </select>
               </div>
               
               <div className="flex bg-white/5 p-1 rounded-xl hidden lg:flex">
                 <button className="p-2 bg-white/10 rounded-lg"><Grid className="w-4 h-4" /></button>
                 <button className="p-2 text-white/30 hover:text-white"><ListIcon className="w-4 h-4" /></button>
               </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-[400px] glass rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="text-2xl font-bold font-display">No items found</h3>
                  <p className="text-white/40">Try adjusting your filters or resetting results.</p>
                  <button onClick={() => toggleCategory("All")} className="text-accent underline">Reset all filters</button>
                </div>
              )}
            </>
          )}

          {/* Infinite Scroll simulation */}
          {!isLoading && products.length > 0 && (
            <div className="flex justify-center pt-12">
              <button className="px-10 py-4 glass border border-white/10 rounded-2xl hover:bg-white/10 transition-colors flex items-center gap-3">
                Load More Technology <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
