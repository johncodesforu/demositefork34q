import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "@/src/services/productService";
import { Product } from "@/src/types";
import ProductCard from "@/src/components/products/ProductCard";
import { cn } from "@/src/lib/utils";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    getProducts({ limit: 4 }).then(setFeaturedProducts);
    getProducts({ limit: 4 }).then(setTrendingProducts); // For demo, just fetch any
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-purple/20 rounded-full blur-[130px]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/70">
              Future of Shopping is Here
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[1.1]"
          >
            Upgrade Your <br />
            <span className="gradient-text">Lifestyle.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 mb-12"
          >
            Curated selection of high-end futuristic tech, luxury apparel, and innovative gadgets. 
            Experience the marketplace of 2030, today.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link 
              to="/shop" 
              className="px-10 py-5 bg-accent text-black font-bold rounded-2xl hover:scale-105 transition-transform neon-glow flex items-center gap-3"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/shop?filter=trending" 
              className="px-10 py-5 border border-white/10 glass hover:bg-white/10 rounded-2xl font-bold transition-all"
            >
              Trending Deals
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/40" />
          <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">Featured Picks</h2>
            <p className="text-white/40">Our most innovative items, selected for you.</p>
          </div>
          <Link to="/shop" className="text-accent hover:underline hidden sm:flex items-center gap-2 font-medium">
            View all collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold mb-2">Shop by Category</h2>
          <p className="text-white/40">Find your specific future gear.</p>
        </div>

        <div className="space-y-16">
          {["Wearables", "Home Office", "Apparel"].map((cat) => (
            <CategorySection key={cat} category={cat} />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Shield, title: "Secure Payments", desc: "Military-grade encryption for every transaction." },
          { icon: Rocket, title: "Warp Speed Shipping", desc: "Global delivery in record time with local transit hubs." },
          { icon: Sparkles, title: "Authenticity Guaranteed", desc: "Verified sources and origin-tracking for every luxury item." }
        ].map((item, i) => (
          <div key={i} className="p-8 glass rounded-3xl flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group hover:border-accent transition-colors">
              <item.icon className="w-8 h-8 text-white/50 group-hover:text-accent" />
            </div>
            <h3 className="text-xl font-bold font-display">{item.title}</h3>
            <p className="text-white/40 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function CategorySection({ category }: { category: string }) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    getProducts({ category, limit: 3 }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [category]);

  if (!loading && products.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold font-display tracking-tight text-white group cursor-pointer inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            {category}
          </h3>
        </div>
        <Link 
          to={`/shop?category=${encodeURIComponent(category)}`} 
          className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-accent flex items-center gap-2 transition-all group"
        >
          Explore Collection 
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="h-80 glass rounded-3xl animate-pulse" />
          ))
        ) : (
          products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))
        )}
      </div>
    </div>
  );
}
