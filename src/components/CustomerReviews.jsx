import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const reviews = [
  { name: "Deepti Jain", location: "Mumbai", rating: 5, text: "Absolutely love the quality of sarees. The silk is premium and the colors are vibrant!" },
  { name: "Vanika Patel", location: "Ahmedabad", rating: 5, text: "Best handloom fabrics I've found online. Fast delivery and beautiful packaging." },
  { name: "Annapurna R.", location: "Chennai", rating: 5, text: "The custom stitching service is excellent. Perfect fit every single time!" },
  { name: "Priya Sharma", location: "Delhi", rating: 5, text: "Amazing collection of block print dupattas. Already ordered my third one!" },
];

const CustomerReviews = () => {
  const [current, setCurrent] = useState(0);
  const { ref, isVisible } = useScrollAnimation();
  const visible = 3;
  const max = Math.max(0, reviews.length - visible);

  return (
    // 🌟 SPACE FIX: Yahan pt-2 aur md:pt-4 lagaya hai jisse gap kam ho gaya
    <section id="reviews" className="pt-2 pb-6 md:pt-4 md:pb-10 bg-card scroll-mt-20" ref={ref}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl md:text-4xl font-heading text-center mb-2 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          Customer Narratives
        </h2>
        <div className={`flex justify-center gap-1 mb-2 ${isVisible ? "animate-fade-up stagger-1" : "opacity-0"}`}>
          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
        </div>
        <p className={`text-center text-sm text-muted-foreground mb-10 ${isVisible ? "animate-fade-up stagger-2" : "opacity-0"}`}>
          Based on 1830 reviews ⭐
        </p>

        <div className={`relative ${isVisible ? "animate-fade-up stagger-3" : "opacity-0"}`}>
          <div className="flex gap-6 overflow-hidden">
            {reviews.slice(current, current + visible).map((r) => (
              <div key={r.name} className="flex-1 min-w-0 bg-background rounded-lg p-6 text-center transition-all duration-300 hover:shadow-md border border-border/50">
                <div className="flex justify-center gap-0.5 mb-3">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-4 italic">"{r.text}"</p>
                <p className="font-medium text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.location}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-secondary transition disabled:opacity-30 border border-border">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrent(Math.min(max, current + 1))} disabled={current >= max} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-secondary transition disabled:opacity-30 border border-border">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;