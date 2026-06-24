import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles,Star} from "lucide-react";
import { getAboutUs } from "@/services/aboutService";
import { getImageUrl } from "@/api/axiosClient";

const About = () => {
  const [aboutData, setAboutData] = useState({
    title: "",
    content:"",
    image: "",
  });
  
  useEffect(() => {
  const loadAboutUs = async () => {
    try {
      const data = await getAboutUs();

      setAboutData({
        title: data?.title || "",
        content:
          data?.content ||"",
        image: data?.image ? getImageUrl(data.image) : "",
      });
    } catch (error) {
      console.error("About us fetch error:", error);
    }
  };

  loadAboutUs();
}, []);

  
  return (
    <div className="w-full bg-cream">
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="absolute top-10 left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-5 right-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-semibold">About Us</span>
          </div>
          
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 text-cream text-xs uppercase tracking-[0.3em] px-3 py-1 rounded-full border border-white/20 mb-3">
              <Sparkles className="w-3 h-3 text-primary" /> Our Story
            </span>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              Weaving Traditions,<br />
              <span className="text-primary italic">Creating Heirlooms</span>
            </h1>
            <p className="text-cream/70 text-base max-w-2xl mx-auto mt-3">
              Discover the legacy behind LM Showroom - where every saree tells a story of heritage, craftsmanship, and love
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* OUR STORY */}
      {/* ======================================================= */}
     
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-24 md:pb-32">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-full lg:w-1/2 space-y-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Our Story</span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl text-stone-800 leading-tight">
               {aboutData.title}
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            <div
              className="text-stone-600 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutData.content }}
            />
            
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-stone-200 overflow-hidden">
                    <img src={`https://i.pinimg.com/736x/${i === 1 ? '25/09/4e/25094edff0359cada153734742efc860' : i === 2 ? '8e/05/35/8e0535a0e8e424c5d1be77fea1235fda' : i === 3 ? '33/e2/04/33e20454ff3d260337ac462bba1958b3' : '5d/0c/3e/5d0c3eecd96738b38dc3a31d01b04eab'}.jpg`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-xs text-stone-500">Trusted by 50,000+ customers</p>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
  <div className="relative">
    <div className="absolute -top-3 -left-3 w-20 h-20 bg-primary/10 rounded-2xl"></div>
    <div className="absolute -bottom-3 -right-3 w-28 h-28 bg-amber-500/10 rounded-2xl"></div>

    <div className="relative h-[320px] md:h-[420px] rounded-xl overflow-hidden shadow-md">
      <img
        src={
          aboutData.image ||
          "https://i.pinimg.com/1200x/d0/3c/66/d03c66620cf836227a25475f34b86ffb.jpg"
        }
        alt={aboutData.title || "About Us"}
        className="w-full h-full object-cover hover:scale-105 transition duration-500"
      />
    </div>
  </div>
</div>
          
        </div>
      </section>
    </div>
  );
};

export default About;



// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { 
//   ChevronRight, Sparkles, Award, Users, ShoppingBag, Heart, 
//   Star, Quote, TrendingUp, Shield, Truck, Clock, MapPin,
//   Phone, Mail, Globe, Instagram, Facebook, Youtube, ArrowRight,
//   Play, Pause, Volume2, VolumeX
// } from "lucide-react";
// import { getAboutUs } from "@/services/aboutService";
// import { getImageUrl } from "@/api/axiosClient";

// const About = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isMuted, setIsMuted] = useState(true);
//   const [activeTestimonial, setActiveTestimonial] = useState(0);
//   const [stats, setStats] = useState({
//     customers: 0,
//     products: 0,
//     years: 0,
//     cities: 0
//   });
//   const [aboutData, setAboutData] = useState({
//     title: "",
//     content:"",
//     image: "",
//   });
//   const videoRef = useRef(null);
//   useEffect(() => {
//   const loadAboutUs = async () => {
//     try {
//       const data = await getAboutUs();

//       setAboutData({
//         title: data?.title || "Weaving Traditions, Creating Heirlooms",
//         content:
//           data?.content ||
//           "Discover the legacy behind LM Showroom - where every saree tells a story of heritage, craftsmanship, and love",
//         image: data?.image ? getImageUrl(data.image) : "",
//       });
//     } catch (error) {
//       console.error("About us fetch error:", error);
//     }
//   };

//   loadAboutUs();
// }, []);

//   // Hero Slides
//   const heroSlides = [
//     {
//       type: "video",
//       src: "https://player.vimeo.com/external/471368789.hd.mp4?s=3c3b3c3b3c3b3c3b3c3b3c3b3c3b3c3b&profile_id=175",
//       poster: "https://i.pinimg.com/1200x/d0/3c/66/d03c66620cf836227a25475f34b86ffb.jpg",
//       title: "Our Heritage",
//       subtitle: "Weaving traditions since 1985"
//     },
//     {
//       type: "image",
//       src: "https://i.pinimg.com/1200x/38/59/35/385935f69920a909cc7f9a2cc99cf4f9.jpg",
//       title: "Craftsmanship",
//       subtitle: "Every thread tells a story"
//     },
//     {
//       type: "image",
//       src: "https://i.pinimg.com/1200x/a2/a5/2e/a2a52e3d157a4ff42bc97f7603b0c64d.jpg",
//       title: "Timeless Elegance",
//       subtitle: "Curating the finest since generations"
//     }
//   ];

//   // Mission & Values
//   const values = [
//     { 
//       icon: Award, 
//       title: "Authenticity", 
//       desc: "100% genuine handloom products sourced directly from artisans",
//       color: "from-amber-500 to-orange-600"
//     },
//     { 
//       icon: Heart, 
//       title: "Craftsmanship", 
//       desc: "Supporting over 500+ skilled weavers and their families",
//       color: "from-rose-500 to-pink-600"
//     },
//     { 
//       icon: Shield, 
//       title: "Quality", 
//       desc: "Rigorous quality checks ensuring premium standards",
//       color: "from-blue-500 to-cyan-600"
//     },
//     { 
//       icon: Globe, 
//       title: "Sustainability", 
//       desc: "Eco-friendly practices and ethical sourcing",
//       color: "from-green-500 to-emerald-600"
//     }
//   ];

//   // Team Members
//   const team = [
//     { name: "Lakshmi Narayana", role: "Founder & Master Weaver", image: "https://i.pinimg.com/736x/5b/1e/a9/5b1ea94e36f3c891a8b80bda5f0c0046.jpg", experience: "35+ years" },
//     { name: "Meera Reddy", role: "Creative Director", image: "https://i.pinimg.com/1200x/c3/34/09/c334099bf91529cb90d9c1cb86790bd5.jpg", experience: "15+ years" },
//     { name: "Arjun Sharma", role: "Head of Design", image: "https://i.pinimg.com/736x/88/e3/18/88e3189b3f48c5aa036f422382aac976.jpg", experience: "12+ years" },
//     { name: "Priya Kapoor", role: "Customer Experience", image: "https://i.pinimg.com/736x/8e/1f/38/8e1f38a2c226f46854a9f6921eea450c.jpg", experience: "10+ years" }
//   ];

//   // Testimonials
//   const testimonials = [
//     { 
//       text: "The quality of their Kanchipuram sarees is unmatched. I've been a loyal customer for over a decade!", 
//       name: "Anjali Sharma", 
//       location: "Mumbai",
//       rating: 5,
//       image: "https://i.pinimg.com/736x/8e/1f/38/8e1f38a2c226f46854a9f6921eea450c.jpg"
//     },
//     { 
//       text: "LM Showroom has the finest collection of handloom fabrics. Their customer service is exceptional!", 
//       name: "Priya Menon", 
//       location: "Chennai",
//       rating: 5,
//       image: "https://i.pinimg.com/736x/8e/1f/38/8e1f38a2c226f46854a9f6921eea450c.jpg"
//     },
//     { 
//       text: "I found my dream wedding saree here. The customization options made it truly special.", 
//       name: "Kavita Reddy", 
//       location: "Bangalore",
//       rating: 5,
//       image: "https://i.pinimg.com/736x/8e/1f/38/8e1f38a2c226f46854a9f6921eea450c.jpg"
//     }
//   ];

//   // Milestones
//   const milestones = [
//     { year: "1985", title: "Founded", desc: "Started as a small weaving unit in Nellore" },
//     { year: "1995", title: "First Showroom", desc: "Opened our flagship store on Kapu Street" },
//     { year: "2005", title: "Artisan Network", desc: "Partnered with 100+ rural weavers" },
//     { year: "2015", title: "Digital Presence", desc: "Launched LM Showroom online" },
//     { year: "2025", title: "Global Reach", desc: "Shipping to 20+ countries worldwide" }
//   ];

//   // Auto-rotate slides
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // Auto-rotate testimonials
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
//     }, 6000);
//     return () => clearInterval(interval);
//   }, [testimonials.length]);

//   // Animate stats on scroll
//   useEffect(() => {
//     const animateStats = () => {
//       const targets = { customers: 50000, products: 10000, years: 40, cities: 25 };
//       const duration = 2000;
//       const steps = 60;
//       const interval = duration / steps;
      
//       let currentStep = 0;
//       const timer = setInterval(() => {
//         currentStep++;
//         const progress = currentStep / steps;
        
//         setStats({
//           customers: Math.round(targets.customers * progress),
//           products: Math.round(targets.products * progress),
//           years: Math.round(targets.years * progress),
//           cities: Math.round(targets.cities * progress)
//         });
        
//         if (currentStep >= steps) {
//           clearInterval(timer);
//           setStats(targets);
//         }
//       }, interval);
      
//       return () => clearInterval(timer);
//     };
    
//     animateStats();
//   }, []);

//   return (
//     <div className="w-full bg-cream">
      
//       {/* ======================================================= */}
//       {/* 🌟 PREMIUM HERO SECTION - REDUCED SIZE */}
//       {/* ======================================================= */}
//       <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-0 left-0 w-full h-full" style={{ 
//             backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)',
//             backgroundSize: '50px 50px'
//           }}></div>
//         </div>
//         <div className="absolute top-10 left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-5 right-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl"></div>
        
//         <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-12">
//           {/* Breadcrumb */}
//           <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
//             <Link to="/" className="hover:text-primary transition-colors">Home</Link>
//             <ChevronRight className="w-3 h-3" />
//             <span className="text-primary font-semibold">About Us</span>
//           </div>
          
//           <div className="text-center">
//             <span className="inline-flex items-center gap-2 bg-white/10 text-cream text-xs uppercase tracking-[0.3em] px-3 py-1 rounded-full border border-white/20 mb-3">
//               <Sparkles className="w-3 h-3 text-primary" /> Our Story
//             </span>
//             <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
//               Weaving Traditions,<br />
//               <span className="text-primary italic">Creating Heirlooms</span>
//             </h1>
//             <p className="text-cream/70 text-base max-w-2xl mx-auto mt-3">
//               Discover the legacy behind LM Showroom - where every saree tells a story of heritage, craftsmanship, and love
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ======================================================= */}
//       {/* STATS COUNTER */}
//       {/* ======================================================= */}
//       <section className="bg-white py-8 border-b border-stone-100">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center">
//               <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-full">
//                 <Users className="w-5 h-5 text-primary" />
//               </div>
//               <p className="text-2xl font-bold text-stone-800">{stats.customers.toLocaleString()}+</p>
//               <p className="text-xs text-stone-500">Happy Customers</p>
//             </div>
//             <div className="text-center">
//               <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-full">
//                 <ShoppingBag className="w-5 h-5 text-primary" />
//               </div>
//               <p className="text-2xl font-bold text-stone-800">{stats.products.toLocaleString()}+</p>
//               <p className="text-xs text-stone-500">Products Curated</p>
//             </div>
//             <div className="text-center">
//               <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-full">
//                 <Award className="w-5 h-5 text-primary" />
//               </div>
//               <p className="text-2xl font-bold text-stone-800">{stats.years}+</p>
//               <p className="text-xs text-stone-500">Years of Excellence</p>
//             </div>
//             <div className="text-center">
//               <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-full">
//                 <MapPin className="w-5 h-5 text-primary" />
//               </div>
//               <p className="text-2xl font-bold text-stone-800">{stats.cities}+</p>
//               <p className="text-xs text-stone-500">Cities Served</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ======================================================= */}
//       {/* OUR STORY */}
//       {/* ======================================================= */}
//       <section className="max-w-7xl mx-auto px-4 py-12">
//         <div className="flex flex-col lg:flex-row gap-8 items-center">
//           <div className="w-full lg:w-1/2 space-y-3">
//             <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
//               <Sparkles className="w-3.5 h-3.5 text-primary" />
//               <span className="text-xs font-bold text-primary uppercase tracking-widest">Our Story</span>
//             </div>
//             <h2 className="font-heading text-2xl md:text-3xl text-stone-800 leading-tight">
//               A Legacy of <br />
//               <span className="text-primary italic">Timeless Elegance</span>
//             </h2>
//             <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
//             <div
//               className="text-stone-600 text-sm leading-relaxed"
//               dangerouslySetInnerHTML={{ __html: aboutData.content }}
//             />
            
//             <div className="flex items-center gap-3 pt-2">
//               <div className="flex -space-x-2">
//                 {[1, 2, 3, 4].map((i) => (
//                   <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-stone-200 overflow-hidden">
//                     <img src={`https://i.pinimg.com/736x/${i === 1 ? '25/09/4e/25094edff0359cada153734742efc860' : i === 2 ? '8e/05/35/8e0535a0e8e424c5d1be77fea1235fda' : i === 3 ? '33/e2/04/33e20454ff3d260337ac462bba1958b3' : '5d/0c/3e/5d0c3eecd96738b38dc3a31d01b04eab'}.jpg`} alt="" className="w-full h-full object-cover" />
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <div className="flex items-center gap-0.5">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
//                   ))}
//                 </div>
//                 <p className="text-xs text-stone-500">Trusted by 50,000+ customers</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="w-full lg:w-1/2">
//             <div className="relative">
//               <div className="absolute -top-3 -left-3 w-20 h-20 bg-primary/10 rounded-2xl"></div>
//               <div className="absolute -bottom-3 -right-3 w-28 h-28 bg-amber-500/10 rounded-2xl"></div>
//               <div className="relative grid grid-cols-2 gap-3">
//                 <div className="space-y-3">
//                   <div className="h-36 rounded-xl overflow-hidden shadow-md">
//                     <img src="https://i.pinimg.com/1200x/d0/3c/66/d03c66620cf836227a25475f34b86ffb.jpg" alt="Weaving" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
//                   </div>
//                   <div className="h-24 rounded-xl overflow-hidden shadow-md">
//                     <img src="https://i.pinimg.com/1200x/38/59/35/385935f69920a909cc7f9a2cc99cf4f9.jpg" alt="Fabric" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
//                   </div>
//                 </div>
//                 <div className="space-y-3 pt-6">
//                   <div className="h-24 rounded-xl overflow-hidden shadow-md">
//                     <img src="https://i.pinimg.com/1200x/a2/a5/2e/a2a52e3d157a4ff42bc97f7603b0c64d.jpg" alt="Looms" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
//                   </div>
//                   <div className="h-36 rounded-xl overflow-hidden shadow-md">
//                     <img src="https://i.pinimg.com/736x/4f/0c/79/4f0c799c67e8be10b14ad150b54f53b4.jpg" alt="Silk" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ======================================================= */}
//       {/* OUR VALUES */}
//       {/* ======================================================= */}
//       <section className="bg-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-8">
//             <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium">What We Stand For</span>
//             <h3 className="font-heading text-2xl text-stone-800 mt-1">Our Core Values</h3>
//             <p className="text-stone-500 max-w-2xl mx-auto mt-1 text-sm">
//               The principles that guide everything we do at LM Showroom
//             </p>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {values.map((value, idx) => (
//               <div key={idx} className="group bg-stone-50 rounded-xl p-4 text-center hover:shadow-md transition-all">
//                 <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
//                   <value.icon className="w-5 h-5 text-white" />
//                 </div>
//                 <h4 className="font-heading text-sm font-bold text-stone-800 mb-1">{value.title}</h4>
//                 <p className="text-xs text-stone-500 leading-relaxed">{value.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ======================================================= */}
//       {/* MILESTONES TIMELINE */}
//       {/* ======================================================= */}
//       <section className="py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-8">
//             <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium">Our Journey</span>
//             <h3 className="font-heading text-2xl text-stone-800 mt-1">Milestones of Excellence</h3>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//             {milestones.map((milestone, idx) => (
//               <div key={idx} className="text-center p-3 bg-stone-50 rounded-xl">
//                 <span className="text-xl font-heading font-bold text-primary">{milestone.year}</span>
//                 <h4 className="font-bold text-stone-800 text-sm mt-1">{milestone.title}</h4>
//                 <p className="text-xs text-stone-500 mt-1">{milestone.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ======================================================= */}
//       {/* MEET THE TEAM */}
//       {/* ======================================================= */}
//       <section className="bg-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-8">
//             <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium">The People Behind</span>
//             <h3 className="font-heading text-2xl text-stone-800 mt-1">Meet Our Family</h3>
//             <p className="text-stone-500 max-w-2xl mx-auto mt-1 text-sm">
//               Passionate individuals dedicated to bringing you the finest ethnic wear
//             </p>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {team.map((member, idx) => (
//               <div key={idx} className="bg-stone-50 rounded-xl overflow-hidden hover:shadow-md transition-all">
//                 <div className="relative h-44 overflow-hidden">
//                   <img 
//                     src={member.image} 
//                     alt={member.name} 
//                     className="w-full h-full object-cover hover:scale-105 transition duration-500"
//                   />
//                 </div>
//                 <div className="p-3 text-center">
//                   <h4 className="font-heading font-bold text-stone-800 text-sm">{member.name}</h4>
//                   <p className="text-primary text-xs font-medium">{member.role}</p>
//                   <p className="text-xs text-stone-500 mt-0.5">{member.experience}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ======================================================= */}
//       {/* TESTIMONIALS */}
//       {/* ======================================================= */}
//       <section className="py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-8">
//             <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium">Customer Love</span>
//             <h3 className="font-heading text-2xl text-stone-800 mt-1">What Our Customers Say</h3>
//           </div>
          
//           <div className="max-w-3xl mx-auto">
//             <div className="relative min-h-[200px]">
//               {testimonials.map((testimonial, idx) => (
//                 <div 
//                   key={idx}
//                   className={`absolute inset-0 transition-all duration-700 ${
//                     activeTestimonial === idx 
//                       ? 'opacity-100 translate-x-0' 
//                       : 'opacity-0 translate-x-10 pointer-events-none'
//                   }`}
//                 >
//                   <div className="bg-white rounded-xl shadow-md p-5">
//                     <Quote className="w-8 h-8 text-primary/20 mb-2" />
//                     <p className="text-stone-700 italic text-sm mb-3">
//                       "{testimonial.text}"
//                     </p>
//                     <div className="flex items-center gap-3">
//                       <img 
//                         src={testimonial.image} 
//                         alt={testimonial.name} 
//                         className="w-10 h-10 rounded-full object-cover border-2 border-primary"
//                       />
//                       <div>
//                         <div className="flex items-center gap-0.5 mb-0.5">
//                           {[...Array(5)].map((_, i) => (
//                             <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
//                           ))}
//                         </div>
//                         <h4 className="font-heading font-bold text-stone-800 text-sm">{testimonial.name}</h4>
//                         <p className="text-xs text-stone-500">{testimonial.location}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {/* Testimonial Dots */}
//             <div className="flex justify-center gap-2 mt-5">
//               {testimonials.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setActiveTestimonial(idx)}
//                   className={`w-1.5 h-1.5 rounded-full transition-all ${
//                     activeTestimonial === idx ? 'w-5 bg-primary' : 'bg-stone-300'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ======================================================= */}
//       {/* VISIT US CTA - CLEAN WHITE SECTION */}
//       {/* ======================================================= */}
//       <section className="bg-white py-12 border-t border-stone-100">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h3 className="font-heading text-2xl md:text-3xl text-stone-800 mb-2">Visit Our Flagship Store</h3>
//           <p className="text-stone-500 max-w-2xl mx-auto mb-6 text-sm">
//             Experience the beauty of handcrafted textiles in person at our Nellore showroom
//           </p>
          
//           <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
//             <div className="flex items-center gap-2 text-stone-600 text-sm">
//               <MapPin className="w-4 h-4 text-primary" />
//               <span>Kapu Street, Nellore, Andhra Pradesh</span>
//             </div>
//             <div className="flex items-center gap-2 text-stone-600 text-sm">
//               <Phone className="w-4 h-4 text-primary" />
//               <span>+91 98765 43210</span>
//             </div>
//             <div className="flex items-center gap-2 text-stone-600 text-sm">
//               <Clock className="w-4 h-4 text-primary" />
//               <span>Mon - Sat: 10:00 AM - 8:00 PM</span>
//             </div>
//           </div>
          
//           <div className="flex flex-wrap items-center justify-center gap-3">
//             <Link 
//               to="/contact"
//               className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition flex items-center gap-2"
//             >
//               Get Directions <ArrowRight className="w-3.5 h-3.5" />
//             </Link>
//             <Link 
//               to="/shop"
//               className="bg-stone-100 border border-stone-200 text-stone-800 px-6 py-2 rounded-full text-sm font-medium hover:bg-stone-200 transition flex items-center gap-2"
//             >
//               Shop Online <ShoppingBag className="w-3.5 h-3.5" />
//             </Link>
//           </div>
          
//           {/* Social Links */}
//           <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-stone-100">
//             <a href="#" className="p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-primary hover:text-white transition">
//               <Instagram className="w-4 h-4" />
//             </a>
//             <a href="#" className="p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-primary hover:text-white transition">
//               <Facebook className="w-4 h-4" />
//             </a>
//             <a href="#" className="p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-primary hover:text-white transition">
//               <Youtube className="w-4 h-4" />
//             </a>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default About;