import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Trash2, ShoppingCart, Heart, Sparkles, ArrowRight, 
  Eye, Tag, Percent, Share2, ChevronRight, Gift,
  Truck, Shield
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart, cart } = useShop();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});

  const handleMoveToCart = (item) => {
    addToCart(item);
    setAddedToCart({ ...addedToCart, [item.id]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [item.id]: false });
      toggleWishlist(item);
    }, 1000);
  };

  const getNumericPrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    const cleanString = String(priceVal).replace(/[^\d.]/g, ''); 
    return Number(cleanString) || 0;
  };

  const trendingItems = [
    { id: 801, name: "Designer Lehenga", price: 28999, image: "https://i.pinimg.com/736x/33/e2/04/33e20454ff3d260337ac462bba1958b3.jpg" },
    { id: 802, name: "Silk Kurta Set", price: 4599, image: "https://i.pinimg.com/1200x/e8/b8/d5/e8b8d5bad513302ed6b39a3955396092.jpg" },
    { id: 803, name: "Embroidered Saree", price: 12999, image: "https://i.pinimg.com/736x/8e/05/35/8e0535a0e8e424c5d1be77fea1235fda.jpg" },
    { id: 804, name: "Party Wear Gown", price: 8999, image: "https://i.pinimg.com/736x/25/09/4e/25094edff0359cada153734742efc860.jpg" }
  ];

  return (
    <div className="w-full min-h-screen bg-stone-50">
      
      {/* PREMIUM DARK BANNER */}
      <div className="relative w-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-semibold">Wishlist</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 text-cream text-xs uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-white/20 mb-3">
                <Heart className="w-3 h-3 text-primary" /> Your Favorites
              </span>
              <h1 className="font-heading text-3xl md:text-5xl text-white">
                My <span className="text-primary italic">Wishlist</span>
              </h1>
              <p className="text-cream/60 text-sm mt-2">
                {wishlist.length} {wishlist.length === 1 ? 'treasure' : 'treasures'} saved for later
              </p>
            </div>
            {wishlist.length > 0 && (
              <button className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/20 transition-all">
                <Share2 className="w-4 h-4" /> Share Wishlist
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        {wishlist.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-12 text-center">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Heart className="w-8 h-8 text-stone-400" />
              </div>
              <h2 className="font-heading text-2xl text-stone-800 mb-2">Your wishlist is empty</h2>
              <p className="text-stone-500 mb-8 text-sm">
                Save your favorite items here and come back to them anytime.
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Discover Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl text-stone-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Trending Now
                </h3>
                <Link to="/shop" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trendingItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-all group">
                    <div className="relative aspect-square">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-all">
                        <Heart className="w-4 h-4 text-stone-400 hover:text-primary" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-stone-800 truncate">{item.name}</h4>
                      <p className="text-primary font-semibold text-sm mt-1">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {wishlist.map((item) => {
                const cleanPrice = getNumericPrice(item.price);
                const isInCart = cart.some(c => c.id === item.id);
                const discount = item.oldPrice ? Math.round(((item.oldPrice - cleanPrice) / item.oldPrice) * 100) : null;

                return (
                  <div 
                    key={item.id} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-100 relative"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                      <Link to={`/product/${item.id}`}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className={`w-full h-full object-cover transition-transform duration-700 ${hoveredItem === item.id ? 'scale-110' : 'scale-100'}`}
                        />
                      </Link>

                      {discount && (
                        <div className="absolute top-3 left-3 bg-stone-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xl">
                          {discount}% OFF
                        </div>
                      )}

                      <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${hoveredItem === item.id ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <button onClick={() => toggleWishlist(item)} className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all hover:scale-110">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link to={`/product/${item.id}`} className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all hover:scale-110">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <button onClick={() => handleMoveToCart(item)} className="w-full py-3 bg-white text-stone-800 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-xl">
                            {addedToCart[item.id] ? '✓ Moved!' : 'Move to Cart'}
                          </button>
                        </div>
                      </div>

                      {item.stockLeft <= 3 && item.stockLeft > 0 && (
                        <div className="absolute bottom-3 left-3 bg-stone-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xl z-10">
                          Only {item.stockLeft} left!
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-semibold">
                        {item.category || item.fabric || 'Premium'}
                      </p>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold text-stone-800 text-sm line-clamp-2 mb-2 hover:text-primary transition-colors leading-snug">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-stone-800">₹{cleanPrice.toLocaleString()}</span>
                        {item.oldPrice && <span className="text-xs text-stone-400 line-through font-medium">₹{item.oldPrice.toLocaleString()}</span>}
                      </div>
                      <div className="flex items-center gap-3 mb-4 mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium"><Truck className="w-3 h-3" /> Free Delivery</span>
                        <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium"><Shield className="w-3 h-3" /> Authentic</span>
                      </div>
                      <button 
                        onClick={() => handleMoveToCart(item)}
                        disabled={addedToCart[item.id]}
                        className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                          addedToCart[item.id]
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                            : isInCart
                              ? 'bg-stone-700 text-white'
                              : 'bg-stone-800 text-white hover:bg-primary shadow-lg shadow-stone-800/10 hover:shadow-primary/20'
                        }`}
                      >
                        {addedToCart[item.id] ? '✓ Moved!' : isInCart ? 'In Cart' : <><ShoppingCart className="w-3.5 h-3.5" /> Move to Cart</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-6 border-t-2 border-stone-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-xl text-stone-800 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" /> Recommended For You
                </h3>
                <Link to="/shop" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trendingItems.map((item) => (
                  <div key={item.id} className="group">
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h4 className="text-sm font-medium text-stone-800">{item.name}</h4>
                    <p className="text-primary text-sm font-semibold mt-1">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;