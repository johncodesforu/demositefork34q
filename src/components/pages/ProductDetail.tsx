import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Share2, 
  Sparkles,
  ChevronRight,
  Zap,
  CheckCircle2
} from "lucide-react";
import { getProductById, getProducts } from "@/src/services/productService";
import { Product } from "@/src/types";
import { formatCurrency, cn } from "@/src/lib/utils";
import ProductCard from "@/src/components/products/ProductCard";
import { useCart } from "@/src/context/CartContext";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedVariants, setSelectedVariants] = React.useState<Record<string, string>>({});
  const [quantity, setQuantity] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdded, setIsAdded] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      setIsLoading(true);
      getProductById(id).then((data) => {
        setProduct(data);
        setIsLoading(false);
        if (data) {
          getProducts({ category: data.category, limit: 4 }).then(prods => {
            setRelatedProducts(prods.filter(p => p.id !== id));
          });
        }
      });
    }
  }, [id]);

  const handleAddCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedVariants);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, selectedVariants);
    navigate("/checkout");
  };

  React.useEffect(() => {
    if (id) {
      setIsLoading(true);
      getProductById(id).then((data) => {
        setProduct(data);
        setIsLoading(false);
        if (data) {
          getProducts({ category: data.category, limit: 4 }).then(prods => {
            setRelatedProducts(prods.filter(p => p.id !== id));
          });
        }
      });
    }
  }, [id]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full" />
    </div>;
  }

  if (!product) {
    return <div className="p-20 text-center">Product not found.</div>;
  }

  return (
    <div className="pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center gap-2 text-sm text-white/40">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/shop" className="hover:text-white">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-white">{product.category}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white font-medium">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-6">
          <motion.div 
            layoutId={`prod-img-${product.id}`}
            className="aspect-[4/5] rounded-[2rem] overflow-hidden glass group relative cursor-zoom-in"
          >
            <img 
              src={product.images[selectedImage]} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt={product.name} 
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <button 
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "aspect-square rounded-2xl overflow-hidden glass border-2 transition-all",
                  selectedImage === i ? "border-accent" : "border-transparent opacity-50 hover:opacity-100"
                )}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-accent text-xs font-bold uppercase tracking-widest">{product.category}</span>
              {product.featured && (
                <div className="flex items-center gap-1 text-[10px] bg-accent-purple/20 text-accent-purple font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Staff Pick
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">{product.name}</h1>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-1">
                 {[1, 2, 3, 4, 5].map((s) => (
                   <Star key={s} className={cn("w-4 h-4", s <= Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-white/20")} />
                 ))}
                 <span className="ml-2 text-sm text-white/50">{product.reviewsCount} verified reviews</span>
               </div>
               <div className="h-4 w-px bg-white/10" />
               <span className="text-sm font-medium text-green-500">In Stock ({product.inventory})</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
             {product.originalPrice && (
               <span className="text-lg text-white/30 line-through">{formatCurrency(product.originalPrice)}</span>
             )}
             <span className="text-5xl font-display font-bold">{formatCurrency(product.price)}</span>
          </div>

          <p className="text-white/60 leading-relaxed text-lg">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants?.map((v) => (
            <div key={v.name} className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">{v.name}</h4>
              <div className="flex flex-wrap gap-3">
                {v.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: opt }))}
                    className={cn(
                      "px-6 py-3 rounded-xl border text-sm font-medium transition-all",
                      selectedVariants[v.name] === opt 
                        ? "bg-white text-black border-white" 
                        : "border-white/10 hover:bg-white/5 hover:border-white/30"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center glass rounded-2xl px-4 py-2 self-start sm:self-auto">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-xl font-bold hover:text-accent transition-colors">-</button>
              <span className="w-12 text-center font-bold px-4">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-xl font-bold hover:text-accent transition-colors">+</button>
            </div>
            <button 
              onClick={handleAddCart}
              className={cn(
                "flex-1 font-bold h-16 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all neon-glow",
                isAdded ? "bg-green-500 text-white" : "bg-white text-black"
              )}
            >
              {isAdded ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Added to Collection
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </>
              )}
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-accent text-black font-bold h-16 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all neon-glow shadow-[0_0_20px_rgba(20,241,149,0.2)]"
            >
              <Zap className="w-5 h-5" /> Buy Now
            </button>
            <button className="p-5 glass rounded-2xl hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 glass rounded-3xl grid grid-cols-2 gap-8 divide-x divide-white/10">
            <div className="flex items-center gap-4">
              <Truck className="w-6 h-6 text-accent" />
              <div className="text-xs">
                <p className="font-bold">Lightning Shipping</p>
                <p className="text-white/40">Ships within 24h</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-8">
              <RotateCcw className="w-6 h-6 text-accent" />
              <div className="text-xs">
                <p className="font-bold">60-Day Returns</p>
                <p className="text-white/40">Free easy exchanges</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Specs */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="flex items-center gap-12 border-b border-white/10 mb-12">
          {["Description", "Specifications", "Reviews"].map((tab) => (
            <button key={tab} className="pb-4 text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white relative border-b-2 border-transparent hover:border-accent transition-all">
              {tab}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold">Futuristic Engineering</h3>
            <p className="text-white/50 leading-relaxed">
              Every detail of the {product.name} has been meticulously crafted to represent the pinnacle of modern technology. 
              Built with aerospace-grade materials and integrated with our proprietary Neo-Flow ecosystem, 
              this product doesn't just serve a purpose—it defines a lifestyle.
            </p>
            <div className="grid grid-cols-2 gap-4">
               {product.specs && Object.entries(product.specs).map(([key, val]) => (
                 <div key={key} className="p-4 glass rounded-2xl border-white/5">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{key}</p>
                    <p className="font-medium text-sm">{val}</p>
                 </div>
               ))}
            </div>
          </div>
          <div className="rounded-[2.5rem] overflow-hidden h-[400px]">
            <img src={product.images[0]} className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" alt="" />
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <h2 className="text-3xl font-display font-bold mb-12">Complete the Look</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Sticky Mobile Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-2xl border-t border-white/10 z-40">
         <div className="flex gap-4">
            <button 
              onClick={handleAddCart}
              className={cn(
                "flex-1 font-bold h-14 rounded-2xl flex items-center justify-center gap-2 transition-all",
                isAdded ? "bg-green-500 text-white" : "bg-white text-black"
              )}
            >
              {isAdded ? <CheckCircle2 className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
              {isAdded ? "Added" : "Add To Cart"}
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-accent text-black font-bold h-14 rounded-2xl flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" /> Buy Now
            </button>
         </div>
      </div>
    </div>
  );
}
