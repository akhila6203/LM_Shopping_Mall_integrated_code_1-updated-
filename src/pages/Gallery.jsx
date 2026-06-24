import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Instagram, 
  Sparkles, 
  Camera, 
  Play, 
  Grid3x3,
  LayoutGrid,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  Tag,
  MapPin,
  Verified,
  ArrowRight
} from "lucide-react";

const galleryData = [
  { 
    id: 1,
    image: "https://i.pinimg.com/736x/63/23/e9/6323e9d702e7238bbf3b7bef50d2f75a.jpg",
    type: "image",
    likes: 1247,
    comments: 89,
    user: { name: "Priya Sharma", avatar: "https://i.pinimg.com/736x/25/09/4e/25094edff0359cada153734742efc860.jpg", verified: true },
    caption: "Found my dream wedding saree at LM Showroom! 💕✨",
    location: "Mumbai, India",
    tags: ["Bridal", "Silk", "Wedding"],
    products: [{ name: "Kanchipuram Silk Saree", price: 45000, link: "/product/kanchipuram-silk" }],
    featured: true
  },
  { 
    id: 2,
    image: "https://i.pinimg.com/736x/96/b2/70/96b270ef3d9765fe2bad9193e30f60f5.jpg",
    type: "image",
    likes: 892,
    comments: 56,
    user: { name: "Anjali Mehta", avatar: "https://i.pinimg.com/736x/8e/05/35/8e0535a0e8e424c5d1be77fea1235fda.jpg", verified: true },
    caption: "Festive vibes in this gorgeous lehenga 🌸",
    location: "Delhi, India",
    tags: ["Festival", "Lehenga", "Designer"],
    products: [{ name: "Designer Banarasi Lehenga", price: 32500, link: "/product/banarasi-lehenga" }],
    featured: false
  },
  { 
    id: 3,
    image: "https://i.pinimg.com/736x/00/42/29/004229ff433308df02761588007723c8.jpg",
    type: "image",
    likes: 2156,
    comments: 134,
    user: { name: "Kavita Reddy", avatar: "https://i.pinimg.com/1200x/e8/b8/d5/e8b8d5bad513302ed6b39a3955396092.jpg", verified: true },
    caption: "Nothing beats the elegance of handloom ✨",
    location: "Bangalore, India",
    tags: ["Handloom", "Traditional", "Cotton"],
    products: [{ name: "Handloom Cotton Saree", price: 8995, link: "/product/handloom-cotton" }],
    featured: true
  },
  { 
    id: 4,
    image: "https://i.pinimg.com/736x/9e/b8/93/9eb89353194218ad192ff6096633c4bf.jpg",
    type: "image",
    likes: 673,
    comments: 42,
    user: { name: "Ritika Kapoor", avatar: "https://i.pinimg.com/736x/33/e2/04/33e20454ff3d260337ac462bba1958b3.jpg", verified: false },
    caption: "Summer wedding guest look 💫",
    location: "Jaipur, India",
    tags: ["Summer", "Wedding", "Pastel"],
    products: [{ name: "Pastel Organza Saree", price: 12995, link: "/product/organza-saree" }],
    featured: false
  },
  { 
    id: 5,
    image: "https://i.pinimg.com/736x/ca/23/4f/ca234fffe34e8f58ce3859fb9dacf649.jpg",
    type: "image",
    likes: 1834,
    comments: 112,
    user: { name: "Meera Singh", avatar: "https://i.pinimg.com/736x/8d/5e/c2/8d5ec2c40ff380826aed325529494877.jpg", verified: true },
    caption: "Twirling into the weekend 💃🏻",
    location: "Pune, India",
    tags: ["Party", "Sequins", "Glam"],
    products: [{ name: "Sequins Embroidered Lehenga", price: 28500, link: "/product/sequins-lehenga" }],
    featured: true
  },
  { 
    id: 6,
    image: "https://i.pinimg.com/1200x/94/0a/0d/940a0d334847414ae8ab0c60dcff3b97.jpg",
    type: "image",
    likes: 945,
    comments: 67,
    user: { name: "Deepti Jain", avatar: "https://i.pinimg.com/736x/5d/0c/3e/5d0c3eecd96738b38dc3a31d01b04eab.jpg", verified: true },
    caption: "Sunday brunch in style 🥂",
    location: "Mumbai, India",
    tags: ["Brunch", "Kurta", "Casual"],
    products: [{ name: "Chikankari Kurta Set", price: 6995, link: "/product/chikankari-kurta" }],
    featured: false
  },
  { 
    id: 7,
    image: "https://i.pinimg.com/736x/3a/3a/50/3a3a5060d7217cc617eb4bffc7a76da1.jpg",
    type: "image",
    likes: 3124,
    comments: 203,
    user: { name: "Sneha Sharma", avatar: "https://i.pinimg.com/736x/16/fe/48/16fe48df427a60a0c2fd3fb05f620792.jpg", verified: true },
    caption: "My bridal trousseau dreams come true 💫",
    location: "Delhi, India",
    tags: ["Bridal", "Trousseau", "Luxury"],
    products: [
      { name: "Bridal Kanjeevaram", price: 55000, link: "/product/bridal-kanjeevaram" },
      { name: "Wedding Lehenga", price: 75000, link: "/product/wedding-lehenga" }
    ],
    featured: true
  },
  { 
    id: 8,
    image: "https://i.pinimg.com/1200x/5d/a5/8e/5da58ef73740bbe3f20b7e487234620c.jpg",
    type: "image",
    likes: 1567,
    comments: 98,
    user: { name: "Vanika Patel", avatar: "https://i.pinimg.com/736x/25/09/4e/25094edff0359cada153734742efc860.jpg", verified: false },
    caption: "When the dupatta steals the show ✨",
    location: "Ahmedabad, India",
    tags: ["Dupatta", "Embroidery", "Ethnic"],
    products: [{ name: "Embroidered Dupatta", price: 4995, link: "/product/embroidered-dupatta" }],
    featured: false
  },
  { 
    id: 9,
    image: "https://i.pinimg.com/736x/5d/0c/3e/5d0c3eecd96738b38dc3a31d01b04eab.jpg",
    type: "image",
    likes: 2789,
    comments: 156,
    user: { name: "Annapurna R.", avatar: "https://i.pinimg.com/1200x/4a/63/42/4a6342a84073bc2a1010b34e79f71dc3.jpg", verified: true },
    caption: "Traditional weaves, modern silhouette 🌸",
    location: "Chennai, India",
    tags: ["Traditional", "Modern", "Fusion"],
    products: [{ name: "Fusion Saree Gown", price: 18995, link: "/product/fusion-saree-gown" }],
    featured: true
  }
];

const reelsData = [
  { id: 1, thumbnail: "https://i.pinimg.com/736x/63/23/e9/6323e9d702e7238bbf3b7bef50d2f75a.jpg", duration: "0:32", views: "12.5K", title: "Saree Draping Tutorial" },
  { id: 2, thumbnail: "https://i.pinimg.com/736x/4f/6b/4e/4f6b4e4e9285cbd61d23f2fac916ed1f.jpg", duration: "0:45", views: "8.2K", title: "Wedding Collection BTS" },
  { id: 3, thumbnail: "https://i.pinimg.com/736x/00/42/29/004229ff433308df02761588007723c8.jpg", duration: "0:28", views: "15.1K", title: "Fabric Showcase" },
  { id: 4, thumbnail: "https://i.pinimg.com/736x/9e/b8/93/9eb89353194218ad192ff6096633c4bf.jpg", duration: "0:52", views: "6.8K", title: "Customer Unboxing" }
];

const featuredCollections = [
  { name: "Bridal Edit", image: "https://i.pinimg.com/736x/77/65/2a/77652a98eefd7e053f5f5b3ccdb4cfb1.jpg", count: 24 },
  { name: "Festival Picks", image: "https://i.pinimg.com/736x/5a/5d/cb/5a5dcbcf2a6cedd138c36f4693579881.jpg", count: 18 },
  { name: "Party Wear", image: "https://i.pinimg.com/736x/ca/23/4f/ca234fffe34e8f58ce3859fb9dacf649.jpg", count: 32 }
];

const instagramStats = { followers: "156K", posts: "2.4K", engagement: "4.8%" };

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [likedImages, setLikedImages] = useState({});
  const [currentReelSlide, setCurrentReelSlide] = useState(0);
  const [hoveredImage, setHoveredImage] = useState(null);

  const tabs = [
    { id: "all", label: "All Posts", count: galleryData.length },
    { id: "featured", label: "Featured", count: galleryData.filter(g => g.featured).length },
    { id: "bridal", label: "Bridal", count: galleryData.filter(g => g.tags.includes("Bridal")).length },
    { id: "festive", label: "Festive", count: galleryData.filter(g => g.tags.includes("Festival") || g.tags.includes("Wedding")).length }
  ];

  const filteredGallery = galleryData.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "featured") return item.featured;
    if (activeTab === "bridal") return item.tags.includes("Bridal");
    if (activeTab === "festive") return item.tags.includes("Festival") || item.tags.includes("Wedding");
    return true;
  });

  const handleLike = (imageId) => setLikedImages(prev => ({ ...prev, [imageId]: !prev[imageId] }));
  const formatNumber = (num) => num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      
      <div className="relative w-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full border border-white/20 mb-6"><Instagram className="w-4 h-4 text-pink-500" /><span className="text-cream text-xs uppercase tracking-[0.3em]">@LMShowroom</span></div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight">Our <span className="text-primary italic">Lookbook</span></h1>
              <p className="font-body text-gray-200 text-sm md:text-base max-w-lg mb-6">Real customers, real style. Tag <span className="text-primary font-medium">#LMStyle</span> to be featured.</p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition flex items-center gap-2"><Instagram className="w-4 h-4" />Follow Us</a>
                <Link to="/shop" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition flex items-center gap-2"><ShoppingBag className="w-4 h-4" />Shop the Look</Link>
              </div>
            </div>
            <div className="flex gap-6 md:gap-10">
              <div className="text-center"><div className="text-3xl md:text-4xl font-bold text-white">{instagramStats.followers}</div><p className="text-cream/60 text-xs uppercase tracking-wider">Followers</p></div>
              <div className="text-center"><div className="text-3xl md:text-4xl font-bold text-white">{instagramStats.posts}</div><p className="text-cream/60 text-xs uppercase tracking-wider">Posts</p></div>
              <div className="text-center"><div className="text-3xl md:text-4xl font-bold text-primary">{instagramStats.engagement}</div><p className="text-cream/60 text-xs uppercase tracking-wider">Engagement</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3"><div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg"><Play className="w-4 h-4 text-white" /></div><div><h3 className="font-heading text-lg text-stone-800">Watch Reels</h3><p className="text-xs text-stone-500">Short videos from our community</p></div></div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentReelSlide(prev => Math.max(0, prev - 1))} className="p-2 rounded-full bg-stone-100 hover:bg-primary hover:text-white transition"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setCurrentReelSlide(prev => Math.min(reelsData.length - 4, prev + 1))} className="p-2 rounded-full bg-stone-100 hover:bg-primary hover:text-white transition"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reelsData.slice(currentReelSlide, currentReelSlide + 4).map((reel) => (
              <div key={reel.id} className="group relative rounded-xl overflow-hidden cursor-pointer">
                <div className="relative aspect-[9/16]"><img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div><div className="absolute inset-0 flex items-center justify-center"><div className="bg-white/90 backdrop-blur-sm p-3 rounded-full group-hover:scale-110 transition-transform"><Play className="w-5 h-5 fill-primary text-primary" /></div></div><div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{reel.duration}</div><div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1"><Eye className="w-3 h-3" />{reel.views}</div></div>
                <p className="text-sm font-medium text-stone-800 mt-2 line-clamp-1">{reel.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4">
          {featuredCollections.map((collection, idx) => (
            <Link key={idx} to={`/collection/${collection.name.toLowerCase().replace(" ", "-")}`} className="group relative h-24 md:h-32 rounded-xl overflow-hidden">
              <img src={collection.image} alt={collection.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-3 left-3"><p className="text-white text-sm font-medium">{collection.name}</p><p className="text-cream/80 text-xs">{collection.count} looks</p></div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-stone-600 border border-stone-200 hover:border-primary hover:text-primary'}`}>{tab.label} <span className="ml-1 text-xs">({tab.count})</span></button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {filteredGallery.map((item) => (
            <GalleryCard key={item.id} item={item} likedImages={likedImages} onLike={handleLike} onImageClick={() => setSelectedImage(item)} onHover={setHoveredImage} hoveredImage={hoveredImage} />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-primary/5 via-pink-500/5 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6"><Camera className="w-4 h-4 text-primary" /><span className="text-xs uppercase tracking-wider text-stone-600">#LMStyle</span></div>
            <h3 className="font-heading text-2xl md:text-3xl text-stone-800 mb-3">Get Featured in Our Lookbook</h3>
            <p className="text-stone-600 mb-6">Share your LM Showroom style on Instagram and tag us for a chance to be featured</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3.5 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition flex items-center gap-2"><Instagram className="w-4 h-4" />Share Your Look</a>
              <Link to="/shop" className="bg-white text-stone-800 px-8 py-3.5 rounded-full font-medium border border-stone-200 hover:border-primary hover:text-primary transition flex items-center gap-2 shadow-sm"><ShoppingBag className="w-4 h-4" />Shop Now</Link>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition z-50"><X className="w-6 h-6" /></button>
          <div className="max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row gap-6 p-4" onClick={e => e.stopPropagation()}>
            <div className="flex-1 flex items-center justify-center"><img src={selectedImage.image} alt={selectedImage.caption} className="max-w-full max-h-[80vh] object-contain rounded-lg" /></div>
            <div className="w-full md:w-80 bg-white rounded-xl p-5 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-stone-100"><img src={selectedImage.user.avatar} alt={selectedImage.user.name} className="w-10 h-10 rounded-full object-cover" /><div><div className="flex items-center gap-1"><span className="font-medium text-stone-800">{selectedImage.user.name}</span>{selectedImage.user.verified && <Verified className="w-3.5 h-3.5 text-blue-500" />}</div><div className="flex items-center gap-1 text-xs text-stone-500"><MapPin className="w-3 h-3" />{selectedImage.location}</div></div></div>
              <p className="text-sm text-stone-700 mb-4">{selectedImage.caption}</p>
              <div className="flex flex-wrap gap-2 mb-4">{selectedImage.tags.map((tag, idx) => (<span key={idx} className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">#{tag}</span>))}</div>
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stone-100">
                <button onClick={() => handleLike(selectedImage.id)} className="flex items-center gap-1.5 text-sm transition-colors" style={{ color: likedImages[selectedImage.id] ? '#ef4444' : '#78716c' }}><Heart className={`w-5 h-5 ${likedImages[selectedImage.id] ? 'fill-red-500' : ''}`} />{formatNumber(selectedImage.likes + (likedImages[selectedImage.id] ? 1 : 0))}</button>
                <div className="flex items-center gap-1.5 text-sm text-stone-500"><MessageCircle className="w-5 h-5" />{formatNumber(selectedImage.comments)}</div>
                <button className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700"><Share2 className="w-5 h-5" /></button>
              </div>
              <div><p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2"><ShoppingBag className="w-3.5 h-3.5" />Shop This Look</p><div className="space-y-3">{selectedImage.products.map((product, idx) => (<Link key={idx} to={product.link} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg group hover:bg-stone-100 transition"><div className="w-12 h-12 bg-white rounded-md flex items-center justify-center"><Tag className="w-5 h-5 text-primary" /></div><div className="flex-1"><p className="text-sm font-medium text-stone-800 group-hover:text-primary transition">{product.name}</p><p className="text-xs text-stone-500">₹{product.price.toLocaleString("en-IN")}</p></div><ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all" /></Link>))}</div></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`@keyframes pulse{0%,100%{opacity:0.5}50%{opacity:0.8}}.animate-pulse{animation:pulse 3s ease-in-out infinite}.delay-1000{animation-delay:1s}`}</style>
    </div>
  );
};

// Gallery Card - Natural height, no forced sizes, clean masonry
const GalleryCard = ({ item, likedImages, onLike, onImageClick, onHover, hoveredImage }) => {
  return (
    <div className="group relative break-inside-avoid mb-4" onMouseEnter={() => onHover(item.id)} onMouseLeave={() => onHover(null)}>
      <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
        <img src={item.image} alt={item.caption} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" onClick={() => onImageClick(item)} />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${hoveredImage === item.id ? 'opacity-100' : 'opacity-0'}`} onClick={() => onImageClick(item)}>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-3 mb-2"><img src={item.user.avatar} alt={item.user.name} className="w-8 h-8 rounded-full border-2 border-white" /><span className="text-white text-sm font-medium">{item.user.name}</span>{item.user.verified && <Verified className="w-3.5 h-3.5 text-blue-400" />}</div>
            <p className="text-white/90 text-xs line-clamp-2">{item.caption}</p>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <button onClick={(e) => { e.stopPropagation(); onLike(item.id); }} className={`p-2 rounded-full shadow-md transition-all hover:scale-110 ${likedImages[item.id] ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm text-stone-600 hover:bg-white'}`}><Heart className={`w-4 h-4 ${likedImages[item.id] ? 'fill-white' : ''}`} /></button>
        </div>
        {item.featured && <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><Sparkles className="w-3 h-3" />Featured</div>}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white text-xs"><span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{item.likes >= 1000 ? (item.likes / 1000).toFixed(1) + 'K' : item.likes}</span><span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{item.comments >= 1000 ? (item.comments / 1000).toFixed(1) + 'K' : item.comments}</span></div>
      </div>
    </div>
  );
};

export default Gallery;