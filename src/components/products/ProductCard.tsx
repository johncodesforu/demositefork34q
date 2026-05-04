import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Zap, CheckCircle2 } from "lucide-react";
import { Product } from "@/src/types";
import { formatCurrency, cn } from "@/src/lib/utils";
import { Link } from "react-router-dom";
import { useCart } from "@/src/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative glass rounded-3xl overflow-hidden hover:neon-glow transition-all duration-500"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.trending && (
          <div className="bg-accent/20 backdrop-blur-md border border-accent/30 text-accent px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3" /> Trending
          </div>
        )}
        {product.originalPrice && (
          <div className="bg-accent-purple/20 backdrop-blur-md border border-accent-purple/30 text-accent-purple-light text-[#A855F7] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
          </div>
        )}
      </div>

      <button className="absolute top-4 right-4 z-10 p-2 glass rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
        <Heart className="w-4 h-4" />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block aspect-[4/5] overflow-hidden">
        <motion.img
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Info Container */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-bold text-lg mb-2 line-clamp-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-white/50 text-xs mb-4 line-clamp-2 min-h-[32px]">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-white/30 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="text-xl font-bold font-display">
              {formatCurrency(product.price)}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={cn(
              "p-3 rounded-2xl transition-all duration-300",
              isAdded ? "bg-green-500 text-white scale-110" : "bg-white text-black hover:bg-accent"
            )}
          >
            {isAdded ? <CheckCircle2 className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
