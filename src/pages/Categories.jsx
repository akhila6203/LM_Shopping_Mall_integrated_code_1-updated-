import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Heart, Eye, Star, Crown, Gem, Truck, RefreshCw, Scissors, Calendar, Tag } from "lucide-react";

const categoriesData = [
  { 
    name: "Premium Sarees", 
    desc: "Kanchipuram, Banarasi & Handlooms", 
    link: "/sarees?category=Silk",  // ✅ Added category filter
    image: "https://i.pinimg.com/736x/83/1f/43/831f433bbb3ba100d1b6e50483e2c107.jpg",
    tag: "Bestseller",
    rating: 4.9,
    items: 245,
    badge: "New Arrivals"
  },
  { 
    name: "Unstitched Fabrics", 
    desc: "Ikat, Kalamkari & Block Prints", 
    link: "/fabrics?category=Kalamkari",  // ✅ Added category filter
    image: "https://i.pinimg.com/1200x/30/72/65/3072656816eed46a1df787164dfcea0b.jpg",
    tag: "Trending",
    rating: 4.8,
    items: 189,
    badge: "Handcrafted"
  },
  { 
    name: "Elegant Kurtas", 
    desc: "Straight Cut, Anarkali & Sets", 
    link: "/kurtas?category=Anarkali",  // ✅ Added category filter
    image: "https://i.pinimg.com/1200x/f4/b0/5a/f4b05a82d38a8d5c211319d3396ae64e.jpg",
    tag: "Popular",
    rating: 4.7,
    items: 312,
    badge: "Designer"
  },
  { 
    name: "Handcrafted Dupattas", 
    desc: "Silk, Organza & Embroidered", 
    link: "/dupattas?category=Silk",  // ✅ Added category filter
    image: "https://i.pinimg.com/736x/2d/46/2d/2d462d19e2e86ff6f12ba387b24afc12.jpg",
    tag: "Limited",
    rating: 4.9,
    items: 156,
    badge: "Exclusive"
  },
  { 
    name: "Custom Stitching", 
    desc: "Tailor-made perfection for you", 
    link: "/contact", 
    image: "https://i.pinimg.com/236x/4e/01/50/4e0150b8a17c68e438f39c6343a258ed.jpg",
    tag: "Custom",
    rating: 5.0,
    items: null,
    badge: "Made to Order"
  }
];

const featuredCollections = [
  { name: "Wedding Edit", image: "https://i.pinimg.com/1200x/f0/d6/8e/f0d68e85d2b50bbea5b36c7d2b4e6c5a.jpg", count: 128, link: "/collection/wedding-edit" },
  { name: "Festival Picks", image: "https://i.pinimg.com/736x/11/29/aa/1129aa16e7e6948af0fd05acd09a7bfb.jpg", count: 96, link: "/collection/festival-picks" },
  { name: "Party Wear", image: "https://i.pinimg.com/736x/e8/20/a9/e820a91afd4a535ec03afd98bcba8ac0.jpg", count: 84, link: "/collection/party-wear" },
  { name: "Daily Elegance", image: "https://i.pinimg.com/736x/37/94/de/3794de7578035eb97bba25e5f7345617.jpg", count: 156, link: "/collection/daily-elegance" },
];

const trendingNow = [
  { name: "Banarasi Silk", image: "https://i.pinimg.com/736x/08/91/89/089189ab47723dc64cc9f5fbc260b99f.jpg", soldOut: false, discount: "15% OFF", link: "/product/banarasi-silk" },
  { name: "Chikankari Kurtas", image: "https://i.pinimg.com/736x/1a/e9/48/1ae948602650552bd6b0d24d25d51c30.jpg", soldOut: false, discount: "20% OFF", link: "/product/chikankari-kurtas" },
  { name: "Organza Dupattas", image: "https://i.pinimg.com/1200x/49/d9/e1/49d9e110af2b86db4a2a545cd1a4bc97.jpg", soldOut: true, discount: null, link: "/product/organza-dupattas" },
  { name: "Kalamkari Fabric", image: "https://i.pinimg.com/736x/78/a7/3c/78a73cffd36baff9e648ca2d3686ed67.jpg", soldOut: false, discount: "10% OFF", link: "/product/kalamkari-fabric" },
];

const designerSpotlight = [
  { name: "Anita Dongre", specialty: "Sustainable Luxury", image: "https://i.pinimg.com/1200x/da/75/a6/da75a6717f998cd4a084eec3d7729c20.jpg", pieces: 45, link: "/designer/anita-dongre" },
  { name: "Sabyasachi", specialty: "Heritage Couture", image: "https://i.pinimg.com/1200x/b0/d7/77/b0d7776c721f521e450fb6857868a3c0.jpg", pieces: 62, link: "/designer/sabyasachi" },
  { name: "Manish Malhotra", specialty: "Glamour Wear", image: "https://i.pinimg.com/1200x/01/5e/b9/015eb9963aa81b758bff7519b9fa9082.jpg", pieces: 38, link: "/designer/manish-malhotra" },
];

const Categories = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [countdown, setCountdown] = useState({ days: 15, hours: 8, mins: 45 });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 to-white">
      
      {/* FEATURED COLLECTIONS */}
      <div className="container mx-auto px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">Curated</span>
            <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mt-1">Featured Collections</h2>
          </div>
          <Link to="/collections" className="group flex items-center gap-2 text-primary text-sm font-semibold hover:text-primary/80 transition-colors">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {featuredCollections.map((collection, idx) => (
            <Link key={idx} to={collection.link} className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] aspect-[16/10] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <div className="flex items-center gap-2 mb-2"><div className="w-8 h-[2px] bg-primary"></div><span className="text-cream/80 text-xs uppercase tracking-[0.2em] font-medium">{collection.count}+ Products</span></div>
                <h3 className="text-white font-heading text-xl md:text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">{collection.name}</h3>
                <span className="inline-flex items-center gap-1.5 text-cream/90 text-sm font-medium group-hover:gap-2.5 transition-all">Explore Collection <ArrowRight className="w-4 h-4" /></span>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"><div className="absolute top-0 -left-[100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-[200%] transition-transform duration-1000"></div></div>
            </Link>
          ))}
        </div>
      </div>

      {/* MAIN CATEGORIES GRID */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <span className="text-primary text-sm uppercase tracking-[0.3em] font-medium">Explore Our</span>
          <h2 className="font-heading text-3xl md:text-4xl text-stone-800 mt-2 mb-3">Premium Categories</h2>
          <div className="flex items-center justify-center gap-3"><div className="w-12 h-[1px] bg-stone-300"></div><div className="w-1.5 h-1.5 bg-primary rounded-full"></div><div className="w-12 h-[1px] bg-stone-300"></div></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {categoriesData.map((cat, idx) => (
            <Link to={cat.link} key={idx} className="group relative h-[380px] md:h-[420px] overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500" onMouseEnter={() => setHoveredCard(idx)} onMouseLeave={() => setHoveredCard(null)}>
              <img src={cat.image} alt={cat.name} className={`w-full h-full object-cover transition-all duration-700 ${hoveredCard === idx ? 'scale-110' : 'scale-105'}`} />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-500 ${hoveredCard === idx ? 'via-black/40' : 'via-black/20'}`}></div>
              <div className="absolute top-4 left-4 flex gap-2">
                {cat.badge && <span className="bg-primary text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-medium shadow-lg">{cat.badge}</span>}
                {cat.tag && <span className="bg-white text-stone-800 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-medium flex items-center gap-1 shadow-lg"><TrendingUp className="w-3 h-3" />{cat.tag}</span>}
              </div>
              <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-500 ${hoveredCard === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <button className="p-2.5 bg-white rounded-full hover:bg-primary hover:text-white shadow-lg transition-all duration-300 hover:scale-110"><Heart className="w-4 h-4" /></button>
                <button className="p-2.5 bg-white rounded-full hover:bg-primary hover:text-white shadow-lg transition-all duration-300 hover:scale-110"><Eye className="w-4 h-4" /></button>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center transform transition-all duration-500">
                <h2 className="font-heading text-2xl md:text-3xl text-white mb-2 drop-shadow-lg text-center">{cat.name}</h2>
                <p className={`font-body text-cream/90 text-sm mb-4 text-center transition-all duration-500 ${hoveredCard === idx ? 'opacity-100' : 'opacity-80'}`}>{cat.desc}</p>
                {cat.items && <p className="text-cream/70 text-xs mb-4 flex items-center justify-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>{cat.items}+ Products<span className="w-1 h-1 bg-primary rounded-full"></span></p>}
                <div className="flex flex-row items-center justify-center gap-3 w-full mt-auto">
                  <span className="inline-flex items-center gap-2 border border-cream/50 text-cream px-4 py-2.5 text-sm uppercase tracking-wider font-medium hover:bg-cream hover:text-stone-800 transition-all duration-300 rounded-sm bg-black/20">Explore Collection<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  {cat.rating && <div className="bg-white px-3 py-2.5 rounded-sm flex items-center gap-1 shadow-lg border border-cream/50"><Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /><span className="text-xs font-bold text-stone-800">{cat.rating}</span></div>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* TRENDING NOW */}
      <div className="bg-gradient-to-b from-white to-stone-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-primary text-sm uppercase tracking-[0.3em] font-medium flex items-center gap-2"><TrendingUp className="w-4 h-4" />Hot Right Now</span>
              <h3 className="font-heading text-2xl text-stone-800 mt-2">Trending This Week</h3>
            </div>
            <Link to="/trending" className="text-primary text-sm uppercase tracking-wider hover:underline flex items-center gap-1 font-medium">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingNow.map((item, idx) => (
              <Link to={item.link} key={idx} className="group relative">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {item.discount && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">{item.discount}</div>}
                  {item.soldOut && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-white text-stone-800 text-sm px-4 py-2 rounded-full font-medium">Sold Out</span></div>}
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white shadow-lg"><Heart className="w-4 h-4" /></button>
                </div>
                <h4 className="font-medium text-stone-800 mt-3 group-hover:text-primary transition-colors">{item.name}</h4>
                <p className="text-sm text-stone-500">Starting ₹2,499</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* DESIGNER SPOTLIGHT */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-5">
          <span className="text-primary text-sm uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2"><Crown className="w-4 h-4" />Curated By Experts</span>
          <h3 className="font-heading text-2xl text-stone-800 mt-2">Designer Spotlight</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {designerSpotlight.map((designer, idx) => (
            <div key={idx} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={designer.image} alt={designer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4"><h4 className="text-white font-heading text-lg">{designer.name}</h4><p className="text-cream/80 text-sm">{designer.specialty}</p></div>
              </div>
              <div className="p-4 flex items-center justify-between"><span className="text-stone-600 text-sm">{designer.pieces} Exclusive Pieces</span><Link to={designer.link} className="text-primary text-sm uppercase tracking-wider hover:underline flex items-center gap-1 font-medium">Explore <ArrowRight className="w-3 h-3" /></Link></div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY SHOP WITH US */}
      <div className="bg-gradient-to-r from-stone-100 to-stone-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6"><h3 className="font-heading text-2xl text-stone-800">The LM Experience</h3><p className="text-stone-600 mt-2">Crafting elegance since 2024</p></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Gem, title: "Premium Quality", desc: "Handpicked fabrics & craftsmanship" },
              { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns" },
              { icon: Scissors, title: "Custom Stitching", desc: "Tailored to perfection" }
            ].map((feature, idx) => (
              <div key={idx} className="text-center group"><div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors"><feature.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" /></div><h4 className="font-heading text-base text-stone-800 mb-1">{feature.title}</h4><p className="text-sm text-stone-500">{feature.desc}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div className="bg-stone-900 py-7">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0"><Calendar className="w-6 h-6 text-primary" /></div><div><h4 className="text-white font-heading text-lg">Festive Collection Launch</h4><p className="text-cream/70 text-sm">Exclusive preview on 15th December</p></div></div>
            <div className="flex items-center gap-3">
              <div className="text-center bg-white/10 rounded-lg px-4 py-2"><span className="text-white text-xl font-bold">{countdown.days}</span><span className="text-cream/60 text-xs block">Days</span></div>
              <div className="text-center bg-white/10 rounded-lg px-4 py-2"><span className="text-white text-xl font-bold">{countdown.hours}</span><span className="text-cream/60 text-xs block">Hours</span></div>
              <div className="text-center bg-white/10 rounded-lg px-4 py-2"><span className="text-white text-xl font-bold">{countdown.mins}</span><span className="text-cream/60 text-xs block">Mins</span></div>
            </div>
            <Link to="/events" className="bg-primary text-white px-6 py-2.5 rounded-full text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 flex-shrink-0">Notify Me<ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>

      {/* SPECIAL OFFERS BADGE STRIP */}
      <div className="bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-8 mx-8">
            <Tag className="w-4 h-4 text-primary" /><span className="text-stone-700 text-sm uppercase tracking-wider">Flat 20% Off on First Order</span>
            <Tag className="w-4 h-4 text-primary" /><span className="text-stone-700 text-sm uppercase tracking-wider">Free Shipping Above ₹999</span>
            <Tag className="w-4 h-4 text-primary" /><span className="text-stone-700 text-sm uppercase tracking-wider">Buy 2 Get 1 Free on Dupattas</span>
            <Tag className="w-4 h-4 text-primary" /><span className="text-stone-700 text-sm uppercase tracking-wider">Extra 10% Off on Prepaid</span>
            <Tag className="w-4 h-4 text-primary" /><span className="text-stone-700 text-sm uppercase tracking-wider">Flat 20% Off on First Order</span>
            <Tag className="w-4 h-4 text-primary" /><span className="text-stone-700 text-sm uppercase tracking-wider">Free Shipping Above ₹999</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .animate-marquee{animation:marquee 25s linear infinite}
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>
    </div>
  );
};

export default Categories;