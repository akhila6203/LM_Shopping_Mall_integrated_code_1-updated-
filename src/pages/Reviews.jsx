import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Star, 
  Heart, 
  MessageCircle, 
  ThumbsUp, 
  Camera, 
  CheckCircle, 
  Quote, 
  Award, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
  Filter,
  ArrowRight,
  MapPin,
  Calendar,
  Verified
} from "lucide-react";

// Reviews Data - Limited to 3 reviews
const reviewsData = [
  { 
    id: 1,
    name: "Deepti Jain", 
    location: "Mumbai", 
    text: "Absolutely love the quality of sarees. The silk is premium and the colors are vibrant! The packaging was exquisite and delivery was prompt.", 
    stars: 5,
    date: "2 days ago",
    verified: true,
    helpful: 45,
    product: "Kanchipuram Silk Saree",
    productImage: "https://i.pinimg.com/736x/5d/0c/3e/5d0c3eecd96738b38dc3a31d01b04eab.jpg",
    images: ["https://i.pinimg.com/736x/8e/05/35/8e0535a0e8e424c5d1be77fea1235fda.jpg"],
    avatar: "https://i.pinimg.com/736x/25/09/4e/25094edff0359cada153734742efc860.jpg"
  },
  { 
    id: 2,
    name: "Vanika Patel", 
    location: "Ahmedabad", 
    text: "Best handloom fabrics I've found online. Fast delivery and beautiful packaging. The attention to detail is remarkable.", 
    stars: 5,
    date: "1 week ago",
    verified: true,
    helpful: 32,
    product: "Handloom Cotton Saree",
    productImage: "https://i.pinimg.com/736x/f9/9e/81/f99e814d974d6e1f59348cfc4156a880.jpg",
    images: [],
    avatar: "https://i.pinimg.com/736x/33/e2/04/33e20454ff3d260337ac462bba1958b3.jpg"
  },
  { 
    id: 3,
    name: "Annapurna R.", 
    location: "Chennai", 
    text: "The custom stitching service is excellent. Perfect fit every single time! They really understand what the customer wants.", 
    stars: 5,
    date: "3 days ago",
    verified: true,
    helpful: 28,
    product: "Custom Stitched Blouse",
    productImage: "https://i.pinimg.com/1200x/e8/b8/d5/e8b8d5bad513302ed6b39a3955396092.jpg",
    images: ["https://i.pinimg.com/1200x/4a/63/42/4a6342a84073bc2a1010b34e79f71dc3.jpg"],
    avatar: "https://i.pinimg.com/736x/8d/5e/c2/8d5ec2c40ff380826aed325529494877.jpg"
  }
];

// Video Testimonials
const videoTestimonials = [
  { id: 1, name: "Ritika Kapoor", thumbnail: "https://i.pinimg.com/736x/25/09/4e/25094edff0359cada153734742efc860.jpg", duration: "2:34", title: "My Wedding Shopping Experience" },
  { id: 2, name: "Anjali Mehta", thumbnail: "https://i.pinimg.com/736x/8e/05/35/8e0535a0e8e424c5d1be77fea1235fda.jpg", duration: "1:58", title: "Why I Love LM Showroom" },
  { id: 3, name: "Kavita Reddy", thumbnail: "https://i.pinimg.com/736x/42/f1/60/42f160dc6b99683365363bd91e42d364.jpg", duration: "3:12", title: "Custom Stitching Experience" },
];

// Review Statistics
const reviewStats = {
  average: 4.9,
  total: 1830,
  distribution: { 5: 1520, 4: 245, 3: 45, 2: 15, 1: 5 }
};

const Reviews = () => {
  const [likedReviews, setLikedReviews] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
  const [hoveredReview, setHoveredReview] = useState(null);

  const handleLike = (reviewId) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      
      {/* PREMIUM HERO WITH STATS */}
      <div className="relative w-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-cream text-xs uppercase tracking-[0.3em]">Our Community Loves Us</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>

            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white mb-4 tracking-tight">
              Customer <span className="text-primary italic">Narratives</span>
            </h1>
            
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 md:w-7 md:h-7 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-3xl md:text-4xl font-bold text-white">{reviewStats.average}</span>
              </div>
              <p className="text-cream/80 text-sm md:text-base">
                Based on <span className="font-bold text-white">{reviewStats.total.toLocaleString()}+</span> verified reviews
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="flex items-center gap-2 text-cream">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-white">100%</span>
                </div>
                <p className="text-cream/60 text-xs uppercase tracking-wider">Authentic Reviews</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-cream">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-white">4.9</span>
                </div>
                <p className="text-cream/60 text-xs uppercase tracking-wider">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-cream">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-white">50K+</span>
                </div>
                <p className="text-cream/60 text-xs uppercase tracking-wider">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO TESTIMONIALS CAROUSEL */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl text-stone-800">Video Testimonials</h2>
            <p className="text-stone-500 text-sm">Hear directly from our customers</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentVideoSlide(prev => Math.max(0, prev - 1))}
              className="p-2 rounded-full bg-white border border-stone-200 hover:border-primary hover:text-primary transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentVideoSlide(prev => Math.min(videoTestimonials.length - 3, prev + 1))}
              className="p-2 rounded-full bg-white border border-stone-200 hover:border-primary hover:text-primary transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videoTestimonials.slice(currentVideoSlide, currentVideoSlide + 3).map((video) => (
            <div key={video.id} className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="relative aspect-video">
                <img 
                  src={video.thumbnail} 
                  alt={video.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button className="bg-white/90 backdrop-blur-sm p-4 rounded-full text-primary hover:bg-white transition-all hover:scale-110">
                    <Play className="w-6 h-6 fill-primary" />
                  </button>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-medium text-stone-800">{video.name}</h4>
                <p className="text-sm text-stone-500">{video.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS GRID - Limited to 3 */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mb-6">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsData.map((review) => (
            <div 
              key={review.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100 overflow-hidden group"
              onMouseEnter={() => setHoveredReview(review.id)}
              onMouseLeave={() => setHoveredReview(null)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    {review.verified && (
                      <Verified className="absolute -bottom-1 -right-1 w-4 h-4 text-blue-500 fill-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-stone-800 font-semibold">{review.name}</h3>
                      {review.verified && (
                        <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{review.location}</span>
                      <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                      <Calendar className="w-3 h-3" />
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.stars ? 'fill-yellow-500 text-yellow-500' : 'text-stone-300'}`} 
                    />
                  ))}
                </div>

                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-primary/10 rotate-180" />
                  <p className="text-stone-600 text-sm leading-relaxed pl-4">
                    "{review.text}"
                  </p>
                </div>

                <Link 
                  to={`/product/${review.id}`}
                  className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg mb-4 group/product hover:bg-stone-100 transition"
                >
                  <img 
                    src={review.productImage} 
                    alt={review.product}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-stone-500">Reviewed Product</p>
                    <p className="text-sm font-medium text-stone-800 group-hover/product:text-primary transition">
                      {review.product}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover/product:text-primary group-hover/product:translate-x-1 transition-all" />
                </Link>

                {review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className="relative w-16 h-16 rounded-lg overflow-hidden group/image"
                      >
                        <img 
                          src={img} 
                          alt={`Review ${idx + 1}`}
                          className="w-full h-full object-cover group-hover/image:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-colors flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover/image:opacity-100 transition" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <button
                    onClick={() => handleLike(review.id)}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      likedReviews[review.id] 
                        ? 'text-primary' 
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${likedReviews[review.id] ? 'fill-primary' : ''}`} />
                    Helpful ({review.helpful + (likedReviews[review.id] ? 1 : 0)})
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WRITE A REVIEW CTA */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-heading text-2xl md:text-3xl text-stone-800 mb-3">
              Share Your Experience
            </h3>
            <p className="text-stone-600 mb-6">
              Your feedback helps us improve and helps other customers make informed decisions
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/write-review"
                className="bg-primary text-white px-8 py-3.5 rounded-full font-medium hover:bg-primary/90 transition flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <Star className="w-4 h-4" />
                Write a Review
              </Link>
              <Link
                to="/shop"
                className="bg-white text-stone-800 px-8 py-3.5 rounded-full font-medium border border-stone-200 hover:border-primary hover:text-primary transition flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Review" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

const X = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Reviews;